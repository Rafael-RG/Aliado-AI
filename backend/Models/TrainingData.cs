using System.ComponentModel.DataAnnotations;

namespace AliadoAI.Backend.Models;

public class TrainingData : BaseEntity
{
    [Required]
    public string BusinessId { get; set; } = string.Empty;
    
    [Required]
    public string BotId { get; set; } = string.Empty;
    
    public string Type { get; set; } = "faq"; // faq, conversation, document, product
    
    public string Source { get; set; } = "manual"; // manual, import, sync
    
    // Content
    [Required]
    public string Question { get; set; } = string.Empty;
    
    [Required]
    public string Answer { get; set; } = string.Empty;
    
    public string Category { get; set; } = string.Empty;
    
    public List<string> Tags { get; set; } = new();
    
    public int Priority { get; set; } = 1; // 1-5
    
    // Metadata
    public string Language { get; set; } = "es";
    
    public bool IsActive { get; set; } = true;
    
    public double Confidence { get; set; } = 1.0;
    
    public TrainingUsage Usage { get; set; } = new();
    
    public TrainingData()
    {
        Id = GenerateId("training");
    }
}

public class TrainingUsage
{
    public int TimesUsed { get; set; } = 0;
    public DateTime? LastUsed { get; set; }
    public double Effectiveness { get; set; } = 0;
}