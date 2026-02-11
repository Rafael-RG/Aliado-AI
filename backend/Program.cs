using AliadoAI.Backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { 
        Title = "Aliado AI Backend API", 
        Version = "v2.0",
        Description = "WhatsApp Business API integration with AI-powered responses (.NET 9)"
    });
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Configure HTTP client
builder.Services.AddHttpClient();

// Configure logging
builder.Services.AddLogging(logging =>
{
    logging.AddConsole();
    logging.AddDebug();
    logging.SetMinimumLevel(LogLevel.Information);
});

// Register application services
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddSingleton<IDataStorageService, InMemoryDataStorageService>();
}
else
{
    builder.Services.AddSingleton<IDataStorageService, AzureStorageService>();
}
builder.Services.AddScoped<IGeminiService, GeminiService>();
builder.Services.AddScoped<IWhatsAppService, WhatsAppService>();

// Configure JSON options
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    options.SerializerOptions.WriteIndented = true;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Aliado AI Backend API v2.0");
        c.RoutePrefix = "swagger";
    });
}

// Use CORS
app.UseCors("AllowAll");

// Map controllers
app.MapControllers();

// Initialize data storage
using (var scope = app.Services.CreateScope())
{
    var dataStorage = scope.ServiceProvider.GetRequiredService<IDataStorageService>();
    await dataStorage.InitializeAsync();
}

// Environment configuration check
var configuration = app.Services.GetRequiredService<IConfiguration>();
var logger = app.Services.GetRequiredService<ILogger<Program>>();

// Configure port
var port = configuration.GetValue<int?>("PORT") ?? 5000;
app.Urls.Clear();
app.Urls.Add($"http://localhost:{port}");

logger.LogInformation(@"
🚀 Aliado AI Backend Server (.NET 9)
📱 WhatsApp Integration Ready
🗄️ Data Storage Initialized
🔥 Server running on http://localhost:{port}
📚 API Docs: http://localhost:{port}/swagger
📊 Health Check: http://localhost:{port}/health", port, port, port);

// Log environment configuration
logger.LogInformation("📋 Environment Check:");
logger.LogInformation("✅ Gemini API Key: {Status}", 
    !string.IsNullOrEmpty(configuration["Gemini:ApiKey"]) ? "Configured" : "❌ Missing");
logger.LogInformation("📞 WhatsApp Token: {Status}", 
    !string.IsNullOrEmpty(configuration["WhatsApp:AccessToken"]) ? "Configured" : "❌ Needs Meta Business Setup");
logger.LogInformation("🔒 Verify Token: {Token}", configuration["WhatsApp:VerifyToken"]);

if (string.IsNullOrEmpty(configuration["WhatsApp:AccessToken"]))
{
    logger.LogInformation(@"
⚠️  NEXT STEPS TO ACTIVATE WHATSAPP:
1. Go to https://developers.facebook.com/
2. Create a WhatsApp Business App
3. Get your Access Token and Phone Number ID
4. Update appsettings.json with real values
5. Use ngrok to expose this server: ngrok http {Port}", port);
}

app.Run();