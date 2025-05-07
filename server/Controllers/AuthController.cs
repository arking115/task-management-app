using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using server.Data;
using server.Models;
using Microsoft.AspNetCore.Authorization;


namespace server.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IPasswordHasher<User> _hasher;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext db, IPasswordHasher<User> hasher, IConfiguration config)
        {
            _db = db;
            _hasher = hasher;
            _config = config;
        }

        public record RegisterDto(string Name, string Email, string Password);
        public record LoginDto(string Email, string Password);

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
                return Conflict(new { message = "Email already taken" });

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                Role = Role.User
            };
            user.PasswordHash = _hasher.HashPassword(user, dto.Password);

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return CreatedAtAction(null, new { id = user.Id }, new { user.Id, user.Name, user.Email });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _db.Users.SingleOrDefaultAsync(u => u.Email == dto.Email);
            if (user is null)
                return Unauthorized(new { message = "Invalid credentials" });

            var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
            if (result == PasswordVerificationResult.Failed)
                return Unauthorized(new { message = "Invalid credentials" });

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub,    user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email,  user.Email),
                new Claim(ClaimTypes.Role,                user.Role.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new { token = jwt, user.Id, user.Name, user.Email });
        }
        [Authorize]
[HttpGet("me")]
public IActionResult Me()
{
    return Ok(new
    {
        Id = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value,
        Email = User.FindFirst(JwtRegisteredClaimNames.Email)?.Value,
        Role = User.FindFirst(ClaimTypes.Role)?.Value
    });
    }
}
}




// For testing token creation with postman

//    [Authorize]
//    [HttpGet("me")]
//    public IActionResult Me()
//=> Ok(new {
//    Id = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value,
//    Email = User.FindFirst(JwtRegisteredClaimNames.Email)?.Value,
//    Role = User.FindFirst(ClaimTypes.Role)?.Value
//});
