using System.ComponentModel.DataAnnotations;

namespace AliadoAI.Backend.DTOs;

public class CreateUserRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [MinLength(3)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;
    
    public string Plan { get; set; } = "free";
}

public class UpdateUserRequest
{
    public string Name { get; set; } = string.Empty;
    
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    public bool? IsSubscribed { get; set; }
    
    public string? Plan { get; set; }
}