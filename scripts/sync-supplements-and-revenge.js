const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  console.log('🚀 Iniciando actualización de 4156 - Revenge Tees y creación de nuevos suplementos...');

  const productsJsonPath = path.join(process.cwd(), 'src/lib/products.json');
  const localProducts = JSON.parse(fs.readFileSync(productsJsonPath, 'utf-8'));

  // 1. Update 4156 - Revenge Tees (ID: 2614)
  const idx2614 = localProducts.findIndex(p => p.id === 2614);
  if (idx2614 >= 0) {
    const p2614 = localProducts[idx2614];
    
    // Put Black Red Wash as first image
    const blackRedImg = {
      alt: "Revenge Tees Black Red Wash",
      src: "/assets/images/marcas/youngla/hombre/4156 - Revenge Tees Spring '25 black red.webp",
      color: "Black Red Wash",
      dataAiHint: "graphic tee black red wash"
    };

    const remainingImgs = p2614.images.filter(img => !img.src.includes('black red'));
    p2614.images = [blackRedImg, ...remainingImgs];

    // Reorder colors to have Black Red Wash first so it is selected by default on product detail page
    const brwColor = p2614.colors.find(c => c.name === 'Black Red Wash');
    const otherColors = p2614.colors.filter(c => c.name !== 'Black Red Wash');
    if (brwColor) {
      p2614.colors = [brwColor, ...otherColors];
    }

    console.log('✅ 4156 - Revenge Tees actualizado con Black Red Wash como foto principal.');
  }

  // 2. Define the 3 new supplement products
  const newSupplements = [
    {
      id: 9109,
      name: 'YoungLATTe Latte',
      price: 'Q.35.00',
      availability: 'Disponible',
      description: 'Bebida funcional de café frío y nootrópicos Young LAtte, creada en colaboración especial entre YoungLA y Gorilla Mind. Elaborada con extracto real de café cold brew, 140 mg de cafeína natural y matriz nootrópica (Alpha-GPC, L-Teanina) para máxima concentración mental y energía limpia sin bajones.',
      gender: 'unisex',
      category: 'suplemento',
      subcategory: 'pre-entreno',
      brand: 'YoungLA',
      is_compression: false,
      images: [
        {
          alt: 'YoungLATTe Latte Colaboración YoungLA x Gorilla Mind',
          src: '/assets/images/marcas/suplementos/YoungLATTe Latte.webp',
          dataAiHint: 'younglatte cold brew coffee can'
        }
      ],
      options: {
        type: 'presentación',
        values: [
          {
            stock: 24,
            value: 'Pack'
          }
        ]
      },
      colors: [],
      feature1: 'Colaboración Oficial YoungLA x Gorilla Mind',
      feature2: 'Extracto Real Cold Brew con 140 mg de Cafeína',
      feature3: 'Matriz Nootrópica con Alpha-GPC y L-Teanina',
      feature4: 'Solo 25 Calorías y 1 g de Azúcar',
      benefits: 'Energía sostenida, agudeza mental y delicioso sabor a café latte.',
      servings_info: '1 lata (Pack)',
      visible: true
    },
    {
      id: 9110,
      name: 'BUM Energy Drink',
      price: 'Q.35.00',
      availability: 'Disponible',
      description: 'Bebida energética premium BUM Energy Drink de RAW Nutrition sabor Gummy Shark. Fórmula limpia formulada por Chris Bumstead con 112 mg de cafeína natural y 250 mg de Cognizin® Citicolina para un enfoque cerebral inigualable y cero bajón.',
      gender: 'unisex',
      category: 'suplemento',
      subcategory: 'pre-entreno',
      brand: 'RAW',
      is_compression: false,
      images: [
        {
          alt: 'BUM Energy Drink Gummy Shark',
          src: '/assets/images/marcas/bumenergy/BUM Energy Drink gummy shark.webp',
          dataAiHint: 'bum energy drink gummy shark can'
        }
      ],
      options: {
        type: 'presentación',
        values: [
          {
            stock: 36,
            value: 'Pack'
          }
        ]
      },
      colors: [],
      feature1: '112 mg de Cafeína Natural para Energía Limpia',
      feature2: '250 mg de Cognizin® Citicolina para Enfoque Mental',
      feature3: 'Cero Azúcar y Bajas Calorías',
      feature4: 'Delicioso Sabor Gummy Shark Refrescante',
      benefits: 'Enfoque mental duradero y energía constante sin temblores ni bajones.',
      servings_info: '1 lata (Pack)',
      visible: true
    },
    {
      id: 9111,
      name: 'Creatine Monohydrate  Premium (30 Servings)',
      price: 'Q.335.00',
      availability: 'Disponible',
      description: 'Creatina Monohidratada Micronizada Premium de RAW Nutrition (30 Servicios). Diseñada para incrementar la fuerza explosiva, acelerar la recuperación y optimizar la hipertrofia muscular con la máxima pureza.',
      gender: 'unisex',
      category: 'suplemento',
      subcategory: 'creatina',
      brand: 'RAW',
      is_compression: false,
      images: [
        {
          alt: 'Creatine Monohydrate Premium 30 Servings RAW',
          src: '/assets/images/marcas/raw/Creatine Monohydrate  Premium (30 Servings).webp',
          dataAiHint: 'creatine monohydrate premium jar'
        }
      ],
      options: {
        type: 'servicios',
        values: [
          {
            stock: 1,
            value: '30 Servings'
          }
        ]
      },
      colors: [],
      feature1: '100% Creatina Monohidratada Micronizada de Grado Farmacéutico',
      feature2: 'Incrementa la Resíntesis de ATP y Fuerza Muscular',
      feature3: 'Fórmula Sin Sabor (Unflavored) Ultra Soluble',
      feature4: '30 Servicios Completos por Envase',
      benefits: 'Mayor potencia, resistencia muscular y volumen celular.',
      servings_info: '30 servicios.',
      visible: true
    }
  ];

  for (const supp of newSupplements) {
    const existingIdx = localProducts.findIndex(p => p.id === supp.id);
    if (existingIdx >= 0) {
      localProducts[existingIdx] = supp;
    } else {
      localProducts.push(supp);
    }
    console.log(`✅ Suplemento [${supp.id}] ${supp.name} agregado/actualizado en JSON.`);
  }

  // Save JSON
  fs.writeFileSync(productsJsonPath, JSON.stringify(localProducts, null, 2), 'utf-8');
  console.log('✅ src/lib/products.json guardado.');

  // 3. Sync to Supabase `products` table
  console.log('🔄 Sincronizando con Supabase tabla `products`...');
  
  // Sync 2614
  const p2614 = localProducts.find(p => p.id === 2614);
  const { error: err2614 } = await supabase.from('products').upsert({
    id: p2614.id,
    name: p2614.name,
    price: p2614.price,
    availability: p2614.availability,
    description: p2614.description,
    gender: p2614.gender,
    category: p2614.category,
    subcategory: p2614.subcategory,
    brand: p2614.brand,
    fabric_type: p2614.fabric_type,
    is_compression: p2614.is_compression,
    images: p2614.images,
    options: p2614.options,
    colors: p2614.colors,
    feature1: p2614.feature1,
    feature2: p2614.feature2,
    feature3: p2614.feature3,
    feature4: p2614.feature4,
    visible: p2614.visible
  }, { onConflict: 'id' });
  if (err2614) console.error('Error actualizando 2614 en Supabase:', err2614);
  else console.log('✅ Producto 2614 actualizado en Supabase.');

  // Sync new supplements to Supabase
  for (const supp of newSupplements) {
    const { error: sErr } = await supabase.from('products').upsert({
      id: supp.id,
      name: supp.name,
      price: supp.price,
      availability: supp.availability,
      description: supp.description,
      gender: supp.gender,
      category: supp.category,
      subcategory: supp.subcategory,
      brand: supp.brand,
      is_compression: supp.is_compression,
      images: supp.images,
      options: supp.options,
      colors: supp.colors,
      feature1: supp.feature1,
      feature2: supp.feature2,
      feature3: supp.feature3,
      feature4: supp.feature4,
      benefits: supp.benefits,
      servings_info: supp.servings_info,
      visible: supp.visible
    }, { onConflict: 'id' });

    if (sErr) console.error(`Error guardando ${supp.id} en Supabase:`, sErr);
    else console.log(`✅ Suplemento [${supp.id}] guardado en Supabase.`);
  }

  // 4. Sync product_variants for the 3 supplements
  // For each supplement, register variants to support both exact option names and fallbacks
  const variantRows = [
    // YoungLATTe Latte (ID: 9109)
    { product_id: 9109, color_name: null, option_value: 'Pack', stock: 24 },
    { product_id: 9109, color_name: null, option_value: 'Unico', stock: 24 },
    { product_id: 9109, color_name: null, option_value: 'Único', stock: 24 },

    // BUM Energy Drink (ID: 9110)
    { product_id: 9110, color_name: null, option_value: 'Pack', stock: 36 },
    { product_id: 9110, color_name: null, option_value: 'Gummy Shark', stock: 36 },
    { product_id: 9110, color_name: null, option_value: 'Gummy Thark', stock: 36 },
    { product_id: 9110, color_name: null, option_value: 'Único', stock: 36 },

    // Creatine Monohydrate Premium (30 Servings) (ID: 9111)
    { product_id: 9111, color_name: null, option_value: '30 Servings', stock: 1 },
    { product_id: 9111, color_name: null, option_value: 'Unflavored', stock: 1 },
    { product_id: 9111, color_name: null, option_value: 'Único', stock: 1 }
  ];

  for (const v of variantRows) {
    const { data: existingV } = await supabase
      .from('product_variants')
      .select('id')
      .eq('product_id', v.product_id)
      .eq('option_value', v.option_value);

    if (existingV && existingV.length > 0) {
      await supabase
        .from('product_variants')
        .update({ stock: v.stock })
        .eq('id', existingV[0].id);
      console.log(`  ✓ Variante actualizada: Product ${v.product_id} - ${v.option_value} -> stock ${v.stock}`);
    } else {
      await supabase
        .from('product_variants')
        .insert(v);
      console.log(`  ✓ Nueva variante insertada: Product ${v.product_id} - ${v.option_value} -> stock ${v.stock}`);
    }
  }

  console.log('🎉 Finalizado con éxito.');
}

run();
