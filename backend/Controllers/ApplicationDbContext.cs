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
            
            // Unique constraint on Email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
        }
    }
}