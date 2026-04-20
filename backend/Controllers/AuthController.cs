using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using System.Text;
using FacultyInduction.Data;
using FacultyInduction.Models;
using FacultyInduction.DTOs;
using BCrypt.Net;

namespace FacultyInduction.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        
        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            // Check if user exists
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
                return BadRequest(new { message = "Email already exists" });
            
            var user = new User
            {
                Email = registerDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                FullName = registerDto.FullName,
                CNIC = registerDto.CNIC,
                DateOfBirth = registerDto.DateOfBirth,
                Phone = registerDto.Phone,
                Role = "Applicant"
            };
            
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "User registered successfully", userId = user.Id });
        }
        
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                return Unauthorized(new { message = "Invalid email or password" });
            
            var token = GenerateJwtToken(user);
            
            return Ok(new { token, user = new { user.Id, user.Email, fullName = user.FullName, role = user.Role } });
        }
        
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto forgotDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == forgotDto.Email);
            
            if (user == null)
                return Ok(new { message = "If email exists, reset link will be sent" });
            
            // Generate reset token
            var token = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
            user.ResetPasswordToken = token;
            user.ResetTokenExpiry = DateTime.UtcNow.AddHours(1);
            
            await _context.SaveChangesAsync();
            
            // In production, send email here
            return Ok(new { message = "Password reset link generated", token });
        }
        
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto resetDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => 
                u.ResetPasswordToken == resetDto.Token && u.ResetTokenExpiry > DateTime.UtcNow);
            
            if (user == null)
                return BadRequest(new { message = "Invalid or expired token" });
            
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(resetDto.NewPassword);
            user.ResetPasswordToken = null;
            user.ResetTokenExpiry = null;
            
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Password reset successfully" });
        }

        [HttpPut("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            // Extract the UserId from the current logged-in JWT token
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out int userId)) return Unauthorized();

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound("User not found");

            // Verify old password
            if (!BCrypt.Net.BCrypt.Verify(dto.OldPassword, user.PasswordHash))
            {
                return BadRequest("Incorrect current password.");
            }

            // Hash and save new password
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password updated successfully" });
        }

        // Add this DTO at the bottom of the file (outside the controller class)
        public class ChangePasswordDto
        {
            public string OldPassword { get; set; }
            public string NewPassword { get; set; }
        }
                
        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"] ?? "your-secret-key-here-minimum-32-characters-long"));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Role, user.Role)
            };
            
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: credentials
            );
            
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}