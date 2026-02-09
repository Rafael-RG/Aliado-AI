using Microsoft.AspNetCore.Mvc;
using AliadoAI.Backend.DTOs;
using AliadoAI.Backend.Models;
using AliadoAI.Backend.Services;

namespace AliadoAI.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BusinessesController : ControllerBase
{
    private readonly IDataStorageService _dataStorage;
    private readonly ILogger<BusinessesController> _logger;
    
    public BusinessesController(IDataStorageService dataStorage, ILogger<BusinessesController> logger)
    {
        _dataStorage = dataStorage;
        _logger = logger;
    }
    
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<Business>>>> GetAllBusinesses([FromQuery] string? ownerId = null)
    {
        try
        {
            IEnumerable<Business> businesses;
            
            if (!string.IsNullOrEmpty(ownerId))
            {
                businesses = await _dataStorage.FindAsync<Business>(b => b.OwnerId == ownerId);
            }
            else
            {
                businesses = await _dataStorage.GetAllAsync<Business>();
            }
            
            return Ok(ApiResponse<IEnumerable<Business>>.SuccessResult(businesses));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting businesses");
            return StatusCode(500, ApiResponse<IEnumerable<Business>>.ErrorResult(ex.Message));
        }
    }
    
    [HttpPost]
    public async Task<ActionResult<ApiResponse<Business>>> CreateBusiness([FromBody] Business business)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<Business>.ErrorResult("Invalid business data"));
            }
            
            var createdBusiness = await _dataStorage.CreateAsync(business);
            return CreatedAtAction(nameof(GetBusiness), new { id = createdBusiness.Id }, 
                ApiResponse<Business>.SuccessResult(createdBusiness, "Business created successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating business");
            return StatusCode(500, ApiResponse<Business>.ErrorResult(ex.Message));
        }
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<Business>>> GetBusiness(string id)
    {
        try
        {
            var business = await _dataStorage.FindByIdAsync<Business>(id);
            if (business == null)
            {
                return NotFound(ApiResponse<Business>.ErrorResult("Business not found"));
            }
            
            return Ok(ApiResponse<Business>.SuccessResult(business));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting business {BusinessId}", id);
            return StatusCode(500, ApiResponse<Business>.ErrorResult(ex.Message));
        }
    }
    
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<Business>>> UpdateBusiness(string id, [FromBody] Business business)
    {
        try
        {
            var updatedBusiness = await _dataStorage.UpdateAsync(id, business);
            if (updatedBusiness == null)
            {
                return NotFound(ApiResponse<Business>.ErrorResult("Business not found"));
            }
            
            return Ok(ApiResponse<Business>.SuccessResult(updatedBusiness, "Business updated successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating business {BusinessId}", id);
            return StatusCode(500, ApiResponse<Business>.ErrorResult(ex.Message));
        }
    }
}