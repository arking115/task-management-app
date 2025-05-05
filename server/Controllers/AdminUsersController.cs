using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;

namespace server.Controllers
{
    [ApiController]
    [Route("admin/users")]
    [Authorize(Roles = "Admin")]
    public class AdminUsersController : ControllerBase
    {
        private readonly AppDbContext _db;
        public AdminUsersController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _db.Users
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Email,
                    Role = u.Role.ToString(),
                    TaskCount = u.Tasks.Count
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = $"User with Id {id} not found." });

            _db.Users.Remove(user);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
