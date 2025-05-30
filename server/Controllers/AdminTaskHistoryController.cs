using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;

namespace server.Controllers
{
    [ApiController]
    [Route("admin/task-history")]
    [Authorize(Roles = "Admin")]
    public class AdminTaskHistoryController : ControllerBase
    {
        private readonly AppDbContext _db;
        public AdminTaskHistoryController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetTaskHistory()
        {
            var history = await _db.TaskHistories
                .Include(h => h.TodoTask)
                .Include(h => h.ChangedByUser)
                .OrderByDescending(h => h.ChangedAt)
                .Select(h => new
                {
                    h.Id,
                    h.TodoTaskId,
                    TaskTitle = h.TodoTask.Title,
                    OldStatus = h.OldStatus.ToString(),
                    NewStatus = h.NewStatus.ToString(),
                    h.ChangedAt,
                    ChangedBy = h.ChangedByUser != null
                    ? new
                    {
                        h.ChangedByUser.Id,
                        h.ChangedByUser.Name,
                        h.ChangedByUser.Email
                    }
                    : null
                })
                .ToListAsync();

            return Ok(history);
        }
    }
}
