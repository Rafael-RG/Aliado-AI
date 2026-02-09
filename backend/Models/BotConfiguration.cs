using System.ComponentModel.DataAnnotations;

namespace AliadoAI.Backend.Models;

public class BotConfiguration : BaseEntity
{
    [Required]
    public string BusinessId { get; set; } = string.Empty;
    
    [Required]
    public string Name { get; set; } = string.Empty;
    
    public string Role { get; set; } = "customer_service";
    
    public string Tone { get; set; } = "friendly"; // professional, friendly, empathetic
    
    public string BusinessType { get; set; } = string.Empty;
    
    public string Status { get; set; } = "active"; // active, paused, training
    
    // Training Data
    public string KnowledgeBase { get; set; } = string.Empty;
    
    public List<string> TrainingData { get; set; } = new();
    
    public string CustomInstructions { get; set; } = string.Empty;
    
    public List<string> Assets { get; set; } = new();
    
    // Configuration
    public WebConfiguration WebConfig { get; set; } = new();
    
    // Performance
    public BotStats Stats { get; set; } = new();
    
    public BotConfiguration()
    {
        Id = GenerateId("bot");
    }
}

public class WebConfiguration
{
    public string PrimaryColor { get; set; } = "#10b981";
    public string Position { get; set; } = "right";
    public string WelcomeMessage { get; set; } = "¡Hola! ¿Cómo puedo ayudarte?";
    public string LauncherIcon { get; set; } = "bubble";
}

public class BotStats
{
    public int TotalConversations { get; set; } = 0;
    public int MessagesSent { get; set; } = 0;
    public int LeadsCaptured { get; set; } = 0;
    public double SatisfactionRate { get; set; } = 0;
    public double AvgResponseTime { get; set; } = 0;
}