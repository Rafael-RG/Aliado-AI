using System.Collections.Concurrent;
using AliadoAI.Backend.Models;
using System.Text.Json;
using BCrypt.Net;

namespace AliadoAI.Backend.Services;

public partial class InMemoryDataStorageService : IDataStorageService
{
    private readonly ConcurrentDictionary<Type, ConcurrentDictionary<string, BaseEntity>> _storage = new();
    private readonly ILogger<InMemoryDataStorageService> _logger;
    private bool _isInitialized = false;
    
    public InMemoryDataStorageService(ILogger<InMemoryDataStorageService> logger)
    {
        _logger = logger;
    }
    
    public async Task InitializeAsync()
    {
        if (_isInitialized) return;
        
        // Initialize storage for all entity types
        _storage.TryAdd(typeof(User), new ConcurrentDictionary<string, BaseEntity>());
        _storage.TryAdd(typeof(Business), new ConcurrentDictionary<string, BaseEntity>());
        _storage.TryAdd(typeof(BotConfiguration), new ConcurrentDictionary<string, BaseEntity>());
        _storage.TryAdd(typeof(WhatsAppConnection), new ConcurrentDictionary<string, BaseEntity>());
        _storage.TryAdd(typeof(Subscription), new ConcurrentDictionary<string, BaseEntity>());
        _storage.TryAdd(typeof(Metrics), new ConcurrentDictionary<string, BaseEntity>());
        _storage.TryAdd(typeof(TrainingData), new ConcurrentDictionary<string, BaseEntity>());
        
        await InitializeDemoDataAsync();
        
        _isInitialized = true;
        _logger.LogInformation("🗄️ Data storage initialized successfully");
    }
    
    public async Task<T> CreateAsync<T>(T entity) where T : BaseEntity
    {
        await Task.Run(() =>
        {
            var entityType = typeof(T);
            var storage = _storage.GetOrAdd(entityType, _ => new ConcurrentDictionary<string, BaseEntity>());
            
            if (storage.ContainsKey(entity.Id))
            {
                throw new InvalidOperationException($"Entity with ID {entity.Id} already exists");
            }
            
            entity.UpdatedAt = DateTime.UtcNow;
            storage.TryAdd(entity.Id, entity);
        });
        
        _logger.LogInformation("✅ Created {EntityType}: {EntityId}", typeof(T).Name, entity.Id);
        return entity;
    }
    
    public async Task<T?> FindByIdAsync<T>(string id) where T : BaseEntity
    {
        return await Task.Run(() =>
        {
            if (_storage.TryGetValue(typeof(T), out var storage) && 
                storage.TryGetValue(id, out var entity))
            {
                return (T)entity;
            }
            return null;
        });
    }
    
    public async Task<IEnumerable<T>> FindAsync<T>(Func<T, bool>? filter = null) where T : BaseEntity
    {
        return await Task.Run(() =>
        {
            if (!_storage.TryGetValue(typeof(T), out var storage))
                return Enumerable.Empty<T>();
            
            var entities = storage.Values.Cast<T>();
            
            return filter == null ? entities : entities.Where(filter);
        });
    }
    
    public async Task<IEnumerable<T>> GetAllAsync<T>() where T : BaseEntity
    {
        return await FindAsync<T>();
    }
    
    public async Task<T?> UpdateAsync<T>(string id, T entity) where T : BaseEntity
    {
        return await Task.Run(() =>
        {
            if (_storage.TryGetValue(typeof(T), out var storage) && 
                storage.TryGetValue(id, out _))
            {
                entity.Id = id; // Ensure ID doesn't change
                entity.UpdatedAt = DateTime.UtcNow;
                storage.TryUpdate(id, entity, (T)storage[id]);
                return entity;
            }
            return null;
        });
    }
    
    public async Task<bool> DeleteAsync<T>(string id) where T : BaseEntity
    {
        return await Task.Run(() =>
        {
            if (_storage.TryGetValue(typeof(T), out var storage))
            {
                return storage.TryRemove(id, out var _);
            }
            return false;
        });
    }
}