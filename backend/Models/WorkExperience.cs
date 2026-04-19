using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FacultyInduction.Models
{
    public class WorkExperience
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [ForeignKey("UserId")]
        public User? User { get; set; }
        
        [Required]
        public string OrganizationName { get; set; } = string.Empty;
        
        [Required]
        public string PositionTitle { get; set; } = string.Empty;
        
        [Required]
        public DateTime StartDate { get; set; }
        
        public DateTime? EndDate { get; set; } // Null if currently working
        
        public bool IsCurrentJob { get; set; }
        
        public string? JobType { get; set; } // Teaching, Research, Industry
    }
}