using System.Data;
using FacultyInduction.Models;
using Microsoft.EntityFrameworkCore;

namespace FacultyInduction.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            context.Database.EnsureCreated();

            // Upgrade older SQLite DBs that predate the Role column (avoid failed ALTER noise in logs)
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
            var conn = context.Database.GetDbConnection();
            var wasOpen = conn.State == ConnectionState.Open;
            if (!wasOpen) conn.Open();
            try
            {
                using var check = conn.CreateCommand();
                check.CommandText = "SELECT COUNT(*) FROM pragma_table_info('Users') WHERE name = 'Role'";
                var hasRole = Convert.ToInt64(check.ExecuteScalar() ?? 0L) > 0;
                if (hasRole) return;

                using var alter = conn.CreateCommand();
                alter.CommandText = "ALTER TABLE Users ADD COLUMN Role TEXT NOT NULL DEFAULT 'Applicant'";
                alter.ExecuteNonQuery();
            }
            finally
            {
                if (!wasOpen && conn.State == ConnectionState.Open) conn.Close();
            }
        }
    }
}