using Microsoft.AspNetCore.Mvc;
using AliadoAI.Backend.DTOs;
using AliadoAI.Backend.Models;
using AliadoAI.Backend.Services;

namespace AliadoAI.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BotsController : ControllerBase
{
    private readonly IDataStorageService _dataStorage;
    private readonly ILogger<BotsController> _logger;
    
    public BotsController(IDataStorageService dataStorage, ILogger<BotsController> logger)
    {
        _dataStorage = dataStorage;
        _logger = logger;
    }
    
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<BotConfiguration>>>> GetAllBots([FromQuery] string? businessId = null)
    {
        try
        {
            IEnumerable<BotConfiguration> bots;
            
            if (!string.IsNullOrEmpty(businessId))
            {
                bots = await _dataStorage.FindAsync<BotConfiguration>(b => b.BusinessId == businessId);
            }
            else
            {
                bots = await _dataStorage.GetAllAsync<BotConfiguration>();
            }
            
            return Ok(ApiResponse<IEnumerable<BotConfiguration>>.SuccessResult(bots));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting bots");
            return StatusCode(500, ApiResponse<IEnumerable<BotConfiguration>>.ErrorResult(ex.Message));
        }
    }
    
    [HttpPost]
    public async Task<ActionResult<ApiResponse<BotConfiguration>>> CreateBot([FromBody] BotConfiguration bot)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<BotConfiguration>.ErrorResult("Invalid bot data"));
            }
            
            var createdBot = await _dataStorage.CreateAsync(bot);
            return CreatedAtAction(nameof(GetBot), new { id = createdBot.Id }, 
                ApiResponse<BotConfiguration>.SuccessResult(createdBot, "Bot created successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating bot");
            return StatusCode(500, ApiResponse<BotConfiguration>.ErrorResult(ex.Message));
        }
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<BotConfiguration>>> GetBot(string id)
    {
        try
        {
            var bot = await _dataStorage.FindByIdAsync<BotConfiguration>(id);
            if (bot == null)
            {
                return NotFound(ApiResponse<BotConfiguration>.ErrorResult("Bot not found"));
            }
            
            return Ok(ApiResponse<BotConfiguration>.SuccessResult(bot));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting bot {BotId}", id);
            return StatusCode(500, ApiResponse<BotConfiguration>.ErrorResult(ex.Message));
        }
    }
    
    [HttpPost("{botId}/config")]
    public async Task<ActionResult<ApiResponse<BotConfiguration>>> SaveBotConfig(string botId, [FromBody] BotConfiguration config)
    {
        try
        {
            var updatedBot = await _dataStorage.UpdateAsync(botId, config);
            if (updatedBot == null)
            {
                return NotFound(ApiResponse<BotConfiguration>.ErrorResult("Bot not found"));
            }
            
            return Ok(ApiResponse<BotConfiguration>.SuccessResult(updatedBot, "Bot configuration saved"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving bot config {BotId}", botId);
            return StatusCode(500, ApiResponse<BotConfiguration>.ErrorResult(ex.Message));
        }
    }
    
    [HttpGet("{botId}/config")]
    public async Task<ActionResult<ApiResponse<BotConfiguration>>> GetBotConfig(string botId)
    {
        return await GetBot(botId);
    }
}