using Microsoft.AspNetCore.Mvc;
using AliadoAI.Backend.DTOs;
using AliadoAI.Backend.Services;
using AliadoAI.Backend.Models;

namespace AliadoAI.Backend.Controllers;

[ApiController]
[Route("/")]
public class HealthController : ControllerBase
{
    private readonly IDataStorageService _dataStorage;
    private readonly IGeminiService _geminiService;
    private readonly ILogger<HealthController> _logger;
    
    public HealthController(
        IDataStorageService dataStorage, 
        IGeminiService geminiService,
        ILogger<HealthController> logger)
    {
        _dataStorage = dataStorage;
        _geminiService = geminiService;
        _logger = logger;
    }
    
    [HttpGet]
    public ActionResult<object> Home()
    {
        return Ok(new
        {
            service = "Aliado AI WhatsApp Backend (.NET 9)",
            version = "2.0.0",
            status = "Running",
            legal = new
            {
                terms = "/legal",
                privacy = "/privacy",
                description = "Legal pages available for Meta WhatsApp Business API verification"
            },
            endpoints = new
            {
                health = "GET /health",
                api_docs = "GET /swagger",
                whatsapp_webhook = "GET/POST /api/whatsapp/webhook/{botId}",
                users = "GET/POST /api/users",
                businesses = "GET/POST /api/businesses",
                bots = "GET/POST /api/bots",
                legal_terms = "GET /legal",
                legal_privacy = "GET /privacy"
            },
            documentation = "https://developers.facebook.com/docs/whatsapp"
        });
    }
    
    [HttpGet("health")]
    public async Task<ActionResult<ApiResponse<HealthCheckResponse>>> HealthCheck()
    {
        try
        {
            var bots = await _dataStorage.GetAllAsync<BotConfiguration>();
            var users = await _dataStorage.GetAllAsync<User>();
            var businesses = await _dataStorage.GetAllAsync<Business>();
            
            var response = new HealthCheckResponse
            {
                Status = "OK",
                Services = new ServiceStatus
                {
                    Database = "In-Memory Storage",
                    Whatsapp = "Ready",
                    Gemini = await _geminiService.ValidateApiKeyAsync() ? "Ready" : "Not Configured"
                },
                Data = new DataStatus
                {
                    Bots = bots.Count(),
                    Users = users.Count(),
                    Businesses = businesses.Count()
                }
            };
            
            return Ok(ApiResponse<HealthCheckResponse>.SuccessResult(response));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Health check failed");
            return StatusCode(500, ApiResponse<HealthCheckResponse>.ErrorResult("Health check failed"));
        }
    }
    
    [HttpGet("api/demo-data")]
    public async Task<ActionResult<object>> DemoData()
    {
        try
        {
            var users = await _dataStorage.GetAllAsync<User>();
            var businesses = await _dataStorage.GetAllAsync<Business>();
            var bots = await _dataStorage.GetAllAsync<BotConfiguration>();
            var metrics = await _dataStorage.GetAllAsync<Metrics>();
            
            return Ok(new
            {
                success = true,
                demo = new
                {
                    users = users.Count(),
                    businesses = businesses.Count(),
                    bots = bots.Count(),
                    metrics = metrics.Count()
                },
                data = new { users, businesses, bots, metrics }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting demo data");
            return StatusCode(500, new { success = false, error = ex.Message });
        }
    }
}