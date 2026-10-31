const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mjpoqjkmnhdhohyshwxk.supabase.co";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

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
