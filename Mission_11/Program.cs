using Microsoft.EntityFrameworkCore;
using Mission_11.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Swagger/OpenAPI setup
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add DbContext for SQLite database
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// Allow all origins, headers, and methods (open CORS)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.AllowAnyOrigin()  // Allow any origin
                  .AllowAnyHeader()  // Allow any headers
                  .AllowAnyMethod()  // Allow any HTTP method (GET, POST, PUT, DELETE, etc.)
                  .AllowCredentials();  // Allow credentials (cookies, etc.)
        });
});

var app = builder.Build();

// Enable CORS policy
app.UseCors("AllowFrontend");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
