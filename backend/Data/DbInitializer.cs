using System;
using System.Linq;
using FacultyInduction.Models;
using Microsoft.EntityFrameworkCore;

namespace FacultyInduction.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            // Ensure database is created
            context.Database.EnsureCreated();

            // Ensure Role column exists (SQL Server version)
            EnsureRoleColumn(context);

            // Create admin user if not exists
            if (!context.Users.Any(u => u.Email == "admin@faculty.com"))
            {
                var admin = new User
                {
                    Email = "admin@faculty.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    FullName = "System Administrator",
                    CreatedAt = DateTime.UtcNow,
                    Role = "Admin"
                };
                context.Users.Add(admin);
                context.SaveChanges();
            }
            else
            {
                var admin = context.Users.First(u => u.Email == "admin@faculty.com");
                if (admin.Role != "Admin")
                {
                    admin.Role = "Admin";
                    context.SaveChanges();
                }
            }
        }

        private static void EnsureRoleColumn(ApplicationDbContext context)
        {
            try
            {
                // SQL Server compatible way to check and add column
                var sql = @"
                    IF NOT EXISTS (
                        SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
                        WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'Role'
                    )
                    BEGIN
                        ALTER TABLE Users ADD [Role] NVARCHAR(50) NOT NULL DEFAULT 'Applicant'
                    END";

                context.Database.ExecuteSqlRaw(sql);
            }
            catch (Exception ex)
            {
                // Table might not exist yet - that's fine
                Console.WriteLine($"Note: {ex.Message}");
            }
        }
    }
}