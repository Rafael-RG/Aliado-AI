using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace AliadoAI.Backend.Models;

public class WhatsAppConnection : BaseEntity
{
    [Required]
    public string BusinessId { get; set; } = string.Empty;
    
    [Required]
    public string BotId { get; set; } = string.Empty;
    
    [Required]
    public string PhoneNumberId { get; set; } = string.Empty;
    
    public string PhoneNumber { get; set; } = string.Empty;
    
    public string DisplayName { get; set; } = string.Empty;
    
    [JsonIgnore] // Never return access token in API responses
    public string AccessToken { get; set; } = string.Empty;
    
    public string VerifyToken { get; set; } = string.Empty;
    
    public string WebhookUrl { get; set; } = string.Empty;
    
    public string Status { get; set; } = "pending"; // pending, active, error, suspended
    
    public DateTime? LastVerified { get; set; }
    
    public string? ErrorMessage { get; set; }
    
    // Business Account Info
    public MetaBusinessAccount MetaBusinessAccount { get; set; } = new();
    
    public WhatsAppConnection()
    {
        Id = GenerateId("wa");
    }
}

public class MetaBusinessAccount
{
    public string AccountId { get; set; } = string.Empty;
    public string AccountName { get; set; } = string.Empty;
    public List<string> Permissions { get; set; } = new();
}