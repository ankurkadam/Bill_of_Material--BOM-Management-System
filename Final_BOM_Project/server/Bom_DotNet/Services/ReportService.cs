using Bom.ReportingService.Clients;
using Bom.ReportingService.Reports.Pdf;
using Bom.ReportingService.Reports.Excel;
using Bom.ReportingService.Services.Interfaces;

namespace Bom.ReportingService.Services;

public class ReportService : IReportService
{
    private readonly BomApiClient _client;

    public ReportService(BomApiClient client)
    {
        _client = client;
    }

    public async Task<byte[]> GeneratePdfAsync(int bomId)
    {
        var ownerId = await _client.GetProductOwnerAsync(bomId);

        bool isPremium = await _client.IsUserPremiumAsync(ownerId);

        if (!isPremium)
            throw new Exception("PREMIUM_REQUIRED");

        var bom = await _client.GetBomAsync(bomId);


        return new BomPdfGenerator().Generate(bom);
    }

    public async Task<byte[]> GenerateExcelAsync(int bomId)
    {
        var ownerId = await _client.GetProductOwnerAsync(bomId);

        bool isPremium = await _client.IsUserPremiumAsync(ownerId);

        if (!isPremium)
            throw new Exception("PREMIUM_REQUIRED");


        var bom = await _client.GetBomAsync(bomId);


        return new BomExcelGenerator().Generate(bom);
    }
}