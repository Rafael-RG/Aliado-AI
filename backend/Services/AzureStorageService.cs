using Azure.Data.Tables;
using AliadoAI.Backend.Models;
using System.Collections.Concurrent;
using System.Text.Json;

namespace AliadoAI.Backend.Services;

public class AzureStorageService : IDataStorageService
{
    private readonly TableServiceClient _tableServiceClient;
    private readonly ILogger<AzureStorageService> _logger;
    private readonly ConcurrentDictionary<Type, TableClient> _tableClients = new();
    private bool _isInitialized = false;

    public AzureStorageService(IConfiguration configuration, ILogger<AzureStorageService> logger)
    {
        _logger = logger;
        
        var connectionString = configuration.GetConnectionString("AzureStorage");
        if (string.IsNullOrEmpty(connectionString))
        {
            _logger.LogWarning("⚠️ Azure Storage connection string not found. Using development storage emulator.");
            connectionString = "UseDevelopmentStorage=true";
        }
        
        _tableServiceClient = new TableServiceClient(connectionString);
        _logger.LogInformation("🔗 Azure Storage client initialized");
    }

    public async Task InitializeAsync()
    {
        if (_isInitialized) return;

        try
        {
            // Initialize tables for all entity types
            await InitializeTableAsync<User>();
            await InitializeTableAsync<Business>();
            await InitializeTableAsync<BotConfiguration>();
            await InitializeTableAsync<WhatsAppConnection>();
            await InitializeTableAsync<Subscription>();
            await InitializeTableAsync<Metrics>();
            await InitializeTableAsync<TrainingData>();

            await InitializeDemoDataAsync();

            _isInitialized = true;
            _logger.LogInformation("✅ Azure Storage initialized successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Failed to initialize Azure Storage");
            throw;
        }
    }

    private async Task InitializeTableAsync<T>() where T : BaseEntity
    {
        var tableName = GetTableName<T>();
        var tableClient = _tableServiceClient.GetTableClient(tableName);
        
        await tableClient.CreateIfNotExistsAsync();
        _tableClients.TryAdd(typeof(T), tableClient);
        
        _logger.LogInformation("📊 Initialized table: {TableName}", tableName);
    }

    private string GetTableName<T>() where T : BaseEntity
    {
        return typeof(T).Name.ToLowerInvariant();
    }

    private TableClient GetTableClient<T>() where T : BaseEntity
    {
        if (_tableClients.TryGetValue(typeof(T), out var client))
            return client;
        
        throw new InvalidOperationException($"Table for {typeof(T).Name} not initialized");
    }

    public async Task<T> CreateAsync<T>(T entity) where T : BaseEntity
    {
        try
        {
            var tableClient = GetTableClient<T>();
            var tableEntity = ConvertToTableEntity(entity);
            
            await tableClient.AddEntityAsync(tableEntity);
            
            _logger.LogInformation("✅ Created {EntityType} in Azure Storage: {EntityId}", typeof(T).Name, entity.Id);
            return entity;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Failed to create {EntityType}: {EntityId}", typeof(T).Name, entity.Id);
            throw;
        }
    }

    public async Task<T?> FindByIdAsync<T>(string id) where T : BaseEntity
    {
        try
        {
            var tableClient = GetTableClient<T>();
            
            var response = await tableClient.GetEntityIfExistsAsync<TableEntity>("default", id);
            if (!response.HasValue || response.Value == null)
                return null;

            return ConvertFromTableEntity<T>(response.Value);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Failed to find {EntityType}: {EntityId}", typeof(T).Name, id);
            return null;
        }
    }

    public async Task<IEnumerable<T>> FindAsync<T>(Func<T, bool>? filter = null) where T : BaseEntity
    {
        try
        {
            var entities = await GetAllAsync<T>();
            
            return filter == null ? entities : entities.Where(filter);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Failed to query {EntityType}", typeof(T).Name);
            return Enumerable.Empty<T>();
        }
    }

    public async Task<IEnumerable<T>> GetAllAsync<T>() where T : BaseEntity
    {
        try
        {
            var tableClient = GetTableClient<T>();
            var entities = new List<T>();

            await foreach (var tableEntity in tableClient.QueryAsync<TableEntity>())
            {
                var entity = ConvertFromTableEntity<T>(tableEntity);
                if (entity != null)
                    entities.Add(entity);
            }

            return entities;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Failed to get all {EntityType}", typeof(T).Name);
            return Enumerable.Empty<T>();
        }
    }

    public async Task<T?> UpdateAsync<T>(string id, T entity) where T : BaseEntity
    {
        try
        {
            var tableClient = GetTableClient<T>();
            
            entity.Id = id; // Ensure ID doesn't change
            entity.UpdatedAt = DateTime.UtcNow;
            
            var tableEntity = ConvertToTableEntity(entity);
            await tableClient.UpdateEntityAsync(tableEntity, Azure.ETag.All);
            
            _logger.LogInformation("✅ Updated {EntityType} in Azure Storage: {EntityId}", typeof(T).Name, id);
            return entity;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Failed to update {EntityType}: {EntityId}", typeof(T).Name, id);
            return null;
        }
    }

    public async Task<bool> DeleteAsync<T>(string id) where T : BaseEntity
    {
        try
        {
            var tableClient = GetTableClient<T>();
            await tableClient.DeleteEntityAsync("default", id);
            
            _logger.LogInformation("✅ Deleted {EntityType} from Azure Storage: {EntityId}", typeof(T).Name, id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Failed to delete {EntityType}: {EntityId}", typeof(T).Name, id);
            return false;
        }
    }

    private TableEntity ConvertToTableEntity<T>(T entity) where T : BaseEntity
    {
        var json = JsonSerializer.Serialize(entity);
        var tableEntity = new TableEntity("default", entity.Id);
        tableEntity.Add("Data", json);
        tableEntity.Add("EntityType", typeof(T).Name);
        tableEntity.Add("CreatedAt", entity.CreatedAt);
        tableEntity.Add("UpdatedAt", entity.UpdatedAt);
        
        return tableEntity;
    }

    private T? ConvertFromTableEntity<T>(TableEntity tableEntity) where T : BaseEntity
    {
        try
        {
            if (tableEntity.TryGetValue("Data", out var data) && data is string json)
            {
                return JsonSerializer.Deserialize<T>(json);
            }
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Failed to deserialize {EntityType}", typeof(T).Name);
            return null;
        }
    }

    public async Task InitializeDemoDataAsync()
    {
        try
        {
            // Check if demo data already exists
            var existingUsers = await GetAllAsync<User>();
            if (existingUsers.Any())
            {
                _logger.LogInformation("✅ Demo data already exists in Azure Storage");
                return;
            }

            _logger.LogInformation("🌱 Creating demo data in Azure Storage...");

            // Create the same demo data as InMemoryDataStorageService
            await CreateDemoUser();
            await Task.Delay(100); // Small delay to avoid conflicts

            _logger.LogInformation("✅ Demo data created successfully in Azure Storage!");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Failed to initialize demo data in Azure Storage");
        }
    }

    private async Task CreateDemoUser()
    {
        // Create demo user
        var demoUser = new User
        {
            Email = "demo@aliado-ai.com",
            Name = "Demo User",
            Password = BCrypt.Net.BCrypt.HashPassword("demo123"),
            IsSubscribed = true,
            Plan = "pro",
            SubscriptionExpiry = DateTime.UtcNow.AddMonths(1)
        };
        await CreateAsync(demoUser);

        // Create demo business
        var demoBusiness = new Business
        {
            OwnerId = demoUser.Id,
            Name = "Demo Restaurant",
            Type = "restaurant",
            Industry = "Food & Beverage",
            Description = "Un restaurante de comida argentina especializado en parrilla y empanadas",
            Phone = "+54 11 1234-5678",
            Email = "info@demorestaurant.com",
            Website = "https://demorestaurant.com",
            Address = new BusinessAddress
            {
                Street = "Av. Corrientes 1234",
                City = "Buenos Aires",
                State = "CABA",
                Country = "Argentina",
                PostalCode = "C1043"
            }
        };
        await CreateAsync(demoBusiness);

        // Create demo bot
        var demoBot = new BotConfiguration
        {
            BusinessId = demoBusiness.Id,
            Name = "Asistente de Restaurante",
            Role = "customer_service",
            Tone = "friendly",
            BusinessType = "restaurant",
            KnowledgeBase = "Somos un restaurante argentino con especialidad en carnes a la parrilla y empanadas caseras. Horarios: Mar-Dom 12:00-24:00. Aceptamos reservas.",
            CustomInstructions = "Siempre ser cordial y ofrecer nuestras especialidades. Si preguntan por reservas, pedir teléfono y cantidad de personas.",
            WebConfig = new WebConfiguration
            {
                PrimaryColor = "#e63946",
                WelcomeMessage = "¡Bienvenido a Demo Restaurant! ¿En qué puedo ayudarte?",
                Position = "right"
            }
        };
        await CreateAsync(demoBot);

        // Create sample training data
        var trainingQuestions = new[]
        {
            new TrainingData
            {
                BusinessId = demoBusiness.Id,
                BotId = demoBot.Id,
                Question = "¿Cuáles son los horarios del restaurante?",
                Answer = "Nuestro restaurante está abierto de martes a domingo de 12:00 a 24:00 hs. Los lunes estamos cerrados.",
                Category = "Horarios",
                Tags = ["horarios", "abierto", "cerrado"]
            },
            new TrainingData
            {
                BusinessId = demoBusiness.Id,
                BotId = demoBot.Id,
                Question = "¿Cuál es la especialidad de la casa?",
                Answer = "Nuestra especialidad son las carnes a la parrilla y las empanadas caseras. Te recomiendo el bife de chorizo con chimichurri y nuestras empanadas de carne cortada a cuchillo.",
                Category = "Menú",
                Tags = ["especialidad", "parrilla", "empanadas", "recomendacion"]
            },
            new TrainingData
            {
                BusinessId = demoBusiness.Id,
                BotId = demoBot.Id,
                Question = "¿Puedo hacer una reserva?",
                Answer = "Por supuesto! Para hacer una reserva necesito que me proporciones tu teléfono, el día y hora que prefieres, y la cantidad de personas. ¿Me podes dar esos datos?",
                Category = "Reservas",
                Tags = ["reserva", "telefono", "personas", "fecha"]
            }
        };

        foreach (var training in trainingQuestions)
        {
            await CreateAsync(training);
        }

        // Create sample metrics
        var demoMetrics = new Metrics
        {
            BusinessId = demoBusiness.Id,
            BotId = demoBot.Id,
            Date = DateOnly.FromDateTime(DateTime.Today),
            Conversations = new ConversationMetrics { Total = 45, New = 23, Returning = 22, Completed = 41 },
            Messages = new MessageMetrics { Sent = 127, Received = 89, Failed = 2 },
            Performance = new PerformanceMetrics { AvgResponseTime = 1.2, ResolutionRate = 0.89, SatisfactionScore = 4.6 },
            Business = new BusinessMetrics { LeadsCaptured = 12, SalesConverted = 8, Revenue = 2450, TimeSaved = 180 }
        };
        await CreateAsync(demoMetrics);

        // Update relationships
        demoUser.Businesses.Add(demoBusiness.Id);
        demoBusiness.Bots.Add(demoBot.Id);

        await UpdateAsync(demoUser.Id, demoUser);
        await UpdateAsync(demoBusiness.Id, demoBusiness);
    }
}