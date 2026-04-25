using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FacultyInduction.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [StringLength(255, ErrorMessage = "Email cannot exceed 255 characters")]
        public string Email { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Password hash is required")]
        [StringLength(500)]
        public string PasswordHash { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Full name is required")]
        [StringLength(200, MinimumLength = 2, ErrorMessage = "Full name must be between 2 and 200 characters")]
        public string FullName { get; set; } = string.Empty;
        
        [StringLength(20, ErrorMessage = "CNIC cannot exceed 20 characters")]
        public string? CNIC { get; set; }
        
        public DateTime? DateOfBirth { get; set; }
        
        [Phone(ErrorMessage = "Invalid phone number format")]
        [StringLength(20, ErrorMessage = "Phone cannot exceed 20 characters")]
        public string? Phone { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        /// <summary>Applicant, Admin, etc.</summary>
        [Required]
        [StringLength(50)]
        public string Role { get; set; } = "Applicant";
        
        public string? ProfileImageBase64 { get; set; }
        public string? ResetPasswordToken { get; set; }
        public DateTime? ResetTokenExpiry { get; set; }
        
        // Navigation properties
        public ICollection<AcademicQualification> AcademicQualifications { get; set; } = new List<AcademicQualification>();
        public ICollection<WorkExperience> WorkExperiences { get; set; } = new List<WorkExperience>();
        public ICollection<ResearchPublication> ResearchPublications { get; set; } = new List<ResearchPublication>();
    }
}