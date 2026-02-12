namespace Bom.ReportingService.Services.Interfaces;

public interface IReportService
{
    Task<byte[]> GeneratePdfAsync(int bomId);
    Task<byte[]> GenerateExcelAsync(int bomId);
}