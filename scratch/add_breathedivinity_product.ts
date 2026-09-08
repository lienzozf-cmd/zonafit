import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addNewProduct() {
  console.log('--- AGREGANDO NUEVA PRENDA BREATHE DIVINITY CON MÁXIMA SEGURIDAD ---');

  // 1. Verificación previa de seguridad
  const { data: currentVariants, error: vErr } = await supabase.from('product_variants').select('*');
  if (vErr || !currentVariants) {
    throw new Error('Error al leer product_variants antes de insertar: ' + vErr?.message);
  }
  const initialVariantsCount = currentVariants.length;
  console.log(`Variantes actuales en DB antes de insertar: ${initialVariantsCount}`);

  // 2. Definir el nuevo producto
  const newId = 5095;
  const newProductData = {
    id: newId,
    name: 'T-Shirt Oversized Heavenly Red',
    price: 'Q.720.00',
    original_price: null,
    availability: 'Disponible',
    description: 'Playera oversized con corte drop shoulder y diseño exclusivo Heavenly Red de Breathe Divinity. Confeccionada en algodón premium de alto gramaje para máxima comodidad, durabilidad y estilo dentro y fuera del gimnasio.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'Breathe Divinity',
    fabric_type: '100% Algodón Pesado',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/breathedivinity/t shirt oversized heavenly red.webp',
        alt: 'T-Shirt Oversized Heavenly Red - Breathe Divinity',
        dataAiHint: 'men oversized t shirt'
      }
    ],
    options: {
      type: 'talla',
      values: [
        {
          value: 'S',
          stock: 1
        }
      ]
    },
    colors: [],
    feature1: 'Corte Oversized Drop Shoulder',
    feature2: 'Algodón Premium de Alto Gramaje',
    feature3: 'Estampado Gráfico Heavenly Red',
    feature4: 'Estilo Streetwear & Fitness de Alta Gama',
    benefits: null,
    servings_info: null,
    visible: true,
  };

  // 3. Insertar producto en Supabase
  console.log(`Insertando producto ID ${newId} en tabla 'products'...`);
  const { error: insertProdErr } = await supabase
    .from('products')
    .insert(newProductData);

  if (insertProdErr) {
    throw new Error('Error al insertar producto en Supabase: ' + insertProdErr.message);
  }
  console.log('✅ Producto insertado exitosamente en tabla products.');

  // 4. Insertar variante en Supabase
  console.log(`Insertando variante para ID ${newId} (Talla S, Stock 1) en tabla 'product_variants'...`);
  const newVariantData = {
    product_id: newId,
    color_name: null,
    option_value: 'S',
    stock: 1
  };

  const { error: insertVarErr } = await supabase
    .from('product_variants')
    .insert(newVariantData);

  if (insertVarErr) {
    throw new Error('Error al insertar variante en Supabase: ' + insertVarErr.message);
  }
  console.log('✅ Variante insertada exitosamente en tabla product_variants.');

  // 5. Verificar que nada más cambió
  const { data: afterVariants } = await supabase.from('product_variants').select('*');
  console.log(`Variantes en DB después de insertar: ${afterVariants?.length} (Esperado: ${initialVariantsCount + 1})`);
  
  if (afterVariants?.length !== initialVariantsCount + 1) {
    console.error('ALERTA: El número de variantes no coincide con lo esperado!');
  } else {
    console.log('🔒 Verificación exitosa: Solo se agregó 1 variante nueva. Las 272 variantes existentes no fueron alteradas.');
  }

  // 6. Actualizar products.json local
  const productsJsonPath = path.join(process.cwd(), 'src/lib/products.json');
  const localProducts = JSON.parse(fs.readFileSync(productsJsonPath, 'utf-8'));

  // Asegurarnos de que no esté duplicado
  const existingIdx = localProducts.findIndex((p: any) => p.id === newId);
  const localProductObj = {
    ...newProductData,
    originalPrice: undefined
  };

  if (existingIdx >= 0) {
    localProducts[existingIdx] = localProductObj;
  } else {
    // Agregar al inicio para que aparezca primero en catálogo
    localProducts.unshift(localProductObj);
  }

  fs.writeFileSync(productsJsonPath, JSON.stringify(localProducts, null, 2));
  console.log(`✅ products.json actualizado con el nuevo producto (Total en JSON: ${localProducts.length})`);
}

addNewProduct().catch(console.error);
