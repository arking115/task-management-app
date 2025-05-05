using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;


[ApiController]
[Route("categories")]
[Authorize(Roles = "Admin")]
public class CategoryController : ControllerBase
{
    private readonly AppDbContext _db;
    public CategoryController(AppDbContext db) => _db = db;
    public record CreateCategoryDto(
    [Required, StringLength(100)] string Name
    );

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var cats = await _db.Categories
            .Select(c => new { c.Id, c.Name })
            .ToListAsync();
        return Ok(cats);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
    {
        if (await _db.Categories.AnyAsync(c => c.Name == dto.Name))
            return Conflict(new { message = "Category already exists." });

        var cat = new Category { Name = dto.Name };
        _db.Categories.Add(cat);
        await _db.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetAll),
            new { id = cat.Id },
            new { cat.Id, cat.Name }
        );
    }
}
