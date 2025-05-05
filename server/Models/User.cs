using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public enum Role
    {
        User = 0,
        Admin = 1
    }
    public class User
    {
        public int Id { get; set; }
        
        [Required, StringLength(50)]
        public string Name { get; set; } = string.Empty;

        [Required, EmailAddress, StringLength(50)]
        public string Email { get; set; } = string.Empty;

        public Role Role { get; set; } = Role.User;

        [Required]
        public string PasswordHash { get; set; } = null!;

        // 1 User to n Tasks
        public ICollection<TodoTask> Tasks { get; set; } = new List<TodoTask>();
    }
}
