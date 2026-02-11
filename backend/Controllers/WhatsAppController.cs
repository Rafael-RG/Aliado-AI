using Microsoft.AspNetCore.Mvc;
using AliadoAI.Backend.Services;
using AliadoAI.Backend.Models;
using System.Text.Json;

namespace AliadoAI.Backend.Controllers;

[ApiController]
[Route("api/whatsapp")]
public class WhatsAppController : ControllerBase
{
    private readonly IWhatsAppService _whatsAppService;
    private readonly IDataStorageService _dataStorage;
    private readonly ILogger<WhatsAppController> _logger;
    private readonly IConfiguration _configuration;
    
    public WhatsAppController(
        IWhatsAppService whatsAppService,
        IDataStorageService dataStorage,
        ILogger<WhatsAppController> logger,
        IConfiguration configuration)
    {
        _whatsAppService = whatsAppService;
        _dataStorage = dataStorage;
        _logger = logger;
        _configuration = configuration;
    }
    
    // Legacy webhook endpoint
    [HttpGet("webhook")]
    public async Task<ActionResult> VerifyWebhook(
        [FromQuery(Name = "hub.mode")] string mode,
        [FromQuery(Name = "hub.challenge")] string challenge,
        [FromQuery(Name = "hub.verify_token")] string verifyToken)
    {
        await Task.CompletedTask;
        
        var expectedToken = _configuration["WhatsApp:VerifyToken"];
        
        if (mode == "subscribe" && verifyToken == expectedToken)
        {
            _logger.LogInformation("✅ Webhook verification successful");
            return Content(challenge, "text/plain");
        }
        
        _logger.LogWarning("❌ Webhook verification failed");
        return Unauthorized();
    }
    
    // Bot-specific webhook endpoint
    [HttpGet("webhook/{botId}")]
    public async Task<ActionResult> VerifyBotWebhook(
        string botId,
        [FromQuery(Name = "hub.mode")] string mode,
        [FromQuery(Name = "hub.challenge")] string challenge,
        [FromQuery(Name = "hub.verify_token")] string verifyToken)
    {
        var bot = await _dataStorage.FindByIdAsync<BotConfiguration>(botId);
        if (bot == null)
        {
            return NotFound($"Bot {botId} not found");
        }
        
        var expectedToken = _configuration["WhatsApp:VerifyToken"];
        
        if (mode == "subscribe" && verifyToken == expectedToken)
        {
            _logger.LogInformation("✅ Bot webhook verification successful for {BotId}", botId);
            return Content(challenge, "text/plain");
        }
        
        _logger.LogWarning("❌ Bot webhook verification failed for {BotId}", botId);
        return Unauthorized();
    }
    
    // Legacy webhook handler
    [HttpPost("webhook")]
    public async Task<ActionResult> HandleWebhook([FromBody] JsonElement webhookData)
    {
        try
        {
            _logger.LogInformation("📱 Received WhatsApp webhook: {Data}", webhookData.ToString());
            
            // For legacy endpoint, use first available bot
            var bots = await _dataStorage.GetAllAsync<BotConfiguration>();
            var firstBot = bots.FirstOrDefault();
            
            if (firstBot != null)
            {
                var result = await _whatsAppService.ProcessIncomingMessageAsync(webhookData, firstBot.Id);
                
                if (!string.IsNullOrEmpty(result.Response) && !string.IsNullOrEmpty(result.SenderPhone))
                {
                    // Send the AI response back to WhatsApp
                    var phoneNumberId = _configuration["WhatsApp:PhoneNumberId"];
                    var accessToken = _configuration["WhatsApp:AccessToken"];
                    
                    if (!string.IsNullOrEmpty(phoneNumberId) && !string.IsNullOrEmpty(accessToken))
                    {
                        var sent = await _whatsAppService.SendMessageAsync(phoneNumberId, accessToken, result.SenderPhone, result.Response);
                        _logger.LogInformation("🤖 AI response sent to {Phone}: {Response} - Success: {Success}", 
                            result.SenderPhone, result.Response, sent);
                    }
                    else
                    {
                        _logger.LogWarning("⚠️ WhatsApp credentials not configured - cannot send response");
                    }
                }
            }
            
            return Ok(new { status = "received" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Error handling webhook");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }
    
    // Bot-specific webhook handler
    [HttpPost("webhook/{botId}")]
    public async Task<ActionResult> HandleBotWebhook(string botId, [FromBody] JsonElement webhookData)
    {
        try
        {
            _logger.LogInformation("📱 Received WhatsApp webhook for bot {BotId}: {Data}", botId, webhookData.ToString());
            
            var bot = await _dataStorage.FindByIdAsync<BotConfiguration>(botId);
            if (bot == null)
            {
                return NotFound($"Bot {botId} not found");
            }

            // Process the message and get AI response
            var result = await _whatsAppService.ProcessIncomingMessageAsync(webhookData, botId);
            
            if (!string.IsNullOrEmpty(result.Response) && !string.IsNullOrEmpty(result.SenderPhone))
            {
                // Send the AI response back to WhatsApp
                var phoneNumberId = _configuration["WhatsApp:PhoneNumberId"];
                var accessToken = _configuration["WhatsApp:AccessToken"];
                
                if (!string.IsNullOrEmpty(phoneNumberId) && !string.IsNullOrEmpty(accessToken))
                {
                    var sent = await _whatsAppService.SendMessageAsync(phoneNumberId, accessToken, result.SenderPhone, result.Response);
                    _logger.LogInformation("🤖 AI response sent to {Phone}: {Response} - Success: {Success}", 
                        result.SenderPhone, result.Response, sent);
                }
                else
                {
                    _logger.LogWarning("⚠️ WhatsApp credentials not configured - cannot send response");
                }
            }
            
            return Ok(new { status = "received" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Error handling bot webhook {BotId}", botId);
            return StatusCode(500, new { error = "Internal server error" });
        }
    }
    
    [HttpPost("test/send")]
    public async Task<ActionResult> SendTestMessage([FromBody] dynamic testData)
    {
        try
        {
            var phoneNumberId = _configuration["WhatsApp:PhoneNumberId"];
            var accessToken = _configuration["WhatsApp:AccessToken"];
            
            if (string.IsNullOrEmpty(phoneNumberId) || string.IsNullOrEmpty(accessToken))
            {
                return BadRequest(new { error = "WhatsApp credentials not configured" });
            }
            
            // Extract data from dynamic object
            var dataJson = JsonSerializer.Serialize(testData);
            var testRequest = JsonSerializer.Deserialize<JsonElement>(dataJson);
            
            var to = testRequest.GetProperty("to").GetString() ?? "";
            var message = testRequest.GetProperty("message").GetString() ?? "Test message";
            
            var success = await _whatsAppService.SendMessageAsync(phoneNumberId, accessToken, to, message);
            
            if (success)
            {
                return Ok(new { success = true, message = "Message sent successfully" });
            }
            
            return StatusCode(500, new { success = false, error = "Failed to send message" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending test message");
            return StatusCode(500, new { success = false, error = ex.Message });
        }
    }
}