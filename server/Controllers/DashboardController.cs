using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;       
using server.Data;
using server.Models;


using StatusEnum = server.Models.TaskStatus;

namespace server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _db;

        public DashboardController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            //Console.WriteLine("Entering DashboardController.Get");

            //Console.WriteLine("User Claims:");
            //foreach (var claim in User.Claims)
            //{
            //    Console.WriteLine($"Claim Type: {claim.Type}, Value: {claim.Value}");
            //}

            var isAdmin = User.IsInRole("Admin");
            //Console.WriteLine($"IsAdmin: {isAdmin}");

            IQueryable<TodoTask> q = _db.Tasks;

            if (!isAdmin)
            {
                var sub = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                //Console.WriteLine($"Sub: {sub ?? "null"}");
                if (string.IsNullOrEmpty(sub) || !int.TryParse(sub, out var userId))
                {
                    //Console.WriteLine($"Failed to parse user ID. Sub value: '{sub}'");
                    return Unauthorized(new { message = "Invalid user ID in token" });
                }
                q = q.Where(t => t.AssignedUserId == userId);
            }

            var totalTasks = await q.CountAsync();

            var raw = await q
                .GroupBy(t => t.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToListAsync();

            var statusCounts = Enum
                .GetValues(typeof(StatusEnum))
                .Cast<StatusEnum>()
                .ToDictionary(s => s.ToString(), s => 0);

            foreach (var x in raw)
                statusCounts[x.Status.ToString()] = x.Count;

            return Ok(new
            {
                statusCounts,
                totalTasks
            });
        }
    }
}
