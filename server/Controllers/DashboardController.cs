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
            IQueryable<TodoTask> q = _db.Tasks;

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
