namespace AliadoAI.Backend.DTOs;

public class HealthCheckResponse
{
    public string Status { get; set; } = "OK";
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public ServiceStatus Services { get; set; } = new();
    public DataStatus Data { get; set; } = new();
}

public class ServiceStatus
{
    public string Database { get; set; } = "Local Storage";
    public string Whatsapp { get; set; } = "Ready";
    public string Gemini { get; set; } = "Ready";
}

public class DataStatus
{
    public int Bots { get; set; }
    public int Users { get; set; }
    public int Businesses { get; set; }
}