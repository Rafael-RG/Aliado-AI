using Microsoft.AspNetCore.Mvc;
using AliadoAI.Backend.DTOs;
using AliadoAI.Backend.Models;
using AliadoAI.Backend.Services;

namespace AliadoAI.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MetricsController : ControllerBase
{
    private readonly IDataStorageService _dataStorage;
    private readonly ILogger<MetricsController> _logger;
    
    public MetricsController(IDataStorageService dataStorage, ILogger<MetricsController> logger)
    {
        _dataStorage = dataStorage;
        _logger = logger;
    }
    
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<Metrics>>>> GetMetrics(
        [FromQuery] string? businessId = null,
        [FromQuery] string? botId = null,
        [FromQuery] string? period = null)
    {
        try
        {
            var metrics = await _dataStorage.FindAsync<Metrics>(m => 
                (string.IsNullOrEmpty(businessId) || m.BusinessId == businessId) &&
                (string.IsNullOrEmpty(botId) || m.BotId == botId) &&
                (string.IsNullOrEmpty(period) || m.Period == period)
            );
            
            return Ok(ApiResponse<IEnumerable<Metrics>>.SuccessResult(metrics));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting metrics");
            return StatusCode(500, ApiResponse<IEnumerable<Metrics>>.ErrorResult(ex.Message));
        }
    }
    
    [HttpPost]
    public async Task<ActionResult<ApiResponse<Metrics>>> CreateMetrics([FromBody] Metrics metrics)
    {
        try
        {
            var createdMetrics = await _dataStorage.CreateAsync(metrics);
            return Ok(ApiResponse<Metrics>.SuccessResult(createdMetrics, "Metrics created successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating metrics");
            return StatusCode(500, ApiResponse<Metrics>.ErrorResult(ex.Message));
        }
    }
    
    [HttpGet("aggregate/{businessId}")]
    public async Task<ActionResult<object>> GetAggregateMetrics(string businessId, [FromQuery] int days = 30)
    {
        try
        {
            var metrics = await _dataStorage.FindAsync<Metrics>(m => 
                m.BusinessId == businessId && 
                m.Date >= DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-days)));
            
            var aggregate = new
            {
                totalConversations = metrics.Sum(m => m.Conversations.Total),
                totalMessages = metrics.Sum(m => m.Messages.Sent + m.Messages.Received),
                avgSatisfaction = metrics.Average(m => m.Performance.SatisfactionScore),
                totalRevenue = metrics.Sum(m => m.Business.Revenue),
                leadsCaptured = metrics.Sum(m => m.Business.LeadsCaptured),
                periodDays = days
            };
            
            return Ok(new { success = true, data = aggregate });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting aggregate metrics for business {BusinessId}", businessId);
            return StatusCode(500, new { success = false, error = ex.Message });
        }
    }
}