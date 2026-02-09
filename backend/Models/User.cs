using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace AliadoAI.Backend.Models;

public class User : BaseEntity
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string Name { get; set; } = string.Empty;
    
    [JsonIgnore] // Never return password in API responses
    public string Password { get; set; } = string.Empty;
    
    public bool IsSubscribed { get; set; } = false;
    
    public string Plan { get; set; } = "free"; // free, pro, enterprise
    
    public DateTime? SubscriptionExpiry { get; set; }
    
    public List<string> Businesses { get; set; } = new();
    
    public UserPreferences Preferences { get; set; } = new();
    
    public User()
    {
        Id = GenerateId("user");
    }
}

public class UserPreferences
{
    public string Language { get; set; } = "es";
    
    public bool Notifications { get; set; } = true;
    
    public string Theme { get; set; } = "light";
}