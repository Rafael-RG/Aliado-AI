using System.Text;
using System.Text.Json;
using AliadoAI.Backend.Models;

namespace AliadoAI.Backend.Services;

public class WhatsAppService : IWhatsAppService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<WhatsAppService> _logger;
    private readonly IDataStorageService _dataStorage;
    private readonly IGeminiService _geminiService;
    
    public WhatsAppService(
        HttpClient httpClient, 
        ILogger<WhatsAppService> logger,
        IDataStorageService dataStorage,
        IGeminiService geminiService)
    {
        _httpClient = httpClient;
        _logger = logger;
        _dataStorage = dataStorage;
        _geminiService = geminiService;
    }
    
    public async Task<bool> SendMessageAsync(string phoneNumberId, string accessToken, string to, string message)
    {
        try
        {
            var requestBody = new
            {
                messaging_product = "whatsapp",
                recipient_type = "individual",
                to = to,
                type = "text",
                text = new { body = message }
            };
            
            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");
            
            var response = await _httpClient.PostAsync(
                $"https://graph.facebook.com/v21.0/{phoneNumberId}/messages",
                content);
            
            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("✅ Message sent successfully to {To}", to);
                return true;
            }
            
            var errorContent = await response.Content.ReadAsStringAsync();
            _logger.LogError("❌ Failed to send message: {StatusCode}, {Content}", response.StatusCode, errorContent);
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Error sending WhatsApp message");
            return false;
        }
    }
    
    public async Task<bool> VerifyWebhookAsync(string token, string challenge, string verifyToken)
    {
        await Task.CompletedTask; // Make async
        
        if (token == verifyToken)
        {
            _logger.LogInformation("✅ Webhook verified successfully");
            return true;
        }
        
        _logger.LogWarning("❌ Webhook verification failed");
        return false;
    }
    
    public async Task<string> ProcessIncomingMessageAsync(dynamic webhookData, string botId)
    {
        try
        {
            // Find bot configuration
            var bot = await _dataStorage.FindByIdAsync<BotConfiguration>(botId);
            if (bot == null)
            {
                _logger.LogWarning("Bot not found: {BotId}", botId);
                return "Bot configuration not found";
            }
            
            // Extract message from webhook data
            var dataJson = JsonSerializer.Serialize(webhookData);
            var jsonDoc = JsonDocument.Parse(dataJson);
            
            if (jsonDoc.RootElement.TryGetProperty("entry", out JsonElement entry) &&
                entry.GetArrayLength() > 0)
            {
                var firstEntry = entry[0];
                if (firstEntry.TryGetProperty("changes", out JsonElement changes) &&
                    changes.GetArrayLength() > 0)
                {
                    var change = changes[0];
                    if (change.TryGetProperty("value", out JsonElement value) &&
                        value.TryGetProperty("messages", out JsonElement messages) &&
                        messages.GetArrayLength() > 0)
                    {
                        var message = messages[0];
                        if (message.TryGetProperty("text", out JsonElement textObj) &&
                            textObj.TryGetProperty("body", out JsonElement bodyProp))
                        {
                            var messageText = bodyProp.GetString();
                            var senderPhone = message.GetProperty("from").GetString();
                            
                            _logger.LogInformation("📱 Received message from {Phone}: {Message}", senderPhone, messageText);
                            
                            // Generate AI response
                            var aiResponse = await _geminiService.GenerateResponseAsync(
                                messageText ?? "",
                                bot.KnowledgeBase,
                                $"Bot: {bot.Name}, Business: {bot.BusinessId}"
                            );
                            
                            return aiResponse;
                        }
                    }
                }
            }
            
            return "No pude procesar el mensaje";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing incoming message");
            return "Error procesando el mensaje";
        }
    }
    
    public async Task<bool> ValidateAccessTokenAsync(string accessToken)
    {
        try
        {
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");
            
            var response = await _httpClient.GetAsync("https://graph.facebook.com/v21.0/me");
            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }
}