using Microsoft.AspNetCore.Mvc;
using AliadoAI.Backend.DTOs;
using AliadoAI.Backend.Models;
using AliadoAI.Backend.Services;
using BCrypt.Net;

namespace AliadoAI.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IDataStorageService _dataStorage;
    private readonly ILogger<UsersController> _logger;
    
    public UsersController(IDataStorageService dataStorage, ILogger<UsersController> logger)
    {
        _dataStorage = dataStorage;
        _logger = logger;
    }
    
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<User>>>> GetAllUsers()
    {
        try
        {
            var users = await _dataStorage.GetAllAsync<User>();
            return Ok(ApiResponse<IEnumerable<User>>.SuccessResult(users));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting users");
            return StatusCode(500, ApiResponse<IEnumerable<User>>.ErrorResult(ex.Message));
        }
    }
    
    [HttpPost]
    public async Task<ActionResult<ApiResponse<User>>> CreateUser([FromBody] CreateUserRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<User>.ErrorResult("Invalid user data"));
            }
            
            // Check if user already exists
            var existingUsers = await _dataStorage.FindAsync<User>(u => u.Email == request.Email);
            if (existingUsers.Any())
            {
                return Conflict(ApiResponse<User>.ErrorResult("User with this email already exists"));
            }
            
            var user = new User
            {
                Email = request.Email,
                Name = request.Name,
                Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Plan = request.Plan
            };
            
            var createdUser = await _dataStorage.CreateAsync(user);
            return CreatedAtAction(nameof(GetUser), new { id = createdUser.Id }, 
                ApiResponse<User>.SuccessResult(createdUser, "User created successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user");
            return StatusCode(500, ApiResponse<User>.ErrorResult(ex.Message));
        }
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<User>>> GetUser(string id)
    {
        try
        {
            var user = await _dataStorage.FindByIdAsync<User>(id);
            if (user == null)
            {
                return NotFound(ApiResponse<User>.ErrorResult("User not found"));
            }
            
            return Ok(ApiResponse<User>.SuccessResult(user));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user {UserId}", id);
            return StatusCode(500, ApiResponse<User>.ErrorResult(ex.Message));
        }
    }
    
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<User>>> UpdateUser(string id, [FromBody] UpdateUserRequest request)
    {
        try
        {
            var existingUser = await _dataStorage.FindByIdAsync<User>(id);
            if (existingUser == null)
            {
                return NotFound(ApiResponse<User>.ErrorResult("User not found"));
            }
            
            // Update fields
            if (!string.IsNullOrEmpty(request.Name))
                existingUser.Name = request.Name;
            
            if (!string.IsNullOrEmpty(request.Email))
                existingUser.Email = request.Email;
            
            if (request.IsSubscribed.HasValue)
                existingUser.IsSubscribed = request.IsSubscribed.Value;
            
            if (!string.IsNullOrEmpty(request.Plan))
                existingUser.Plan = request.Plan;
            
            var updatedUser = await _dataStorage.UpdateAsync(id, existingUser);
            return Ok(ApiResponse<User>.SuccessResult(updatedUser, "User updated successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user {UserId}", id);
            return StatusCode(500, ApiResponse<User>.ErrorResult(ex.Message));
        }
    }
    
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteUser(string id)
    {
        try
        {
            var deleted = await _dataStorage.DeleteAsync<User>(id);
            if (!deleted)
            {
                return NotFound(ApiResponse<bool>.ErrorResult("User not found"));
            }
            
            return Ok(ApiResponse<bool>.SuccessResult(true, "User deleted successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user {UserId}", id);
            return StatusCode(500, ApiResponse<bool>.ErrorResult(ex.Message));
        }
    }
}