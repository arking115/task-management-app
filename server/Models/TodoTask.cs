using System;
using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class TodoTask
    {
        public int Id { get; set; }

        [Required, StringLength(50)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public TaskStatus Status { get; set; } = TaskStatus.New;

        // Optional
        public DateTimeOffset? Deadline { get; set; }

        public int? AssignedUserId { get; set; }
        public User? AssignedUser { get; set; } = null!;

        public int? CategoryId { get; set; }
        public Category? Category { get; set; }


        [Required]
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

        [Required]
        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
        
        // 1 Task to n History entries
        public ICollection<TaskHistory> TaskHistories { get; set; } = new List<TaskHistory>();
    }

}
