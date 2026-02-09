using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace AliadoAI.Backend.Services;

public class GeminiService : IGeminiService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<GeminiService> _logger;
    private readonly string? _apiKey;
    
    public GeminiService(HttpClient httpClient, IConfiguration configuration, ILogger<GeminiService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
        _apiKey = _configuration["Gemini:ApiKey"];
    }
    
    public async Task<string> GenerateResponseAsync(string userMessage, string knowledgeBase, string context = "")
    {
        if (string.IsNullOrEmpty(_apiKey))
        {
            _logger.LogError("Gemini API key not configured");
            return "Lo siento, el servicio de IA no está disponible en este momento.";
        }
        
        try
        {
            var systemPrompt = $@"
Eres un asistente virtual inteligente y amigable para un negocio.

INFORMACIÓN DEL NEGOCIO:
{knowledgeBase}

CONTEXTO PREVIO:
{context}

INSTRUCCIONES:
- Responde de manera cordial y profesional
- Usa la información del negocio para dar respuestas precisas
- Si no sabes algo, admite que no tienes esa información
- Mantén las respuestas concisas pero útiles
- Siempre trata de ser útil al cliente

Mensaje del usuario: {userMessage}
";
            
            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = systemPrompt }
                        }
                    }
                },
                generationConfig = new
                {
                    temperature = 0.7,
                    topK = 40,
                    topP = 0.95,
                    maxOutputTokens = 1024
                }
            };
            
            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            
            var response = await _httpClient.PostAsync(
                $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={_apiKey}",
                content);
            
            if (response.IsSuccessStatusCode)
            {
                var responseJson = await response.Content.ReadAsStringAsync();
                var jsonDoc = JsonDocument.Parse(responseJson);
                
                if (jsonDoc.RootElement.TryGetProperty("candidates", out var candidates) &&
                    candidates.GetArrayLength() > 0)
                {
                    var firstCandidate = candidates[0];
                    if (firstCandidate.TryGetProperty("content", out var content1) &&
                        content1.TryGetProperty("parts", out var parts) &&
                        parts.GetArrayLength() > 0)
                    {
                        var text = parts[0].GetProperty("text").GetString();
                        return text ?? "Lo siento, no pude generar una respuesta.";
                    }
                }
            }
            
            _logger.LogWarning("Failed to get response from Gemini API: {StatusCode}", response.StatusCode);
            return "Lo siento, no pude procesar tu consulta en este momento. Por favor intenta más tarde.";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling Gemini API");
            return "Lo siento, hubo un error al procesar tu consulta.";
        }
    }
    
    public async Task<bool> ValidateApiKeyAsync()
    {
        if (string.IsNullOrEmpty(_apiKey))
            return false;
        
        try
        {
            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = "Test" }
                        }
                    }
                }
            };
            
            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            
            var response = await _httpClient.PostAsync(
                $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={_apiKey}",
                content);
            
            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }
}