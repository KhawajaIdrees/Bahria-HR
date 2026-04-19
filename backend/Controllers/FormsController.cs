using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using FacultyInduction.Data;
using FacultyInduction.Models;
using FacultyInduction.DTOs;
using FacultyInduction.Services;

namespace FacultyInduction.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FormsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IScoringService _scoringService;
        
        public FormsController(ApplicationDbContext context, IScoringService scoringService)
        {
            _context = context;
            _scoringService = scoringService;
        }
        
        private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        
        // Academic Qualification
        [HttpPost("academic-qualifications")]
        public async Task<IActionResult> AddAcademicQualifications(List<AcademicQualificationDto> qualifications)
        {
            var userId = GetUserId();
            
            foreach (var q in qualifications)
            {
                var qualification = new AcademicQualification
                {
                    UserId = userId,
                    Degree = q.Degree,
                    Institute = q.Institute,
                    Marks = q.Marks,
                    GPA = q.GPA,
                    PassingYear = q.PassingYear
                };
                _context.AcademicQualifications.Add(qualification);
            }
            
            await _context.SaveChangesAsync();
            return Ok(new { message = "Academic qualifications saved" });
        }
        
        [HttpGet("academic-qualifications")]
        public async Task<IActionResult> GetAcademicQualifications()
        {
            var userId = GetUserId();
            var qualifications = await _context.AcademicQualifications
                .Where(q => q.UserId == userId)
                .ToListAsync();
            return Ok(qualifications);
        }
        
        // Work Experience
        [HttpPost("work-experiences")]
        public async Task<IActionResult> AddWorkExperiences(List<WorkExperienceDto> experiences)
        {
            var userId = GetUserId();
            
            foreach (var exp in experiences)
            {
                var experience = new WorkExperience
                {
                    UserId = userId,
                    OrganizationName = exp.OrganizationName,
                    PositionTitle = exp.PositionTitle,
                    StartDate = exp.StartDate,
                    EndDate = exp.EndDate,
                    IsCurrentJob = exp.IsCurrentJob
                };
                _context.WorkExperiences.Add(experience);
            }
            
            await _context.SaveChangesAsync();
            return Ok(new { message = "Work experiences saved" });
        }
        
        [HttpGet("work-experiences")]
        public async Task<IActionResult> GetWorkExperiences()
        {
            var userId = GetUserId();
            var experiences = await _context.WorkExperiences
                .Where(e => e.UserId == userId)
                .OrderByDescending(e => e.StartDate)
                .ToListAsync();
            return Ok(experiences);
        }
        
        // Research Publications
        [HttpPost("research-publications")]
        public async Task<IActionResult> AddResearchPublications(List<ResearchPublicationDto> publications)
        {
            var userId = GetUserId();
            
            foreach (var pub in publications)
            {
                var publication = new ResearchPublication
                {
                    UserId = userId,
                    Title = pub.Title,
                    JournalName = pub.JournalName,
                    ConferenceName = pub.ConferenceName,
                    PublicationYear = pub.PublicationYear,
                    Category = pub.Category,
                    IsImpactFactor = pub.IsImpactFactor
                };
                _context.ResearchPublications.Add(publication);
            }
            
            await _context.SaveChangesAsync();
            return Ok(new { message = "Research publications saved" });
        }
        
        [HttpGet("research-publications")]
        public async Task<IActionResult> GetResearchPublications()
        {
            var userId = GetUserId();
            var publications = await _context.ResearchPublications
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.PublicationYear)
                .ToListAsync();
            return Ok(publications);
        }
        
        // Calculate Score
        [HttpGet("score")]
        public async Task<IActionResult> GetScore([FromQuery] string hiringType = "Permanent", [FromQuery] string position = "Lecturer")
        {
            var userId = GetUserId();
            var score = _scoringService.CalculateScore(userId, hiringType, position);
            return Ok(score);
        }
        
        // Submit all forms (final submission)
        [HttpPost("submit")]
        public async Task<IActionResult> SubmitApplication([FromQuery] string hiringType, [FromQuery] string position)
        {
            var userId = GetUserId();
            
            // Check if all required forms are filled
            var hasQualifications = await _context.AcademicQualifications.AnyAsync(q => q.UserId == userId);
            var hasExperience = await _context.WorkExperiences.AnyAsync(e => e.UserId == userId);
            var hasPublications = await _context.ResearchPublications.AnyAsync(p => p.UserId == userId);
            
            if (!hasQualifications || !hasExperience || !hasPublications)
                return BadRequest(new { message = "Please complete all forms before submitting" });
            
            var score = _scoringService.CalculateScore(userId, hiringType, position);
            
            // Save application record
            var application = new ApplicationRecord
            {
                UserId = userId,
                HiringType = hiringType,
                AppliedPosition = position,
                TotalScore = score.TotalScore,
                SubmittedAt = DateTime.UtcNow,
                Status = "Pending"
            };
            
            _context.ApplicationRecords.Add(application);
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Application submitted successfully", score });
        }
        
        [HttpGet("application-status")]
        public async Task<IActionResult> GetApplicationStatus()
        {
            var userId = GetUserId();
            var application = await _context.ApplicationRecords
                .FirstOrDefaultAsync(a => a.UserId == userId);

            if (application == null)
            {
                return Ok(new { hasSubmitted = false });
            }

            return Ok(new
            {
                hasSubmitted = true,
                status = application.Status,
                application = new
                {
                    application.SubmittedAt,
                    application.TotalScore,
                    application.AppliedPosition,
                    application.HiringType
                }
            });
        }
    }
}