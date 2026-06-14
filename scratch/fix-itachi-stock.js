const supabaseUrl = "https://mjpoqjkmnhdhohyshwxk.supabase.co";
const serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qcG9xamttbmhkaG9oeXNod3hrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTQxNTE1MiwiZXhwIjoyMDk0OTkxMTUyfQ.1B1k6F3_SIX3f5tZJN5jCTxr6nojL6wQVD7YzCE6iLs";

async function getItachiVariant() {
  const url = `${supabaseUrl}/rest/v1/product_variants?product_id=eq.2724&color_name=eq.Black&option_value=eq.M`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "apikey": serviceKey,
      "Authorization": `Bearer ${serviceKey}`,
      "Content-Profile": "public"
    }
  });

  if (response.ok) {
    const data = await response.json();
    console.log("Current Itachi Variant in DB:", data);
    return data[0];
  } else {
    console.error("Failed to fetch variant:", response.status, await response.text());
  }
}

async function updateItachiStock(newStock) {
  const url = `${supabaseUrl}/rest/v1/product_variants?product_id=eq.2724&color_name=eq.Black&option_value=eq.M`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "apikey": serviceKey,
      "Authorization": `Bearer ${serviceKey}`,
      "Content-Profile": "public",
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    body: JSON.stringify({ stock: newStock })
  });

  if (response.ok) {
    const data = await response.json();
    console.log("Updated Itachi Variant in DB:", data);
  } else {
    console.error("Failed to update variant stock:", response.status, await response.text());
  }
}

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
  // Clear any new order
  await clearTable("order_items");
  await clearTable("orders");

  // Get and increment Itachi stock
  const variant = await getItachiVariant();
  if (variant) {
    const currentStock = variant.stock;
    const nextStock = currentStock + 1;
    await updateItachiStock(nextStock);
  }
}

run();
