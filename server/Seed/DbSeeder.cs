using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Seed
{
    public static class DbSeeder
    {
        public static void Seed(IApplicationBuilder app)
        {
            using var scope = app.ApplicationServices.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            context.Database.Migrate();

            if (!context.Users.Any())
            {
                context.Users.AddRange(
                    new User
                    {
                        Name = "Admin User",
                        Email = "admin@example.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                        Role = Role.Admin
                    },
                    new User
                    {
                        Name = "Test User",
                        Email = "user@example.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("user123"),
                        Role = Role.User
                    }
                );

                context.SaveChanges();
            }
        }
    }
}
