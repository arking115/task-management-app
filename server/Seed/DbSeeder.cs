using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
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
            var hasher = new PasswordHasher<User>();

            context.Database.Migrate();

            // Remove broken admin if exists
            var existingAdmin = context.Users.FirstOrDefault(u => u.Email == "admin@example.com");
            if (existingAdmin != null)
            {
                context.Users.Remove(existingAdmin);
                context.SaveChanges();
            }

            var admin = new User
            {
                Name = "Admin User",
                Email = "admin@example.com",
                Role = Role.Admin
            };
            admin.PasswordHash = hasher.HashPassword(admin, "admin123");

            context.Users.Add(admin);
            context.SaveChanges();
        }
    }
}
