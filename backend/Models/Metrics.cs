using System.ComponentModel.DataAnnotations;

namespace AliadoAI.Backend.Models;

public class Metrics : BaseEntity
{
    [Required]
    public string BusinessId { get; set; } = string.Empty;
    
    [Required]
    public string BotId { get; set; } = string.Empty;
    
    public DateOnly Date { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);
    
    public string Period { get; set; } = "daily"; // daily, weekly, monthly
    
    // Conversation Metrics
    public ConversationMetrics Conversations { get; set; } = new();
    
    // Message Metrics
    public MessageMetrics Messages { get; set; } = new();
    
    // Performance
    public PerformanceMetrics Performance { get; set; } = new();
    
    // Business Impact
    public BusinessMetrics Business { get; set; } = new();
    
    public Metrics()
    {
        Id = GenerateId("metric");
    }
}

public class ConversationMetrics
{
    public int Total { get; set; } = 0;
    public int New { get; set; } = 0;
    public int Returning { get; set; } = 0;
    public int Completed { get; set; } = 0;
}

public class MessageMetrics
{
    public int Sent { get; set; } = 0;
    public int Received { get; set; } = 0;
    public int Failed { get; set; } = 0;
}

public class PerformanceMetrics
{
    public double AvgResponseTime { get; set; } = 0;
    public double ResolutionRate { get; set; } = 0;
    public double SatisfactionScore { get; set; } = 0;
}

public class BusinessMetrics
{
    public int LeadsCaptured { get; set; } = 0;
    public int SalesConverted { get; set; } = 0;
    public decimal Revenue { get; set; } = 0;
    public int TimeSaved { get; set; } = 0;
}