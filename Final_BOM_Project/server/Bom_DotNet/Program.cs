using Bom.ReportingService.Clients;
using Bom.ReportingService.Services;
using Bom.ReportingService.Services.Interfaces;
using OfficeOpenXml;
using QuestPDF.Infrastructure;

var builder = WebApplication.CreateBuilder(args);


QuestPDF.Settings.License = LicenseType.Community;


ExcelPackage.License.SetNonCommercialPersonal("Lokesh Khachane");

builder.Services.AddControllers();
builder.Services.AddHttpClient();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<BomApiClient>();

var app = builder.Build();

app.UseCors("AllowReact");

app.MapControllers();

app.Run();
