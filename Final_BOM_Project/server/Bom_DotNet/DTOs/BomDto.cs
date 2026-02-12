namespace Bom.ReportingService.DTOs;

    public class BomDto
    {
        public int Id { get; set; }
        public string Version { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<BomItemDto> Items { get; set; }
    }
