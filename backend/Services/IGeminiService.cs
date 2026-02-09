namespace AliadoAI.Backend.Services;

public interface IGeminiService
{
    Task<string> GenerateResponseAsync(string userMessage, string knowledgeBase, string context = "");
    Task<bool> ValidateApiKeyAsync();
}