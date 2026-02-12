namespace Bom.ReportingService.DTOs;

    public class BomItemDto
    {
        public string Name { get; set; }
        public int Quantity { get; set; }
        public List<BomItemDto> Children { get; set; }
    }