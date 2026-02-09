using AliadoAI.Backend.Models;

namespace AliadoAI.Backend.Services;

public interface IWhatsAppService
{
    Task<bool> SendMessageAsync(string phoneNumberId, string accessToken, string to, string message);
    Task<bool> VerifyWebhookAsync(string token, string challenge, string verifyToken);
    Task<string> ProcessIncomingMessageAsync(dynamic webhookData, string botId);
    Task<bool> ValidateAccessTokenAsync(string accessToken);
}