using Microsoft.EntityFrameworkCore;
using FacultyInduction.Models;

namespace FacultyInduction.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        
        public DbSet<User> Users { get; set; }
        public DbSet<AcademicQualification> AcademicQualifications { get; set; }
        public DbSet<WorkExperience> WorkExperiences { get; set; }
        public DbSet<ResearchPublication> ResearchPublications { get; set; }
        public DbSet<ApplicationRecord> ApplicationRecords { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // ============= USER TABLE CONSTRAINTS =============
            modelBuilder.Entity<User>(entity =>
            {
                // Unique constraint on Email
                entity.HasIndex(u => u.Email).IsUnique().HasName("IX_Users_Email_Unique");
                
                // Constraints on columns
                entity.Property(u => u.Email)
                    .IsRequired()
                    .HasMaxLength(255);
                
                entity.Property(u => u.PasswordHash)
                    .IsRequired()
                    .HasMaxLength(500);
                
                entity.Property(u => u.FullName)
                    .IsRequired()
                    .HasMaxLength(200);
                
                entity.Property(u => u.CNIC)
                    .HasMaxLength(20);
                
                entity.Property(u => u.Phone)
                    .HasMaxLength(20);
                
                entity.Property(u => u.Role)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasDefaultValue("Applicant");
                
                entity.Property(u => u.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");
            });

            // ============= ACADEMIC QUALIFICATION CONSTRAINTS =============
            modelBuilder.Entity<AcademicQualification>(entity =>
            {
                entity.Property(aq => aq.Degree)
                    .IsRequired()
                    .HasMaxLength(100);
                
                entity.Property(aq => aq.Institute)
                    .HasMaxLength(200);
                
                entity.Property(aq => aq.Marks)
                    .HasMaxLength(50);
                
                entity.Property(aq => aq.GPA)
                    .HasPrecision(3, 2); // 3 total digits, 2 decimal places (0.00 to 9.99)
                
                entity.Property(aq => aq.IsCompleted)
                    .HasDefaultValue(true);
                
                // Foreign key cascade
                entity.HasOne(aq => aq.User)
                    .WithMany(u => u.AcademicQualifications)
                    .HasForeignKey(aq => aq.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ============= WORK EXPERIENCE CONSTRAINTS =============
            modelBuilder.Entity<WorkExperience>(entity =>
            {
                entity.Property(we => we.OrganizationName)
                    .IsRequired()
                    .HasMaxLength(200);
                
                entity.Property(we => we.PositionTitle)
                    .IsRequired()
                    .HasMaxLength(150);
                
                entity.Property(we => we.StartDate)
                    .IsRequired();
                
                entity.Property(we => we.IsCurrentJob)
                    .HasDefaultValue(false);
                
                entity.Property(we => we.JobType)
                    .HasMaxLength(50);
                
                // Foreign key cascade
                entity.HasOne(we => we.User)
                    .WithMany(u => u.WorkExperiences)
                    .HasForeignKey(we => we.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                // Ensure EndDate > StartDate or EndDate is null
                entity.ToTable(t => t.HasCheckConstraint(
                    "CK_WorkExperience_EndDate",
                    "[EndDate] IS NULL OR [EndDate] > [StartDate]"
                ));
            });

            // ============= RESEARCH PUBLICATION CONSTRAINTS =============
            modelBuilder.Entity<ResearchPublication>(entity =>
            {
                entity.Property(rp => rp.Title)
                    .IsRequired()
                    .HasMaxLength(300);
                
                entity.Property(rp => rp.JournalName)
                    .HasMaxLength(200);
                
                entity.Property(rp => rp.ConferenceName)
                    .HasMaxLength(200);
                
                entity.Property(rp => rp.PublicationYear)
                    .IsRequired();
                
                entity.Property(rp => rp.DOI)
                    .HasMaxLength(100);
                
                entity.Property(rp => rp.Category)
                    .HasMaxLength(50);
                
                entity.Property(rp => rp.Publisher)
                    .HasMaxLength(300);
                
                entity.Property(rp => rp.Authors)
                    .HasMaxLength(500);
                
                entity.Property(rp => rp.IsImpactFactor)
                    .HasDefaultValue(false);
                
                // Foreign key cascade
                entity.HasOne(rp => rp.User)
                    .WithMany(u => u.ResearchPublications)
                    .HasForeignKey(rp => rp.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ============= APPLICATION RECORD CONSTRAINTS =============
            modelBuilder.Entity<ApplicationRecord>(entity =>
            {
                entity.Property(ar => ar.HiringType)
                    .IsRequired()
                    .HasMaxLength(100);
                
                entity.Property(ar => ar.AppliedPosition)
                    .IsRequired()
                    .HasMaxLength(150);
                
                entity.Property(ar => ar.TotalScore)
                    .HasPrecision(5, 2); // 5 total digits, 2 decimal places (0.00 to 999.99)
                
                entity.Property(ar => ar.Status)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasDefaultValue("Pending");
                
                entity.Property(ar => ar.SubmittedAt)
                    .HasDefaultValueSql("GETUTCDATE()");
                
                // Foreign key cascade
                entity.HasOne(ar => ar.User)
                    .WithMany()
                    .HasForeignKey(ar => ar.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}