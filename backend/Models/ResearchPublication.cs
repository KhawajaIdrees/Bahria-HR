using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FacultyInduction.Models
{
    public class ResearchPublication
    {
        [Key]
        public int Id { get; set; }
        
        [Required(ErrorMessage = "User ID is required")]
        public int UserId { get; set; }
        
        [ForeignKey("UserId")]
        public User? User { get; set; }
        
        [Required(ErrorMessage = "Title is required")]
        [StringLength(300, MinimumLength = 5, ErrorMessage = "Title must be between 5 and 300 characters")]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(200, ErrorMessage = "Journal name cannot exceed 200 characters")]
        public string? JournalName { get; set; }
        
        [StringLength(200, ErrorMessage = "Conference name cannot exceed 200 characters")]
        public string? ConferenceName { get; set; }
        
        [Range(1900, 2100, ErrorMessage = "Publication year must be valid")]
        public int PublicationYear { get; set; }
        
        [StringLength(100, ErrorMessage = "DOI cannot exceed 100 characters")]
        public string? DOI { get; set; }
        
        [StringLength(50, ErrorMessage = "Category cannot exceed 50 characters")]
        public string? Category { get; set; } // W, X, Y, IF
        
        public bool IsImpactFactor { get; set; } // WoS Indexed
        
        [StringLength(300, ErrorMessage = "Publisher cannot exceed 300 characters")]
        public string? Publisher { get; set; }
        
        [StringLength(500, ErrorMessage = "Authors cannot exceed 500 characters")]
        public string? Authors { get; set; }
    }
}