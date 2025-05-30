using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using StatusEnum = server.Models.TaskStatus;  
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;


namespace server.Controllers
{
    [ApiController]
    [Route("admin/tasks")]
    [Authorize(Roles = "Admin")]
    public class AdminTasksController : ControllerBase
    {
        private readonly AppDbContext _db;
        public AdminTasksController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetAllTasks()
        {
            var tasks = await _db.Tasks
                .Include(t => t.AssignedUser)
                .Include(t => t.Category)
                .Select(t => new
                {
                    t.Id,
                    t.Title,
                    t.Description,
                    Status = t.Status.ToString(),
                    t.Deadline,
                    AssignedUser = t.AssignedUser != null
                        ? new
                        {
                            t.AssignedUser.Id,
                            t.AssignedUser.Name,
                            t.AssignedUser.Email
                        }
                        : null,
                    Category = new
                    {
                        Id = t.Category != null ? (int?)t.Category.Id : null,
                        Name = t.Category != null ? t.Category.Name : "Uncategorized"
                    },
                    t.CreatedAt,
                    t.UpdatedAt
                })
                .ToListAsync();

            return Ok(tasks);
        }



        public record AdminUpdateTaskDto(
            string? Title,
            string? Description,
            StatusEnum? Status,
            DateTimeOffset? Deadline,
            int? AssignedUserId,
            int? CategoryId
        );

        [HttpPut("{id}")]
        public async Task<IActionResult> AdminUpdateTask(int id, [FromBody] AdminUpdateTaskDto dto)
        {
            var task = await _db.Tasks.FindAsync(id);
            if (task == null)
                return NotFound(new { message = $"Task with Id {id} not found." });

            if (dto.Status.HasValue && dto.Status.Value != task.Status)
            {
                var oldStatus = task.Status;
                task.Status = dto.Status.Value;

                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

                _db.TaskHistories.Add(new TaskHistory
                {
                    TodoTaskId = id,
                    OldStatus = oldStatus,
                    NewStatus = dto.Status.Value,
                    ChangedAt = DateTimeOffset.UtcNow,
                    ChangedByUserId = currentUserId
                });
            }

            if (dto.AssignedUserId.HasValue)
            {
                if (!await _db.Users.AnyAsync(u => u.Id == dto.AssignedUserId.Value))
                    return NotFound(new { message = $"User with Id {dto.AssignedUserId.Value} not found." });
                task.AssignedUserId = dto.AssignedUserId.Value;
            }

            if (dto.CategoryId.HasValue)
            {
                if (!await _db.Categories.AnyAsync(c => c.Id == dto.CategoryId.Value))
                    return NotFound(new { message = $"Category with Id {dto.CategoryId.Value} not found." });
                task.CategoryId = dto.CategoryId.Value;
            }

            if (dto.Title != null) task.Title = dto.Title;
            if (dto.Description != null) task.Description = dto.Description;
            if (dto.Deadline.HasValue) task.Deadline = dto.Deadline.Value;

            task.UpdatedAt = DateTimeOffset.UtcNow;
            await _db.SaveChangesAsync();

            return Ok(new
            {
                task.Id,
                Status = task.Status.ToString(),
                UpdatedAt = task.UpdatedAt
            });
        }
    }
}
