const supabaseUrl = "https://mjpoqjkmnhdhohyshwxk.supabase.co";
const serviceKey = "[REDACTED_SERVICE_KEY]";

async function clearTable(tableName) {
  const url = `${supabaseUrl}/rest/v1/${tableName}?order_id=neq.0`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "apikey": serviceKey,
      "Authorization": `Bearer ${serviceKey}`,
      "Content-Profile": "public"
    }
  });

  if (response.ok) {
    console.log(`Table '${tableName}' cleared successfully.`);
  } else {
    const errorText = await response.text();
    console.error(`Failed to clear table '${tableName}':`, response.status, errorText);
  }
}

async function run() {
  // Delete order_items first due to foreign key constraints, matching all rows
  await clearTable("order_items");
  // Delete orders next
  await clearTable("orders");
}

run();
