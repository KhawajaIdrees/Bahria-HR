using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FacultyInduction.DTOs
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [MinLength(6)]
        [JsonPropertyName("password")]
        public string Password { get; set; } = string.Empty;
        
        [Required]
        [JsonPropertyName("fullName")]
        public string FullName { get; set; } = string.Empty;
        
        [JsonPropertyName("cnic")]
        public string? CNIC { get; set; }
        
        [JsonPropertyName("dateOfBirth")]
        public DateTime? DateOfBirth { get; set; }
        
        [JsonPropertyName("phone")]
        public string? Phone { get; set; }
    }
    
    public class LoginDto
    {
        [Required]
        [EmailAddress]
        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [JsonPropertyName("password")]
        public string Password { get; set; } = string.Empty;
    }
    
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
    
    public class ResetPasswordDto
    {
        [Required]
        public string Token { get; set; } = string.Empty;
        
        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; } = string.Empty;
    }
    
    public class AcademicQualificationDto
    {
        public string Degree { get; set; } = string.Empty;
        public string? Institute { get; set; }
        public string? Marks { get; set; }
        public decimal? GPA { get; set; }
        public int? PassingYear { get; set; }
    }
    
    public class WorkExperienceDto
    {
        public string OrganizationName { get; set; } = string.Empty;
        public string PositionTitle { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsCurrentJob { get; set; }
    }
    
    public class ResearchPublicationDto
    {
        public string Title { get; set; } = string.Empty;
        public string? JournalName { get; set; }
        public string? ConferenceName { get; set; }
        public int PublicationYear { get; set; }
        public string? Category { get; set; }
        public bool IsImpactFactor { get; set; }
    }
}