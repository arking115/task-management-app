using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddChangedByToTaskHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ChangedByUserId",
                table: "TaskHistories",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_TaskHistories_ChangedByUserId",
                table: "TaskHistories",
                column: "ChangedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskHistories_Users_ChangedByUserId",
                table: "TaskHistories",
                column: "ChangedByUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskHistories_Users_ChangedByUserId",
                table: "TaskHistories");

            migrationBuilder.DropIndex(
                name: "IX_TaskHistories_ChangedByUserId",
                table: "TaskHistories");

            migrationBuilder.DropColumn(
                name: "ChangedByUserId",
                table: "TaskHistories");
        }
    }
}
