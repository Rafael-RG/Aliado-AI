using AliadoAI.Backend.Models;

namespace AliadoAI.Backend.Services;

public interface IDataStorageService
{
    // Generic CRUD operations
    Task<T> CreateAsync<T>(T entity) where T : BaseEntity;
    Task<T?> FindByIdAsync<T>(string id) where T : BaseEntity;
    Task<IEnumerable<T>> FindAsync<T>(Func<T, bool>? filter = null) where T : BaseEntity;
    Task<IEnumerable<T>> GetAllAsync<T>() where T : BaseEntity;
    Task<T?> UpdateAsync<T>(string id, T entity) where T : BaseEntity;
    Task<bool> DeleteAsync<T>(string id) where T : BaseEntity;
    
    // Initialize storage and demo data
    Task InitializeAsync();
    Task InitializeDemoDataAsync();
}