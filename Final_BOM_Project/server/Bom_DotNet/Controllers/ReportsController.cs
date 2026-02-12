using Microsoft.AspNetCore.Mvc;
using Bom.ReportingService.Services.Interfaces;

namespace Bom.ReportingService.Controllers;

[ApiController]
[Route("api/reports")]
public class ReportController : ControllerBase
{
    private readonly IReportService _service;

    public ReportController(IReportService service)
    {
        _service = service;
    }

    [HttpGet("bom/{Id}/pdf")]
    public async Task<IActionResult> GeneratePdf(int Id)
    {
        try
        {
            var pdf = await _service.GeneratePdfAsync(Id);
            return File(pdf, "application/pdf", $"{Id}bom-report.pdf");
        }
        catch (Exception ex)
        {
            if (ex.Message == "PREMIUM_REQUIRED")
                return StatusCode(403, "PDF allowed only for PREMIUM users");

            if (ex.Message == "BOM not found")
                return NotFound();

            return StatusCode(500, ex.Message);
        }

    }

    [HttpGet("bom/{Id}/excel")]
    public async Task<IActionResult> GenerateExcel(int Id)
    {
        try{
        var excel = await _service.GenerateExcelAsync(Id);
        return File(
            excel,
         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "bom-report.xlsx");
        }
         catch (Exception ex)
    {
        if (ex.Message == "PREMIUM_REQUIRED")
            return StatusCode(403, "Download allowed only for PREMIUM users");

        if (ex.Message == "BOM not found")
            return NotFound();

        return StatusCode(500, ex.Message);
    }
    }
}