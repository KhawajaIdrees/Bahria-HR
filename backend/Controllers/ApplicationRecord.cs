using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FacultyInduction.Models
{
    public class ApplicationRecord
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [ForeignKey("UserId")]
        public User? User { get; set; }
        
        [Required]
        public string HiringType { get; set; } = string.Empty; // Permanent or POP
        
        [Required]
        public string AppliedPosition { get; set; } = string.Empty; // Lecturer, Assistant Professor, etc.
        
        public decimal TotalScore { get; set; }
        
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
        
        public string Status { get; set; } = "Pending"; // Pending, Shortlisted, Rejected, Hired
    }
}