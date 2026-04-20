using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using FacultyInduction.Data;
using FacultyInduction.Models;

namespace FacultyInduction.Controllers; // <-- Added the namespace here!

[Route("api/[controller]")]
[ApiController]
[Authorize] 
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UsersController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdStr, out int userId)) return Unauthorized();

        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound("User not found");

        // Update fields if they were provided
        user.FullName = dto.FullName ?? user.FullName;
        user.Phone = dto.Phone ?? user.Phone;
        
        if (!string.IsNullOrEmpty(dto.ProfileImageBase64))
        {
            user.ProfileImageBase64 = dto.ProfileImageBase64;
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Profile updated successfully" });
    }
}

public class UpdateProfileDto
{
    public string? FullName { get; set; }
    public string? Phone { get; set; }
    public string? ProfileImageBase64 { get; set; }
}