using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using System.ComponentModel.DataAnnotations;
using StatusEnum = server.Models.TaskStatus;


namespace server.Controllers
{
    [ApiController]
    [Route("tasks")]
    [Authorize]
    public class TaskController : ControllerBase
    {
        private readonly AppDbContext _db;

        public TaskController(AppDbContext db) => _db = db;

        public record CreateTaskDto(
            [Required, StringLength(50)] string Title,
            string? Description,
            StatusEnum Status,
            DateTimeOffset? Deadline,
            [Required] int AssignedUserId,
            [Required] int CategoryId
        );

        public record UpdateTaskDto(
            [Required] StatusEnum Status
        );

        [HttpGet]
        public async Task<IActionResult> GetTasks(
            [FromQuery] string? status,
            [FromQuery] int? assignedUserId,
            [FromQuery] int? categoryId,
            [FromQuery] string? sortBy,
            [FromQuery] string? sortOrder)
        {
            var isAdmin = User.IsInRole("Admin");
            var q = _db.Tasks
                .Include(t => t.AssignedUser)
                .Include(t => t.Category)
                .AsQueryable();

            // non-admins see only their tasks
            if (!isAdmin)
            {
                var sub = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!int.TryParse(sub, out var userId))
                    return Unauthorized(new { message = "Invalid user ID in token." });
                q = q.Where(t => t.AssignedUserId == userId);
            }

            // filtering
            if (!string.IsNullOrEmpty(status))
            {
                if (!Enum.TryParse<StatusEnum>(status, true, out var st))
                    return BadRequest(new { message = $"Invalid status '{status}'." });
                q = q.Where(t => t.Status == st);
            }

            if (assignedUserId.HasValue)
                q = q.Where(t => t.AssignedUserId == assignedUserId.Value);
            if (categoryId.HasValue)
                q = q.Where(t => t.CategoryId == categoryId.Value);

            // sorting
            var direction = sortOrder?.Equals("desc", StringComparison.OrdinalIgnoreCase) == true
                ? "desc"
                : "asc";

            switch (sortBy?.ToLowerInvariant())
            {
                case "title":
                    q = direction == "asc" ? q.OrderBy(t => t.Title) : q.OrderByDescending(t => t.Title);
                    break;
                case "deadline":
                    q = direction == "asc" ? q.OrderBy(t => t.Deadline) : q.OrderByDescending(t => t.Deadline);
                    break;
                case "updatedat":
                    q = direction == "asc" ? q.OrderBy(t => t.UpdatedAt) : q.OrderByDescending(t => t.UpdatedAt);
                    break;
                case "createdat":
                    q = direction == "asc" ? q.OrderBy(t => t.CreatedAt) : q.OrderByDescending(t => t.CreatedAt);
                    break;
                default:
                    q = q.OrderByDescending(t => t.CreatedAt);
                    break;
            }

            var list = await q
                .Select(t => new
                {
                    t.Id,
                    t.Title,
                    Status = t.Status.ToString(),
                    t.Deadline,
                    AssignedUser = t.AssignedUser != null
                        ? new
                        {
                            t.AssignedUser.Id,
                            t.AssignedUser.Name
                        }
                        : null,
                    Category = new
                    {
                        t.Category.Id,
                        t.Category.Name
                    },
                    t.CreatedAt,
                    t.UpdatedAt
                })
                .ToListAsync();

            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTask(int id)
        {
            var todo = await _db.Tasks
                .Include(t => t.AssignedUser)
                .Include(t => t.Category)
                .Include(t => t.TaskHistories)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (todo == null)
                return NotFound(new { message = $"Task with id {id} not found." });

            // non-admins may only view their own tasks
            var isAdmin = User.IsInRole("Admin");
            if (!isAdmin)
            {
                var sub = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!int.TryParse(sub, out var userId) || todo.AssignedUserId != userId)
                    return Forbid();
            }

            // shape the response DTO
            var result = new
            {
                todo.Id,
                todo.Title,
                todo.Description,
                Status = todo.Status.ToString(),
                todo.Deadline,
                AssignedUser = new
                {
                    todo.AssignedUser.Id,
                    todo.AssignedUser.Name,
                    todo.AssignedUser.Email
                },
                Category = new
                {
                    todo.Category.Id,
                    todo.Category.Name
                },
                todo.CreatedAt,
                todo.UpdatedAt,
                History = todo.TaskHistories
                    .OrderBy(h => h.ChangedAt)
                    .Select(h => new
                    {
                        h.Id,
                        OldStatus = h.OldStatus.ToString(),
                        NewStatus = h.NewStatus.ToString(),
                        h.ChangedAt
                    })
            };

            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto dto)
        {
            if (!await _db.Users.AnyAsync(u => u.Id == dto.AssignedUserId))
                return NotFound(new { message = $"User with Id {dto.AssignedUserId} does not exist." });
            if (!await _db.Categories.AnyAsync(c => c.Id == dto.CategoryId))
                return NotFound(new { message = $"Category with Id {dto.CategoryId} does not exist." });

            var todo = new TodoTask
            {
                Title = dto.Title,
                Description = dto.Description,
                Status = dto.Status,
                Deadline = dto.Deadline,
                AssignedUserId = dto.AssignedUserId,
                CategoryId = dto.CategoryId
            };

            _db.Tasks.Add(todo);
            await _db.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetTask),            
                new { id = todo.Id },
                new { todo.Id, todo.Title }
            );
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTaskStatus(int id, [FromBody] UpdateTaskDto dto)
        {
            var todo = await _db.Tasks.FindAsync(id);
            if (todo == null)
                return NotFound(new { message = $"Task with id {id} not found." });

            var isAdmin = User.IsInRole("Admin");
            if (!isAdmin)
            {
                var sub = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!int.TryParse(sub, out var userId) || todo.AssignedUserId != userId)
                    return Forbid();
            }

            var oldStatus = todo.Status;
            if (dto.Status != oldStatus)
            {
                todo.Status = dto.Status;
                todo.UpdatedAt = DateTimeOffset.UtcNow;

                _db.TaskHistories.Add(new TaskHistory
                {
                    TodoTaskId = id,
                    OldStatus = oldStatus,
                    NewStatus = dto.Status,
                    ChangedAt = DateTimeOffset.UtcNow
                });
            }

            await _db.SaveChangesAsync();

            return Ok(new
            {
                todo.Id,
                Status = todo.Status.ToString(),
                UpdatedAt = todo.UpdatedAt
            });
        }
    }
}
