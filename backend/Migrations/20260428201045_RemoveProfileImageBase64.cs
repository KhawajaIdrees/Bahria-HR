using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FacultyInduction.Migrations
{
    /// <inheritdoc />
    public partial class RemoveProfileImageBase64 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfileImageBase64",
                table: "Users");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProfileImageBase64",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
