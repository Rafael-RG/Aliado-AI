using Microsoft.AspNetCore.Mvc;
using AliadoAI.Backend.Services;
using AliadoAI.Backend.Models;
using AliadoAI.Backend.DTOs;

namespace AliadoAI.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StorageController : ControllerBase
{
    private readonly IDataStorageService _dataStorage;
    private readonly ILogger<StorageController> _logger;

    public StorageController(IDataStorageService dataStorage, ILogger<StorageController> logger)
    {
        _dataStorage = dataStorage;
        _logger = logger;
    }

    /// <summary>
    /// Verifica el tipo de storage en uso y estadísticas de datos
    /// </summary>
    [HttpGet("status")]
    public async Task<ActionResult<ApiResponse<object>>> GetStorageStatus()
    {
        try
        {
            var storageType = _dataStorage.GetType().Name;
            
            var users = await _dataStorage.GetAllAsync<User>();
            var businesses = await _dataStorage.GetAllAsync<Business>();
            var bots = await _dataStorage.GetAllAsync<BotConfiguration>();
            var trainingData = await _dataStorage.GetAllAsync<TrainingData>();
            var metrics = await _dataStorage.GetAllAsync<Metrics>();

            var storageInfo = new
            {
                StorageType = storageType,
                IsAzureStorage = storageType.Contains("Azure"),
                IsInMemoryStorage = storageType.Contains("InMemory"),
                ConnectionString = storageType.Contains("Azure") ? "Azure Table Storage (Azurite Emulator)" : "In-Memory Dictionary",
                Statistics = new
                {
                    TotalUsers = users.Count(),
                    TotalBusinesses = businesses.Count(),
                    TotalBots = bots.Count(),
                    TotalTrainingData = trainingData.Count(),
                    TotalMetrics = metrics.Count(),
                    LastUpdated = DateTime.UtcNow
                },
                DemoUser = users.FirstOrDefault()?.Email ?? "No demo user found",
                Message = storageType.Contains("Azure") 
                    ? "✅ Datos almacenados en Azure Table Storage" 
                    : "⚠️ Datos almacenados en memoria (temporal)"
            };

            _logger.LogInformation("📊 Storage status checked: {StorageType}", storageType);
            
            return Ok(ApiResponse<object>.SuccessResult(storageInfo, "Storage status retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Error checking storage status");
            return StatusCode(500, ApiResponse<object>.ErrorResult($"Failed to check storage status: {ex.Message}"));
        }
    }

    /// <summary>
    /// Obtiene información detallada sobre los datos demo
    /// </summary>
    [HttpGet("demo-data")]
    public async Task<ActionResult<ApiResponse<object>>> GetDemoDataStatus()
    {
        try
        {
            var demoUser = (await _dataStorage.GetAllAsync<User>()).FirstOrDefault(u => u.Email == "demo@aliado-ai.com");
            
            if (demoUser == null)
            {
                return NotFound(ApiResponse<object>.ErrorResult("Demo user not found - No se encontró el usuario demo"));
            }

            var demoBusiness = (await _dataStorage.GetAllAsync<Business>()).FirstOrDefault(b => b.OwnerId == demoUser.Id);
            var demoBot = demoBusiness != null ? (await _dataStorage.GetAllAsync<BotConfiguration>()).FirstOrDefault(bot => bot.BusinessId == demoBusiness.Id) : null;
            var demoTraining = demoBusiness != null ? (await _dataStorage.GetAllAsync<TrainingData>()).Where(t => t.BusinessId == demoBusiness.Id) : new List<TrainingData>();
            var demoMetrics = demoBusiness != null ? (await _dataStorage.GetAllAsync<Metrics>()).FirstOrDefault(m => m.BusinessId == demoBusiness.Id) : null;

            var demoDataInfo = new
            {
                User = new
                {
                    demoUser.Id,
                    demoUser.Email,
                    demoUser.Name,
                    demoUser.Plan,
                    demoUser.IsSubscribed,
                    CreatedAt = demoUser.CreatedAt
                },
                Business = demoBusiness != null ? new
                {
                    demoBusiness.Id,
                    demoBusiness.Name,
                    demoBusiness.Type,
                    demoBusiness.Industry,
                    demoBusiness.Description,
                    CreatedAt = demoBusiness.CreatedAt
                } : null,
                Bot = demoBot != null ? new
                {
                    demoBot.Id,
                    demoBot.Name,
                    demoBot.Role,
                    demoBot.BusinessType,
                    CreatedAt = demoBot.CreatedAt
                } : null,
                Training = new
                {
                    TotalQuestions = demoTraining.Count(),
                    Categories = demoTraining.Select(t => t.Category).Distinct(),
                    SampleQuestions = demoTraining.Take(3).Select(t => t.Question)
                },
                Metrics = demoMetrics != null ? new
                {
                    Date = demoMetrics.Date,
                    TotalConversations = demoMetrics.Conversations?.Total ?? 0,
                    MessagesSent = demoMetrics.Messages?.Sent ?? 0,
                    SatisfactionScore = demoMetrics.Performance?.SatisfactionScore ?? 0
                } : null,
                StorageLocation = _dataStorage.GetType().Name.Contains("Azure") ? "Azure Table Storage" : "In-Memory",
                DataSource = "Demo data created automatically on startup"
            };

            return Ok(ApiResponse<object>.SuccessResult(demoDataInfo, "Demo data retrieved from storage"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Error retrieving demo data");
            return StatusCode(500, ApiResponse<object>.ErrorResult($"Failed to retrieve demo data: {ex.Message}"));
        }
    }
}