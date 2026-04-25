using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FacultyInduction.Models
{
    public class WorkExperience
    {
        [Key]
        public int Id { get; set; }
        
        [Required(ErrorMessage = "User ID is required")]
        public int UserId { get; set; }
        
        [ForeignKey("UserId")]
        public User? User { get; set; }
        
        [Required(ErrorMessage = "Organization name is required")]
        [StringLength(200, MinimumLength = 2, ErrorMessage = "Organization name must be between 2 and 200 characters")]
        public string OrganizationName { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Position title is required")]
        [StringLength(150, MinimumLength = 2, ErrorMessage = "Position title must be between 2 and 150 characters")]
        public string PositionTitle { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Start date is required")]
        public DateTime StartDate { get; set; }
        
        public DateTime? EndDate { get; set; } // Null if currently working
        
        public bool IsCurrentJob { get; set; }
        
        [StringLength(50, ErrorMessage = "Job type cannot exceed 50 characters")]
        public string? JobType { get; set; } // Teaching, Research, Industry
    }
}