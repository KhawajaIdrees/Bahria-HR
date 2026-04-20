using System.ComponentModel.DataAnnotations;

namespace FacultyInduction.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        [Required]
        public string FullName { get; set; } = string.Empty;
        public string? CNIC { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Phone { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        /// <summary>Applicant, Admin, etc.</summary>
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