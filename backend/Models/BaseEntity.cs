using System.ComponentModel.DataAnnotations;

namespace AliadoAI.Backend.Models;

public abstract class BaseEntity
{
    [Key]
    public string Id { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    protected static string GenerateId(string prefix)
    {
        return $"{prefix}_{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}_{Guid.NewGuid().ToString("N")[..9]}";
    }
}