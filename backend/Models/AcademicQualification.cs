using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FacultyInduction.Models
{
    public class AcademicQualification
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [ForeignKey("UserId")]
        public User? User { get; set; }
        
        [Required]
        public string Degree { get; set; } = string.Empty; // Matric, FSc, BS, MS, PhD
        
        public string? Institute { get; set; }
        
        public string? Marks { get; set; } // e.g., "85%", "3.6 GPA"
        
        public decimal? GPA { get; set; } // For BS and MS only
        
        public int? PassingYear { get; set; }
        
        public bool IsCompleted { get; set; } = true;
    }
}