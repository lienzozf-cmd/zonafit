const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function processCreatineImage() {
  console.log('🎨 Procesando imagen de Creatina Premium para eliminar fondo blanco y centrar en 4:5...');
  const inputPath = 'public/assets/images/marcas/raw/Creatine Monohydrate  Premium (30 Servings).webp';
  const backupPath = 'public/assets/images/marcas/raw/Creatine Monohydrate  Premium (30 Servings).backup.webp';
  
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(inputPath, backupPath);
  }

  const { data, info } = await sharp(backupPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  // Create RGBA buffer
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    rgba[i * 4] = data[i * channels];
    rgba[i * 4 + 1] = data[i * channels + 1];
    rgba[i * 4 + 2] = data[i * channels + 2];
    rgba[i * 4 + 3] = 255;
  }

  // Flood fill from borders to make background transparent
  const visited = new Uint8Array(width * height);
  const queue = [];

  for (let x = 0; x < width; x++) {
    queue.push([x, 0]);
    queue.push([x, height - 1]);
  }
  for (let y = 0; y < height; y++) {
    queue.push([0, y]);
    queue.push([width - 1, y]);
  }

  while (queue.length > 0) {
    const [x, y] = queue.pop();
    if (x < 0 || x >= width || y < 0 || y >= height) continue;
    const pos = y * width + x;
    if (visited[pos]) continue;
    visited[pos] = 1;

    const idx = pos * 4;
    const r = rgba[idx], g = rgba[idx+1], b = rgba[idx+2];
    
    // Near white threshold (jar outline has gray lid edge and red/black graphics)
    if (r >= 235 && g >= 235 && b >= 235) {
      rgba[idx + 3] = 0; // Transparent
      queue.push([x + 1, y]);
      queue.push([x - 1, y]);
      queue.push([x, y + 1]);
      queue.push([x, y - 1]);
    }
  }

  // Convert raw RGBA buffer to PNG and trim transparent borders
  const pngBuffer = await sharp(rgba, { raw: { width, height, channels: 4 } })
    .png()
    .toBuffer();

  const jarPng = await sharp(pngBuffer)
    .trim()
    .toBuffer();

  // Target canvas: 1080 x 1350 (4:5 aspect ratio, same as YoungLATTe)
  const canvasW = 1080;
  const canvasH = 1350;
  
  // Resize jar to occupy ~68% of height (approx 920px tall)
  const resizedJar = await sharp(jarPng)
    .resize({ height: 920, width: 880, fit: 'inside' })
    .toBuffer({ resolveWithObject: true });

  const left = Math.round((canvasW - resizedJar.info.width) / 2);
  const top = Math.round((canvasH - resizedJar.info.height) / 2);

  // Composite on transparent 1080x1350 canvas
  await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite([{
    input: resizedJar.data,
    left,
    top
  }])
  .webp({ quality: 90 })
  .toFile(inputPath);

  console.log(`✅ Creatina Premium procesada con éxito: 1080x1350 transparente, tarro centrado (${resizedJar.info.width}x${resizedJar.info.height}).`);
}

async function processBumEnergyImage() {
  console.log('🎨 Procesando imagen de BUM Energy Gummy Thark para centrar en 4:5...');
  const inputPath = 'public/assets/images/marcas/bumenergy/BUM Energy Drink gummy Thark.webp';
  const backupPath = 'public/assets/images/marcas/bumenergy/BUM Energy Drink gummy Thark.backup.webp';

  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(inputPath, backupPath);
  }

  // Trim any existing transparent borders
  const trimmedCan = await sharp(backupPath)
    .trim()
    .toBuffer();

  const canvasW = 1080;
  const canvasH = 1350;

  // Scale can to height 920px (matching YoungLATTe proportions)
  const resizedCan = await sharp(trimmedCan)
    .resize({ height: 920, fit: 'inside' })
    .toBuffer({ resolveWithObject: true });

  const left = Math.round((canvasW - resizedCan.info.width) / 2);
  const top = Math.round((canvasH - resizedCan.info.height) / 2);

  await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite([{
    input: resizedCan.data,
    left,
    top
  }])
  .webp({ quality: 90 })
  .toFile(inputPath);

  console.log(`✅ BUM Energy Gummy Thark procesada con éxito: 1080x1350 transparente, lata centrada (${resizedCan.info.width}x${resizedCan.info.height}).`);
}

async function updateProductsData() {
  console.log('🔄 Actualizando productos en JSON y Supabase...');
  const jsonPath = path.join(process.cwd(), 'src/lib/products.json');
  let products = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  // 1. Remove separate product 9110
  products = products.filter(p => p.id !== 9110);
  console.log('✓ Producto 9110 eliminado de JSON.');

  // 2. Update product 2648 (Bum Energy)
  const p2648 = products.find(p => p.id === 2648);
  if (p2648) {
    p2648.price = 'Q.35.00';
    p2648.availability = 'Disponible';

    const gummyImg = {
      alt: 'BUM Energy Drink Gummy Thark',
      src: '/assets/images/marcas/bumenergy/BUM Energy Drink gummy Thark.webp',
      option: 'Gummy Thark',
      dataAiHint: 'energy drink gummy Thark'
    };

    // Filter out if already exists, then put it as FIRST image
    p2648.images = [gummyImg, ...p2648.images.filter(img => !img.src.includes('gummy Thark'))];

    // Add Gummy Thark to options values at the front
    const existingOptIdx = p2648.options.values.findIndex(o => o.value.toLowerCase().includes('gummy'));
    if (existingOptIdx >= 0) {
      p2648.options.values[existingOptIdx].stock = 36;
      p2648.options.values[existingOptIdx].value = 'Gummy Thark';
    } else {
      p2648.options.values.unshift({
        stock: 36,
        value: 'Gummy Thark'
      });
    }

    console.log('✓ Producto 2648 (Bum Energy) actualizado: precio Q.35.00, sabor Gummy Thark con stock 36.');
  }

  fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2), 'utf-8');
  console.log('✅ src/lib/products.json guardado.');

  // 3. Supabase updates
  console.log('🔄 Sincronizando con Supabase...');
  
  // Delete product 9110 from products and product_variants
  await supabase.from('product_variants').delete().eq('product_id', 9110);
  await supabase.from('products').delete().eq('id', 9110);
  console.log('✓ Producto 9110 eliminado de Supabase.');

  // Update product 2648 in Supabase
  if (p2648) {
    const { error: updErr } = await supabase.from('products').update({
      price: p2648.price,
      availability: p2648.availability,
      images: p2648.images,
      options: p2648.options
    }).eq('id', 2648);

    if (updErr) {
      console.error('Error actualizando 2648 en Supabase:', updErr);
    } else {
      console.log('✓ Producto 2648 actualizado en tabla products.');
    }

    // Add variants for 2648
    const variants2648 = [
      { product_id: 2648, color_name: null, option_value: 'Gummy Thark', stock: 36 },
      { product_id: 2648, color_name: null, option_value: 'Gummy Thark', stock: 36 },
      { product_id: 2648, color_name: null, option_value: 'BUM Energy Drink Gummy Thark', stock: 36 },
      { product_id: 2648, color_name: null, option_value: 'Pack', stock: 36 }
    ];

    for (const v of variants2648) {
      const { data: existing } = await supabase
        .from('product_variants')
        .select('id')
        .eq('product_id', v.product_id)
        .eq('option_value', v.option_value);

      if (existing && existing.length > 0) {
        await supabase
          .from('product_variants')
          .update({ stock: v.stock })
          .eq('id', existing[0].id);
      } else {
        await supabase
          .from('product_variants')
          .insert(v);
      }
    }
    console.log('✓ Variantes de Gummy Thark para producto 2648 guardadas en Supabase.');
  }

  // Also ensure Creatine Premium (9111) is updated in Supabase
  const p9111 = products.find(p => p.id === 9111);
  if (p9111) {
    await supabase.from('products').upsert({
      id: p9111.id,
      name: p9111.name,
      price: p9111.price,
      availability: p9111.availability,
      description: p9111.description,
      gender: p9111.gender,
      category: p9111.category,
      subcategory: p9111.subcategory,
      brand: p9111.brand,
      images: p9111.images,
      options: p9111.options,
      visible: true
    }, { onConflict: 'id' });
    console.log('✓ Producto 9111 verificado en Supabase.');
  }

  console.log('🎉 Todo completado exitosamente.');
}

async function main() {
  await processCreatineImage();
  await processBumEnergyImage();
  await updateProductsData();
}

main().catch(console.error);
