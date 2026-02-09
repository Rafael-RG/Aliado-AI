using AliadoAI.Backend.Models;
using BCrypt.Net;

namespace AliadoAI.Backend.Services;

public partial class InMemoryDataStorageService
{
    public async Task InitializeDemoDataAsync()
    {
        // Check if demo data already exists
        var existingUsers = await GetAllAsync<User>();
        if (existingUsers.Any())
        {
            _logger.LogInformation("✅ Demo data already exists");
            return;
        }
        
        _logger.LogInformation("🌱 Creating demo data...");
        
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
        
        _logger.LogInformation("✅ Demo data created successfully!");
        _logger.LogInformation("🔗 Test endpoints: http://localhost:5000/api/demo-data");
    }
}