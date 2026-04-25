using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FacultyInduction.Models
{
    public class AcademicQualification
    {
        [Key]
        public int Id { get; set; }
        
        [Required(ErrorMessage = "User ID is required")]
        public int UserId { get; set; }
        
        [ForeignKey("UserId")]
        public User? User { get; set; }
        
        [Required(ErrorMessage = "Degree is required")]
        [StringLength(100, ErrorMessage = "Degree cannot exceed 100 characters")]
        public string Degree { get; set; } = string.Empty; // Matric, FSc, BS, MS, PhD
        
        [StringLength(200, ErrorMessage = "Institute cannot exceed 200 characters")]
        public string? Institute { get; set; }
        
        [StringLength(50, ErrorMessage = "Marks cannot exceed 50 characters")]
        public string? Marks { get; set; } // e.g., "85%", "3.6 GPA"
        
        [Range(0.0, 4.0, ErrorMessage = "GPA must be between 0 and 4")]
        public decimal? GPA { get; set; } // For BS and MS only
        
        [Range(1900, 2100, ErrorMessage = "Passing year must be valid")]
        public int? PassingYear { get; set; }
        
        public bool IsCompleted { get; set; } = true;
    }
}