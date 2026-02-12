using OfficeOpenXml;
using Bom.ReportingService.DTOs;

namespace Bom.ReportingService.Reports.Excel
{
    public class BomExcelGenerator
    {
        public byte[] Generate(BomDto bom)
        {
            using var package = new ExcelPackage();
            var sheet = package.Workbook.Worksheets.Add("BOM");

            sheet.Cells[1, 1].Value = "Component";
            sheet.Cells[1, 2].Value = "Quantity";
            sheet.Row(1).Style.Font.Bold = true;

            int row = 2;

            foreach (var item in bom.Items)
            {
                AddItem(sheet, item, ref row, 0);
            }

            sheet.Cells.AutoFitColumns();
            return package.GetAsByteArray();
        }

        private void AddItem(ExcelWorksheet sheet, BomItemDto item, ref int row, int level)
        {
            sheet.Cells[row, 1].Value = new string(' ', level * 4) + item.Name;
            sheet.Cells[row, 2].Value = item.Quantity;
            row++;

            if (item.Children != null)
            {
                foreach (var child in item.Children)
                {
                    AddItem(sheet, child, ref row, level + 1);
                }
            }
        }
    }
}
