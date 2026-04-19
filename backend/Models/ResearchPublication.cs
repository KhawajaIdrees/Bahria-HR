using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FacultyInduction.Models
{
    public class ResearchPublication
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [ForeignKey("UserId")]
        public User? User { get; set; }
        
        [Required]
        public string Title { get; set; } = string.Empty;
        
        public string? JournalName { get; set; }
        
        public string? ConferenceName { get; set; }
        
        public int PublicationYear { get; set; }
        
        public string? DOI { get; set; }
        
        public string? Category { get; set; } // W, X, Y, IF
        
        public bool IsImpactFactor { get; set; } // WoS Indexed
        
        public string? Publisher { get; set; }
        
        public string? Authors { get; set; }
    }
}