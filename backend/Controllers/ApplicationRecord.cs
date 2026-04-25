using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FacultyInduction.Models
{
    public class ApplicationRecord
    {
        [Key]
        public int Id { get; set; }
        
        [Required(ErrorMessage = "User ID is required")]
        public int UserId { get; set; }
        
        [ForeignKey("UserId")]
        public User? User { get; set; }
        
        [Required(ErrorMessage = "Hiring type is required")]
        [StringLength(100, ErrorMessage = "Hiring type cannot exceed 100 characters")]
        public string HiringType { get; set; } = string.Empty; // Permanent or POP
        
        [Required(ErrorMessage = "Applied position is required")]
        [StringLength(150, MinimumLength = 2, ErrorMessage = "Applied position must be between 2 and 150 characters")]
        public string AppliedPosition { get; set; } = string.Empty; // Lecturer, Assistant Professor, etc.
        
        [Range(0, 100, ErrorMessage = "Total score must be between 0 and 100")]
        public decimal TotalScore { get; set; }
        
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
        
        [StringLength(50, ErrorMessage = "Status cannot exceed 50 characters")]
        public string Status { get; set; } = "Pending"; // Pending, Shortlisted, Rejected, Hired
    }
}