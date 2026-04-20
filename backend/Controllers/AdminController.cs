using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using FacultyInduction.Data;
using FacultyInduction.DTOs;
using FacultyInduction.Models;
using FacultyInduction.Services;

namespace FacultyInduction.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IScoringService _scoringService;

        public AdminController(ApplicationDbContext context, IScoringService scoringService)
        {
            _context = context;
            _scoringService = scoringService;
        }

        [HttpGet("applications")]
        public async Task<IActionResult> GetAllApplications()
        {
            var applications = await _context.ApplicationRecords.AsNoTracking()
                .OrderByDescending(a => (double)a.TotalScore)
                .Select(a => new
                {
                    a.Id,
                    a.AppliedPosition,
                    a.HiringType,
                    a.TotalScore,
                    a.Status,
                    a.SubmittedAt,
                    User = new
                    {
                        a.User.Id,
                        a.User.FullName,
                        a.User.Email,
                        a.User.Phone
                    }
                }).ToListAsync();

            return Ok(applications);
        }

        [HttpGet("applications/{id}")]
        public async Task<IActionResult> GetApplicationDetail(int id)
        {
            var application = await _context.ApplicationRecords
                .Include(a => a.User)
                .ThenInclude(u => u.AcademicQualifications)
                .Include(a => a.User)
                .ThenInclude(u => u.WorkExperiences)
                .Include(a => a.User)
                .ThenInclude(u => u.ResearchPublications)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (application == null)
                return NotFound();

            if (application.User == null)
                return NotFound(new { message = "This application has no linked user record." });

            var score = _scoringService.CalculateScore(application.UserId, application.HiringType, application.AppliedPosition);

            return Ok(new { Application = application, DetailedScore = score });
        }

        [HttpPut("applications/{id}/status")]
        public async Task<IActionResult> UpdateApplicationStatus(int id, [FromBody] UpdateApplicationStatusDto body)
        {
            var application = await _context.ApplicationRecords.FindAsync(id);
            if (application == null)
                return NotFound();

            application.Status = body.Status;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Application status updated to {body.Status}" });
        }

        /// <summary>Counts for admin dashboard cards.</summary>
        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var apps = _context.ApplicationRecords.AsQueryable();
            var totalSubmitted = await apps.CountAsync();
            var pending = await apps.CountAsync(a => a.Status == "Pending");
            var shortlisted = await apps.CountAsync(a => a.Status == "Shortlisted");
            var rejected = await apps.CountAsync(a => a.Status == "Rejected");
            var hired = await apps.CountAsync(a => a.Status == "Hired");

            var submittedUserIds = await _context.ApplicationRecords
                .Select(a => a.UserId)
                .Distinct()
                .ToListAsync();

            var incompleteProfiles = await _context.Users
                .CountAsync(u => u.Role == "Applicant" && !submittedUserIds.Contains(u.Id));

            return Ok(new
            {
                totalSubmitted,
                pending,
                shortlisted,
                rejected,
                hired,
                incompleteProfiles
            });
        }

        /// <summary>Registered applicants who have not submitted a final application yet.</summary>
        [HttpGet("applicants/incomplete")]
        public async Task<IActionResult> GetIncompleteApplicants()
        {
            var submittedUserIds = await _context.ApplicationRecords
                .Select(a => a.UserId)
                .Distinct()
                .ToListAsync();

            var list = await _context.Users
                .Where(u => u.Role == "Applicant" && !submittedUserIds.Contains(u.Id))
                .OrderByDescending(u => u.CreatedAt)
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.Email,
                    u.Phone,
                    RegisteredAt = u.CreatedAt
                })
                .ToListAsync();

            return Ok(list);
        }

        [HttpGet("shortlisted")]
        public async Task<IActionResult> GetShortlistedCandidates()
        {
            var shortlisted = await _context.ApplicationRecords.AsNoTracking()
                .Where(a => a.Status == "Shortlisted" || a.TotalScore >= 70)
                .OrderByDescending(a => (double)a.TotalScore)
                .Select(a => new
                {
                    a.Id,
                    a.AppliedPosition,
                    a.HiringType,
                    a.TotalScore,
                    a.Status,
                    User = new
                    {
                        a.User.FullName,
                        a.User.Email,
                        a.User.Phone
                    }
                }).ToListAsync();

            return Ok(shortlisted);
        }
    }
}