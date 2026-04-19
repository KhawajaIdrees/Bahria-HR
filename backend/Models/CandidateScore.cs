namespace FacultyInduction.Models
{
    public class CandidateScore
    {
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        
        // Academic Scores (Max 50)
        public decimal AcademicQualificationScore { get; set; }
        public decimal MatricScore { get; set; }
        public decimal FScScore { get; set; }
        public decimal BSScore { get; set; }
        public decimal MSScore { get; set; }
        public decimal PhDScore { get; set; }
        public decimal GPAScore { get; set; }
        
        // Experience Scores (Max 25 for Permanent, 35 for POP)
        public decimal ExperienceScore { get; set; }
        public int TotalYearsExperience { get; set; }
        public int SupervisedMSStudents { get; set; }
        public int SupervisedPhDStudents { get; set; }
        
        // Publication Scores (Max 25 for Permanent, 15 for POP)
        public decimal PublicationScore { get; set; }
        public int WCategoryPapers { get; set; }
        public int XCategoryPapers { get; set; }
        public int YCategoryPapers { get; set; }
        public int ImpactFactorPapers { get; set; }
        
        // Total
        public decimal TotalScore { get; set; }
        public string HiringType { get; set; } = "Permanent"; // Permanent or POP
        public string AppliedPosition { get; set; } = string.Empty;
    }
}