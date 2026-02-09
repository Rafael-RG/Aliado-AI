using System.ComponentModel.DataAnnotations;

namespace AliadoAI.Backend.Models;

public class Business : BaseEntity
{
    [Required]
    public string OwnerId { get; set; } = string.Empty;
    
    [Required]
    public string Name { get; set; } = string.Empty;
    
    public string Type { get; set; } = "general"; // retail, services, e-commerce
    
    public string Industry { get; set; } = string.Empty;
    
    public string Description { get; set; } = string.Empty;
    
    public string Website { get; set; } = string.Empty;
    
    public string Phone { get; set; } = string.Empty;
    
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    public BusinessAddress Address { get; set; } = new();
    
    public BusinessSettings Settings { get; set; } = new();
    
    public string Status { get; set; } = "active"; // active, paused, suspended
    
    // Relations
    public List<string> Bots { get; set; } = new();
    public List<string> WhatsappConnections { get; set; } = new();
    public List<string> Subscriptions { get; set; } = new();
    
    public Business()
    {
        Id = GenerateId("business");
    }
}

public class BusinessAddress
{
    public string Street { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
}

public class BusinessSettings
{
    public string Timezone { get; set; } = "America/Argentina/Buenos_Aires";
    public string Currency { get; set; } = "ARS";
    public string Language { get; set; } = "es";
}