using FacultyInduction.Models;
using FacultyInduction.Data;

namespace FacultyInduction.Services
{
    public interface IScoringService
    {
        CandidateScore CalculateScore(int userId, string hiringType, string appliedPosition);
    }
    
    public class ScoringService : IScoringService
    {
        private readonly ApplicationDbContext _context;

        public ScoringService(ApplicationDbContext context)
        {
            _context = context;
        }

        public CandidateScore CalculateScore(int userId, string hiringType, string appliedPosition)
        {
            var score = new CandidateScore
            {
                UserId = userId,
                HiringType = hiringType,
                AppliedPosition = appliedPosition
            };
            
            // 1. Academic Qualification Score (Max 50)
            CalculateAcademicScore(score);
            
            // 2. Experience Score
            if (hiringType == "Permanent")
                CalculatePermanentExperienceScore(score, appliedPosition);
            else
                CalculatePOPExperienceScore(score, appliedPosition);
            
            // 3. Publication Score - Query from database
            CalculatePublicationScoreFromDatabase(score, userId);
            
            // Total
            score.TotalScore = score.AcademicQualificationScore + score.ExperienceScore + score.PublicationScore;
            
            return score;
        }

        private void CalculatePublicationScoreFromDatabase(CandidateScore score, int userId)
        {
            // Get all publications for this user from database
            var publications = _context.ResearchPublications
                .Where(p => p.UserId == userId)
                .ToList();

            // Count papers by category
            score.WCategoryPapers = publications.Count(p => p.Category == "W" && !p.IsImpactFactor);
            score.XCategoryPapers = publications.Count(p => p.Category == "X" && !p.IsImpactFactor);
            score.YCategoryPapers = publications.Count(p => p.Category == "Y" && !p.IsImpactFactor);
            score.ImpactFactorPapers = publications.Count(p => p.IsImpactFactor);

            // Calculate publication score based on hiring type
            if (score.HiringType == "Permanent")
                CalculatePermanentPublicationScore(score);
            else
                CalculatePOPPublicationScore(score);
        }
        
        private void CalculateAcademicScore(CandidateScore score)
        {
            // Degree marks (Matric=5, FSc=5, BS=5, MS=10, PhD=15)
            score.MatricScore = 5;
            score.FScScore = 5;
            score.BSScore = 5;
            score.MSScore = 10;
            score.PhDScore = 15;
            
            decimal degreeTotal = score.MatricScore + score.FScScore + score.BSScore + 
                                  score.MSScore + score.PhDScore;
            
            // GPA marks (Max 10: GPA > 3.5 = 5 marks each for BS and MS)
            // These would be populated from actual user data
            score.GPAScore = 0; // Calculate based on actual GPA
            
            score.AcademicQualificationScore = degreeTotal + score.GPAScore;
        }
        
        private void CalculatePermanentExperienceScore(CandidateScore score, string position)
        {
            // Position-based scoring
            switch (position)
            {
                case "Lecturer":
                    score.ExperienceScore = 5; // 18 years experience required
                    break;
                case "Assistant Professor":
                    score.ExperienceScore = 10; // Post PhD 5 years OR total 10 years
                    break;
                case "Associate Professor":
                    score.ExperienceScore = 15;
                    break;
                case "Professor":
                    score.ExperienceScore = 20;
                    break;
                default:
                    score.ExperienceScore = 0;
                    break;
            }
            
            // Add supervision marks (max 3)
            // MS Students: 1 mark per student (max 1)
            // PhD Students: 2 marks per student (max 2)
        }
        
        private void CalculatePOPExperienceScore(CandidateScore score, string position)
        {
            // POP hiring gives more weight to experience (Max 35)
            switch (position)
            {
                case "Lecturer":
                    score.ExperienceScore = 10;
                    break;
                case "Assistant Professor":
                    score.ExperienceScore = 20;
                    break;
                case "Associate Professor":
                    score.ExperienceScore = 28;
                    break;
                case "Professor":
                    score.ExperienceScore = 35;
                    break;
                default:
                    score.ExperienceScore = 0;
                    break;
            }
        }
        
        private void CalculatePermanentPublicationScore(CandidateScore score)
        {
            // Formula: (W × 5) + (X × 3) + (Y × 1) + (IF × 5)
            // Max 25 marks
            decimal calculated = (score.WCategoryPapers * 5) +
                                 (score.XCategoryPapers * 3) +
                                 (score.YCategoryPapers * 1) +
                                 (score.ImpactFactorPapers * 5);
            
            score.PublicationScore = Math.Min(calculated, 25);
        }
        
        private void CalculatePOPPublicationScore(CandidateScore score)
        {
            // POP hiring: Max 15 marks for publications
            decimal calculated = (score.WCategoryPapers * 3) +
                                 (score.XCategoryPapers * 2) +
                                 (score.YCategoryPapers * 1) +
                                 (score.ImpactFactorPapers * 3);
            
            score.PublicationScore = Math.Min(calculated, 15);
        }
    }
}