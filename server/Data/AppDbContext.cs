using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<TodoTask> Tasks { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<TaskHistory> TaskHistories { get; set; }

        // In case of customizations on tables or relationships
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            var userEntity = modelBuilder.Entity<User>();
            var taskEntity = modelBuilder.Entity<TodoTask>();
            var catEntity = modelBuilder.Entity<Category>();
            var histEntity = modelBuilder.Entity<TaskHistory>();


            // Users
            userEntity
                .HasIndex(u => u.Email)
                .IsUnique();
            userEntity
                .Property(u => u.Role)
                .HasConversion<string>();

            // Tasks
            taskEntity
                .Property(t => t.Status)
                .HasConversion<string>();
            taskEntity
                .Property(t => t.CreatedAt)
                .HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");
            taskEntity
                .Property(t => t.UpdatedAt)   
                .HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");
            taskEntity
                .HasOne(t => t.AssignedUser)
                .WithMany(u => u.Tasks)
                .HasForeignKey(t => t.AssignedUserId)
                .OnDelete(DeleteBehavior.SetNull);
            taskEntity
                .HasOne(t => t.Category)
                .WithMany(c => c.Tasks)
                .HasForeignKey(t => t.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // Categories
            catEntity
                .HasIndex(c => c.Name)
                .IsUnique();

            // TaskHistory
            histEntity
                .HasOne(h => h.TodoTask)
                .WithMany(t => t.TaskHistories)
                .HasForeignKey(h => h.TodoTaskId)
                .OnDelete(DeleteBehavior.Cascade);

            histEntity
                .Property(h => h.OldStatus)
                .HasConversion<string>();
            histEntity
                .Property(h => h.NewStatus)
                .HasConversion<string>();
        }
    }
}



