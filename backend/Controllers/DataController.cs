using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FacultyInduction.Data;
using FacultyInduction.DTOs;
using FacultyInduction.Models;
using FacultyInduction.Services;

namespace FacultyInduction.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DataController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IGenericDataService _dataService;

        public DataController(ApplicationDbContext context, IGenericDataService dataService)
        {
            _context = context;
            _dataService = dataService;
        }

        // ============= ACADEMIC QUALIFICATIONS =============
        /// <summary>Upsert Academic Qualification (Create if new, Update if exists)</summary>
        [HttpPost("academic-qualifications/upsert")]
        public async Task<ActionResult<ApiResponse<AcademicQualificationDataDto>>> UpsertAcademicQualification([FromBody] AcademicQualificationDataDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                    return BadRequest(new ApiResponse<AcademicQualificationDataDto>
                    {
                        Success = false,
                        Message = "Validation failed",
                        Errors = errors
                    });
                }

                var entity = new AcademicQualification
                {
                    Id = dto.Id ?? 0,
                    UserId = dto.UserId,
                    Degree = dto.Degree,
                    Institute = dto.Institute,
                    Marks = dto.Marks,
                    GPA = dto.GPA,
                    PassingYear = dto.PassingYear,
                    IsCompleted = dto.IsCompleted
                };

                var predicate = dto.Id.HasValue && dto.Id.Value > 0
                    ? (System.Linq.Expressions.Expression<Func<AcademicQualification, bool>>)(aq => aq.Id == dto.Id.Value)
                    : (aq => aq.UserId == dto.UserId && aq.Degree == dto.Degree);

                var (success, message, data) = await _dataService.UpsertAsync(entity, predicate);

                if (success)
                {
                    var responseDto = new AcademicQualificationDataDto
                    {
                        Id = data?.Id,
                        UserId = data?.UserId ?? 0,
                        Degree = data?.Degree ?? string.Empty,
                        Institute = data?.Institute,
                        Marks = data?.Marks,
                        GPA = data?.GPA,
                        PassingYear = data?.PassingYear,
                        IsCompleted = data?.IsCompleted ?? false
                    };

                    return Ok(new ApiResponse<AcademicQualificationDataDto>
                    {
                        Success = true,
                        Message = message,
                        Data = responseDto
                    });
                }

                return BadRequest(new ApiResponse<AcademicQualificationDataDto>
                {
                    Success = false,
                    Message = message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<AcademicQualificationDataDto>
                {
                    Success = false,
                    Message = "An error occurred",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>Get Academic Qualifications by User ID</summary>
        [HttpGet("academic-qualifications/user/{userId}")]
        public async Task<ActionResult<ApiResponse<List<AcademicQualificationDataDto>>>> GetUserAcademicQualifications(int userId)
        {
            try
            {
                var qualifications = await _context.AcademicQualifications
                    .Where(aq => aq.UserId == userId)
                    .ToListAsync();

                var dtos = qualifications.Select(aq => new AcademicQualificationDataDto
                {
                    Id = aq.Id,
                    UserId = aq.UserId,
                    Degree = aq.Degree,
                    Institute = aq.Institute,
                    Marks = aq.Marks,
                    GPA = aq.GPA,
                    PassingYear = aq.PassingYear,
                    IsCompleted = aq.IsCompleted
                }).ToList();

                return Ok(new ApiResponse<List<AcademicQualificationDataDto>>
                {
                    Success = true,
                    Message = "Records retrieved successfully",
                    Data = dtos
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<List<AcademicQualificationDataDto>>
                {
                    Success = false,
                    Message = "Error retrieving records",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>Delete Academic Qualification by ID</summary>
        [HttpDelete("academic-qualifications/{id}")]
        public async Task<ActionResult<ApiResponse>> DeleteAcademicQualification(int id)
        {
            try
            {
                var (success, message) = await _dataService.DeleteAsync<AcademicQualification>(id);

                return success
                    ? Ok(new ApiResponse { Success = true, Message = message })
                    : NotFound(new ApiResponse { Success = false, Message = message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "Error deleting record",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        // ============= WORK EXPERIENCE =============
        /// <summary>Upsert Work Experience (Create if new, Update if exists)</summary>
        [HttpPost("work-experience/upsert")]
        public async Task<ActionResult<ApiResponse<WorkExperienceDataDto>>> UpsertWorkExperience([FromBody] WorkExperienceDataDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                    return BadRequest(new ApiResponse<WorkExperienceDataDto>
                    {
                        Success = false,
                        Message = "Validation failed",
                        Errors = errors
                    });
                }

                var entity = new WorkExperience
                {
                    Id = dto.Id ?? 0,
                    UserId = dto.UserId,
                    OrganizationName = dto.OrganizationName,
                    PositionTitle = dto.PositionTitle,
                    StartDate = dto.StartDate,
                    EndDate = dto.EndDate,
                    IsCurrentJob = dto.IsCurrentJob,
                    JobType = dto.JobType
                };

                var predicate = dto.Id.HasValue && dto.Id.Value > 0
                    ? (System.Linq.Expressions.Expression<Func<WorkExperience, bool>>)(we => we.Id == dto.Id.Value)
                    : (we => we.UserId == dto.UserId && we.OrganizationName == dto.OrganizationName && we.PositionTitle == dto.PositionTitle);

                var (success, message, data) = await _dataService.UpsertAsync(entity, predicate);

                if (success)
                {
                    var responseDto = new WorkExperienceDataDto
                    {
                        Id = data?.Id,
                        UserId = data?.UserId ?? 0,
                        OrganizationName = data?.OrganizationName ?? string.Empty,
                        PositionTitle = data?.PositionTitle ?? string.Empty,
                        StartDate = data?.StartDate ?? DateTime.MinValue,
                        EndDate = data?.EndDate,
                        IsCurrentJob = data?.IsCurrentJob ?? false,
                        JobType = data?.JobType
                    };

                    return Ok(new ApiResponse<WorkExperienceDataDto>
                    {
                        Success = true,
                        Message = message,
                        Data = responseDto
                    });
                }

                return BadRequest(new ApiResponse<WorkExperienceDataDto>
                {
                    Success = false,
                    Message = message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<WorkExperienceDataDto>
                {
                    Success = false,
                    Message = "An error occurred",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>Get Work Experience by User ID</summary>
        [HttpGet("work-experience/user/{userId}")]
        public async Task<ActionResult<ApiResponse<List<WorkExperienceDataDto>>>> GetUserWorkExperience(int userId)
        {
            try
            {
                var experiences = await _context.WorkExperiences
                    .Where(we => we.UserId == userId)
                    .ToListAsync();

                var dtos = experiences.Select(we => new WorkExperienceDataDto
                {
                    Id = we.Id,
                    UserId = we.UserId,
                    OrganizationName = we.OrganizationName,
                    PositionTitle = we.PositionTitle,
                    StartDate = we.StartDate,
                    EndDate = we.EndDate,
                    IsCurrentJob = we.IsCurrentJob,
                    JobType = we.JobType
                }).ToList();

                return Ok(new ApiResponse<List<WorkExperienceDataDto>>
                {
                    Success = true,
                    Message = "Records retrieved successfully",
                    Data = dtos
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<List<WorkExperienceDataDto>>
                {
                    Success = false,
                    Message = "Error retrieving records",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>Delete Work Experience by ID</summary>
        [HttpDelete("work-experience/{id}")]
        public async Task<ActionResult<ApiResponse>> DeleteWorkExperience(int id)
        {
            try
            {
                var (success, message) = await _dataService.DeleteAsync<WorkExperience>(id);

                return success
                    ? Ok(new ApiResponse { Success = true, Message = message })
                    : NotFound(new ApiResponse { Success = false, Message = message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "Error deleting record",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        // ============= RESEARCH PUBLICATIONS =============
        /// <summary>Upsert Research Publication (Create if new, Update if exists)</summary>
        [HttpPost("research-publications/upsert")]
        public async Task<ActionResult<ApiResponse<ResearchPublicationDataDto>>> UpsertResearchPublication([FromBody] ResearchPublicationDataDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                    return BadRequest(new ApiResponse<ResearchPublicationDataDto>
                    {
                        Success = false,
                        Message = "Validation failed",
                        Errors = errors
                    });
                }

                var entity = new ResearchPublication
                {
                    Id = dto.Id ?? 0,
                    UserId = dto.UserId,
                    Title = dto.Title,
                    JournalName = dto.JournalName,
                    ConferenceName = dto.ConferenceName,
                    PublicationYear = dto.PublicationYear,
                    DOI = dto.DOI,
                    Category = dto.Category,
                    IsImpactFactor = dto.IsImpactFactor,
                    Publisher = dto.Publisher,
                    Authors = dto.Authors
                };

                var predicate = dto.Id.HasValue && dto.Id.Value > 0
                    ? (System.Linq.Expressions.Expression<Func<ResearchPublication, bool>>)(rp => rp.Id == dto.Id.Value)
                    : (rp => rp.UserId == dto.UserId && rp.Title == dto.Title && rp.PublicationYear == dto.PublicationYear);

                var (success, message, data) = await _dataService.UpsertAsync(entity, predicate);

                if (success)
                {
                    var responseDto = new ResearchPublicationDataDto
                    {
                        Id = data?.Id,
                        UserId = data?.UserId ?? 0,
                        Title = data?.Title ?? string.Empty,
                        JournalName = data?.JournalName,
                        ConferenceName = data?.ConferenceName,
                        PublicationYear = data?.PublicationYear ?? 0,
                        DOI = data?.DOI,
                        Category = data?.Category,
                        IsImpactFactor = data?.IsImpactFactor ?? false,
                        Publisher = data?.Publisher,
                        Authors = data?.Authors
                    };

                    return Ok(new ApiResponse<ResearchPublicationDataDto>
                    {
                        Success = true,
                        Message = message,
                        Data = responseDto
                    });
                }

                return BadRequest(new ApiResponse<ResearchPublicationDataDto>
                {
                    Success = false,
                    Message = message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<ResearchPublicationDataDto>
                {
                    Success = false,
                    Message = "An error occurred",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>Get Research Publications by User ID</summary>
        [HttpGet("research-publications/user/{userId}")]
        public async Task<ActionResult<ApiResponse<List<ResearchPublicationDataDto>>>> GetUserResearchPublications(int userId)
        {
            try
            {
                var publications = await _context.ResearchPublications
                    .Where(rp => rp.UserId == userId)
                    .ToListAsync();

                var dtos = publications.Select(rp => new ResearchPublicationDataDto
                {
                    Id = rp.Id,
                    UserId = rp.UserId,
                    Title = rp.Title,
                    JournalName = rp.JournalName,
                    ConferenceName = rp.ConferenceName,
                    PublicationYear = rp.PublicationYear,
                    DOI = rp.DOI,
                    Category = rp.Category,
                    IsImpactFactor = rp.IsImpactFactor,
                    Publisher = rp.Publisher,
                    Authors = rp.Authors
                }).ToList();

                return Ok(new ApiResponse<List<ResearchPublicationDataDto>>
                {
                    Success = true,
                    Message = "Records retrieved successfully",
                    Data = dtos
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<List<ResearchPublicationDataDto>>
                {
                    Success = false,
                    Message = "Error retrieving records",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>Delete Research Publication by ID</summary>
        [HttpDelete("research-publications/{id}")]
        public async Task<ActionResult<ApiResponse>> DeleteResearchPublication(int id)
        {
            try
            {
                var (success, message) = await _dataService.DeleteAsync<ResearchPublication>(id);

                return success
                    ? Ok(new ApiResponse { Success = true, Message = message })
                    : NotFound(new ApiResponse { Success = false, Message = message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "Error deleting record",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        // ============= APPLICATION RECORDS =============
        /// <summary>Upsert Application Record (Create if new, Update if exists)</summary>
        [HttpPost("application-records/upsert")]
        public async Task<ActionResult<ApiResponse<ApplicationRecordDataDto>>> UpsertApplicationRecord([FromBody] ApplicationRecordDataDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                    return BadRequest(new ApiResponse<ApplicationRecordDataDto>
                    {
                        Success = false,
                        Message = "Validation failed",
                        Errors = errors
                    });
                }

                var entity = new ApplicationRecord
                {
                    Id = dto.Id ?? 0,
                    UserId = dto.UserId,
                    HiringType = dto.HiringType,
                    AppliedPosition = dto.AppliedPosition,
                    TotalScore = dto.TotalScore,
                    Status = dto.Status
                };

                var predicate = dto.Id.HasValue && dto.Id.Value > 0
                    ? (System.Linq.Expressions.Expression<Func<ApplicationRecord, bool>>)(ar => ar.Id == dto.Id.Value)
                    : (ar => ar.UserId == dto.UserId && ar.AppliedPosition == dto.AppliedPosition && ar.HiringType == dto.HiringType);

                var (success, message, data) = await _dataService.UpsertAsync(entity, predicate);

                if (success)
                {
                    var responseDto = new ApplicationRecordDataDto
                    {
                        Id = data?.Id,
                        UserId = data?.UserId ?? 0,
                        HiringType = data?.HiringType ?? string.Empty,
                        AppliedPosition = data?.AppliedPosition ?? string.Empty,
                        TotalScore = data?.TotalScore ?? 0,
                        Status = data?.Status ?? "Pending"
                    };

                    return Ok(new ApiResponse<ApplicationRecordDataDto>
                    {
                        Success = true,
                        Message = message,
                        Data = responseDto
                    });
                }

                return BadRequest(new ApiResponse<ApplicationRecordDataDto>
                {
                    Success = false,
                    Message = message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<ApplicationRecordDataDto>
                {
                    Success = false,
                    Message = "An error occurred",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>Get Application Records by User ID</summary>
        [HttpGet("application-records/user/{userId}")]
        public async Task<ActionResult<ApiResponse<List<ApplicationRecordDataDto>>>> GetUserApplicationRecords(int userId)
        {
            try
            {
                var records = await _context.ApplicationRecords
                    .Where(ar => ar.UserId == userId)
                    .ToListAsync();

                var dtos = records.Select(ar => new ApplicationRecordDataDto
                {
                    Id = ar.Id,
                    UserId = ar.UserId,
                    HiringType = ar.HiringType,
                    AppliedPosition = ar.AppliedPosition,
                    TotalScore = ar.TotalScore,
                    Status = ar.Status
                }).ToList();

                return Ok(new ApiResponse<List<ApplicationRecordDataDto>>
                {
                    Success = true,
                    Message = "Records retrieved successfully",
                    Data = dtos
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<List<ApplicationRecordDataDto>>
                {
                    Success = false,
                    Message = "Error retrieving records",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>Delete Application Record by ID</summary>
        [HttpDelete("application-records/{id}")]
        public async Task<ActionResult<ApiResponse>> DeleteApplicationRecord(int id)
        {
            try
            {
                var (success, message) = await _dataService.DeleteAsync<ApplicationRecord>(id);

                return success
                    ? Ok(new ApiResponse { Success = true, Message = message })
                    : NotFound(new ApiResponse { Success = false, Message = message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "Error deleting record",
                    Errors = new List<string> { ex.Message }
                });
            }
        }
    }
}
