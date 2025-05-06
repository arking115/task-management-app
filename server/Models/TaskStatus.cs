using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public enum TaskStatus
    {
        New = 0,
        InProgress = 1,
        OnHold = 2,
        Completed = 3,
        Cancelled = 4
    }
}
