using System;
using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class Category
    {
        public int Id { get; set; }

        [Required, StringLength(100)]
        public string Name { get; set; } = string.Empty;

        // 1 Category to n Tasks
        public ICollection<TodoTask> Tasks { get; set; } = new List<TodoTask>();
    }

}
