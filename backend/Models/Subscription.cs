using System.ComponentModel.DataAnnotations;

namespace AliadoAI.Backend.Models;

public class Subscription : BaseEntity
{
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [Required]
    public string BusinessId { get; set; } = string.Empty;
    
    public string Plan { get; set; } = "free"; // free, pro, enterprise
    
    public string Status { get; set; } = "active"; // active, expired, cancelled
    
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    
    public DateTime? EndDate { get; set; }
    
    public bool AutoRenew { get; set; } = false;
    
    // Billing
    public decimal Amount { get; set; } = 0;
    
    public string Currency { get; set; } = "USD";
    
    public string BillingCycle { get; set; } = "monthly"; // monthly, yearly
    
    public string? PaymentMethod { get; set; }
    
    public DateTime? LastPayment { get; set; }
    
    public DateTime? NextBillingDate { get; set; }
    
    // Usage Limits
    public SubscriptionLimits Limits { get; set; } = new();
    
    public Subscription()
    {
        Id = GenerateId("sub");
    }
}

public class SubscriptionLimits
{
    public int MaxBots { get; set; } = 1;
    public int MaxMessages { get; set; } = 100;
    public int MaxConnections { get; set; } = 1;
}