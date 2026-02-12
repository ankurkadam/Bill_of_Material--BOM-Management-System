using System.Data;
using System.Text.Json;
using Bom.ReportingService.DTOs;
using MySql.Data.MySqlClient;

namespace Bom.ReportingService.Clients;

public class BomApiClient
{
    private readonly IConfiguration _config;

    public BomApiClient(IConfiguration config)
    {
        _config = config;
    }

    public async Task<bool> IsUserPremiumAsync(int userId)
    {
        var connStr = _config.GetConnectionString("DefaultConnection");

        using var conn = new MySqlConnection(connStr);
        await conn.OpenAsync();

        var cmd = new MySqlCommand(
            "SELECT plan FROM Users WHERE id = @uid",
            conn);

        cmd.Parameters.AddWithValue("@uid", userId);

        var result = await cmd.ExecuteScalarAsync();

        if (result == null)
            throw new Exception("User not found");

        return result.ToString() == "PREMIUM";
    }
    public async Task<int> GetProductOwnerAsync(int productId)
    {
        var connStr = _config.GetConnectionString("DefaultConnection");

        using var conn = new MySqlConnection(connStr);
        await conn.OpenAsync();

        var cmd = new MySqlCommand(
            "SELECT owner_id FROM product_master WHERE id = @pid",
            conn);

        cmd.Parameters.AddWithValue("@pid", productId);

        var result = await cmd.ExecuteScalarAsync();

        if (result == null)
            throw new Exception("BOM not found");

        return Convert.ToInt32(result);
    }


    public async Task<BomDto> GetBomAsync(int productId)
    {
        var connStr = _config.GetConnectionString("DefaultConnection");

        using var conn = new MySqlConnection(connStr);
        await conn.OpenAsync();

        
        var productCmd = new MySqlCommand(
            "SELECT id FROM product_master WHERE id = @pid",
            conn);
        productCmd.Parameters.AddWithValue("@pid", productId);

        var productExists = await productCmd.ExecuteScalarAsync();
        if (productExists == null)
            throw new Exception("BOM not found");   

      
        var compCmd = new MySqlCommand(@"
            SELECT component_id, component_name, quantity, parent_component_id
            FROM component_master
            WHERE product_id = @pid
        ", conn);

        compCmd.Parameters.AddWithValue("@pid", productId);

        var reader = await compCmd.ExecuteReaderAsync();

        var allItems = new Dictionary<int, BomItemDto>();
        var parentMap = new Dictionary<int, int?>();

        while (await reader.ReadAsync())
        {
            int id = reader.GetInt32("component_id");
            string name = reader.GetString("component_name");
            int qty = reader.IsDBNull("quantity") ? 0 : reader.GetInt32("quantity");
            int? parentId = reader.IsDBNull("parent_component_id")
                ? null
                : reader.GetInt32("parent_component_id");

            allItems[id] = new BomItemDto
            {
                Name = name,
                Quantity = qty,
                Children = new List<BomItemDto>()
            };

            parentMap[id] = parentId;
        }

        await reader.CloseAsync();

        // 3. Build hierarchy
        List<BomItemDto> roots = new();

        foreach (var kv in allItems)
        {
            int id = kv.Key;
            var item = kv.Value;
            int? parentId = parentMap[id];

            if (parentId == null)
            {
                roots.Add(item);
            }
            else if (allItems.ContainsKey(parentId.Value))
            {
                allItems[parentId.Value].Children.Add(item);
            }
        }

        
        var bom = new BomDto
        {
            Id = productId,
            Version = "v1.0",
            CreatedAt = DateTime.Now,
            Items = roots
        };

        return bom;
    }
}
