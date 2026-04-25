using System.ComponentModel.DataAnnotations;

namespace FacultyInduction.DTOs
{
    /// <summary>Generic response wrapper for API responses</summary>
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public List<string>? Errors { get; set; }
    }

    /// <summary>Generic response without data</summary>
    public class ApiResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<string>? Errors { get; set; }
    }

    // ============= ENHANCED DTOs FOR UPSERT OPERATIONS =============
    
    public class AcademicQualificationDataDto
    {
        public int? Id { get; set; }
        public int UserId { get; set; }
        
        [Required(ErrorMessage = "Degree is required")]
        [StringLength(100)]
        public string Degree { get; set; } = string.Empty;
        
        [StringLength(200)]
        public string? Institute { get; set; }
        
        [StringLength(50)]
        public string? Marks { get; set; }
        
        [Range(0.0, 4.0)]
        public decimal? GPA { get; set; }
        
        [Range(1900, 2100)]
        public int? PassingYear { get; set; }
        
        public bool IsCompleted { get; set; } = true;
    }

    public class WorkExperienceDataDto
    {
        public int? Id { get; set; }
        public int UserId { get; set; }
        
        [Required(ErrorMessage = "Organization name is required")]
        [StringLength(200, MinimumLength = 2)]
        public string OrganizationName { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Position title is required")]
        [StringLength(150, MinimumLength = 2)]
        public string PositionTitle { get; set; } = string.Empty;
        
        [Required]
        public DateTime StartDate { get; set; }
        
        public DateTime? EndDate { get; set; }
        
        public bool IsCurrentJob { get; set; }
        
        [StringLength(50)]
        public string? JobType { get; set; }
    }

    public class ResearchPublicationDataDto
    {
        public int? Id { get; set; }
        public int UserId { get; set; }
        
        [Required(ErrorMessage = "Title is required")]
        [StringLength(300, MinimumLength = 5)]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(200)]
        public string? JournalName { get; set; }
        
        [StringLength(200)]
        public string? ConferenceName { get; set; }
        
        [Range(1900, 2100)]
        public int PublicationYear { get; set; }
        
        [StringLength(100)]
        public string? DOI { get; set; }
        
        [StringLength(50)]
        public string? Category { get; set; }
        
        public bool IsImpactFactor { get; set; }
        
        [StringLength(300)]
        public string? Publisher { get; set; }
        
        [StringLength(500)]
        public string? Authors { get; set; }
    }

    public class ApplicationRecordDataDto
    {
        public int? Id { get; set; }
        public int UserId { get; set; }
        
        [Required(ErrorMessage = "Hiring type is required")]
        [StringLength(100)]
        public string HiringType { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Applied position is required")]
        [StringLength(150, MinimumLength = 2)]
        public string AppliedPosition { get; set; } = string.Empty;
        
        [Range(0, 100)]
        public decimal TotalScore { get; set; }
        
        [StringLength(50)]
        public string Status { get; set; } = "Pending";
    }
}
