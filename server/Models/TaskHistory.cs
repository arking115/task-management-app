using System;
using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class TaskHistory
    {
        public int Id { get; set; }

        [Required]
        public int TodoTaskId { get; set; }
        public TodoTask TodoTask { get; set; } = null!;

        [Required]
        public TaskStatus OldStatus { get; set; }

        [Required]
        public TaskStatus NewStatus { get; set; }

        [Required]
        public DateTimeOffset ChangedAt { get; set; } = DateTimeOffset.UtcNow;
    }
}