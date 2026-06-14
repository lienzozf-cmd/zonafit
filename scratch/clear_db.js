const supabaseUrl = "https://mjpoqjkmnhdhohyshwxk.supabase.co";
const serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qcG9xamttbmhkaG9oeXNod3hrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTQxNTE1MiwiZXhwIjoyMDk0OTkxMTUyfQ.1B1k6F3_SIX3f5tZJN5jCTxr6nojL6wQVD7YzCE6iLs";

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
