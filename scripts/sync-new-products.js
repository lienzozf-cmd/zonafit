const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 1. Define the 10 products
const productsData = [
  // 1) 5209 - Batman Armored Zip-Ups (NEW - ID: 9101)
  {
    id: 9101,
    name: '5209 - Batman Armored Zip-Ups',
    price: 'Q.790.00',
    availability: 'Disponible',
    description: 'Chaqueta táctica con cremallera completa Batman Armored de YoungLA. Confeccionada con acabados wash de alto nivel y detalles blindados para máxima durabilidad y estilo.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'sudadera',
    brand: 'YoungLA',
    fabric_type: '100% Cotton French Terry',
    is_compression: false,
    images: [
      {
        alt: '5209 - Batman Armored Zip-Ups Grey Wash',
        src: '/assets/images/marcas/youngla/hombre/5209 - Batman Armored Zip-Ups grey.webp',
        color: 'Grey Wash',
        dataAiHint: 'zip up grey'
      },
      {
        alt: '5209 - Batman Armored Zip-Ups Black Wash',
        src: '/assets/images/marcas/youngla/hombre/5209 - Batman Armored Zip-Ups black.webp',
        color: 'Black Wash',
        dataAiHint: 'zip up black'
      }
    ],
    options: { type: 'talla', values: [] },
    colors: [
      {
        hex: '#5A5A5A',
        name: 'Grey Wash',
        options: {
          type: 'talla',
          values: [{ stock: 1, value: 'L' }]
        },
        imageSrc: '/assets/images/marcas/youngla/hombre/5209 - Batman Armored Zip-Ups grey.webp'
      },
      {
        hex: '#2A2A2A',
        name: 'Black Wash',
        options: {
          type: 'talla',
          values: [{ stock: 1, value: 'L' }]
        },
        imageSrc: '/assets/images/marcas/youngla/hombre/5209 - Batman Armored Zip-Ups black.webp'
      }
    ],
    feature1: 'Diseño Blindado Armored Colección Batman',
    feature2: 'Cremallera Completa Metálica Reforzada',
    feature3: 'Lavado Especial Wash de Estilo Vintage',
    feature4: 'Corte Relajado con Acabados Premium',
    visible: true
  },

  // 2) 4259 - Batman Compression Tees (EXISTING - ID: 3052)
  {
    id: 3052,
    name: '4259 - Batman Compression Tees',
    price: 'Q.615.00',
    availability: 'Disponible',
    description: 'Camiseta de compresión técnica de Batman. Diseñada para mejorar el rendimiento muscular y la recuperación, con un ajuste de compresión superior.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'YoungLA',
    fabric_type: '88% Polyester, 12% Spandex',
    is_compression: true,
    images: [
      {
        alt: '4259 - Batman Compression Tees - Black',
        src: '/assets/images/marcas/youngla/hombre/4259 - Batman Compression Tees black.webp',
        color: 'Black',
        dataAiHint: 'compression tee'
      },
      {
        alt: '4259 - Batman Compression Tees - Off White',
        src: '/assets/images/marcas/youngla/hombre/4259 - Batman Compression Tees off white.webp',
        color: 'Off White',
        dataAiHint: 'compression tee'
      },
      {
        alt: '4259 - Batman Compression Tees - Darc Grey',
        src: '/assets/images/marcas/youngla/hombre/4259 - Batman Compression Tees New Colors darc grey.webp',
        color: 'Darc Grey',
        dataAiHint: 'compression tee darc grey'
      }
    ],
    options: { type: 'talla', values: [] },
    colors: [
      {
        hex: '#000000',
        name: 'Black',
        options: {
          type: 'talla',
          values: [
            { stock: 0, value: 'S' },
            { stock: 2, value: 'M' },
            { stock: 1, value: 'L' }
          ]
        },
        imageSrc: '/assets/images/marcas/youngla/hombre/4259 - Batman Compression Tees black.webp'
      },
      {
        hex: '#F5F5F0',
        name: 'Off White',
        options: {
          type: 'talla',
          values: [
            { stock: 1, value: 'M' }
          ]
        },
        imageSrc: '/assets/images/marcas/youngla/hombre/4259 - Batman Compression Tees off white.webp'
      },
      {
        hex: '#3D3D3D',
        name: 'Darc Grey',
        options: {
          type: 'talla',
          values: [
            { stock: 1, value: 'M' }
          ]
        },
        imageSrc: '/assets/images/marcas/youngla/hombre/4259 - Batman Compression Tees New Colors darc grey.webp'
      }
    ],
    feature1: 'Compresión Graduada de Alto Soporte',
    feature2: 'Tejido Tecnológico de Secado Rápido',
    feature3: 'Costuras Planas Ergonómicas Anti-Fricción',
    feature4: 'Propiedades Antimicrobianas Permanentes',
    visible: true
  },

  // 3) 8066 - Superman Compression Longsleeves (NEW - ID: 9102)
  {
    id: 9102,
    name: '8066 - Superman Compression Longsleeves',
    price: 'Q.575.00',
    availability: 'Disponible',
    description: 'Camiseta de compresión manga larga Superman de YoungLA. Diseñada con tejido elástico de compresión que se adapta al cuerpo como una segunda piel, realzando la musculatura.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'YoungLA',
    fabric_type: '88% Polyester, 12% Spandex',
    is_compression: true,
    images: [
      {
        alt: '8066 - Superman Compression Longsleeves Red',
        src: '/assets/images/marcas/youngla/hombre/8066 - Superman Compression Longsleeves red.webp',
        color: 'Red',
        dataAiHint: 'superman compression longsleeve red'
      },
      {
        alt: '8066 - Superman Compression Longsleeves Blue',
        src: '/assets/images/marcas/youngla/hombre/8066 - Superman Compression Longsleeves blue.webp',
        color: 'Blue',
        dataAiHint: 'superman compression longsleeve blue'
      },
      {
        alt: '8066 - Superman Compression Longsleeves Black',
        src: '/assets/images/marcas/youngla/hombre/8066 - Superman Compression Longsleeves black.webp',
        color: 'Black',
        dataAiHint: 'superman compression longsleeve black'
      }
    ],
    options: { type: 'talla', values: [] },
    colors: [
      {
        hex: '#B91C1C',
        name: 'Red',
        options: {
          type: 'talla',
          values: [{ stock: 1, value: 'M' }]
        },
        imageSrc: '/assets/images/marcas/youngla/hombre/8066 - Superman Compression Longsleeves red.webp'
      },
      {
        hex: '#1D4ED8',
        name: 'Blue',
        options: {
          type: 'talla',
          values: [
            { stock: 2, value: 'M' },
            { stock: 1, value: 'L' }
          ]
        },
        imageSrc: '/assets/images/marcas/youngla/hombre/8066 - Superman Compression Longsleeves blue.webp'
      },
      {
        hex: '#000000',
        name: 'Black',
        options: {
          type: 'talla',
          values: [{ stock: 1, value: 'M' }]
        },
        imageSrc: '/assets/images/marcas/youngla/hombre/8066 - Superman Compression Longsleeves black.webp'
      }
    ],
    feature1: 'Emblema Icónico Superman de Alta Definición',
    feature2: 'Compresión Ergonómica de Manga Larga',
    feature3: 'Tejido Transpirable de Secado Rápido',
    feature4: 'Costuras Reforzadas para Alto Rendimiento',
    visible: true
  },

  // 4) 5063 - Silver Dawn Jackets (NEW - ID: 9103)
  {
    id: 9103,
    name: '5063 - Silver Dawn Jackets',
    price: 'Q.705.00',
    availability: 'Disponible',
    description: 'Chaqueta Silver Dawn de YoungLA. Una prenda refinada y moderna con ajuste atlético, bolsillos con cremallera y tejido térmico ligero para cualquier temporada.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'sudadera',
    brand: 'YoungLA',
    fabric_type: '95% Cotton, 5% Spandex',
    is_compression: false,
    images: [
      {
        alt: '5063 - Silver Dawn Jackets Black Wash',
        src: '/assets/images/marcas/youngla/hombre/5063 - Silver Dawn Jackets black.webp',
        color: 'Black Wash',
        dataAiHint: 'jacket black wash'
      }
    ],
    options: { type: 'talla', values: [] },
    colors: [
      {
        hex: '#2A2A2A',
        name: 'Black Wash',
        options: {
          type: 'talla',
          values: [{ stock: 2, value: 'M' }]
        },
        imageSrc: '/assets/images/marcas/youngla/hombre/5063 - Silver Dawn Jackets black.webp'
      }
    ],
    feature1: 'Diseño Vanguardista Colección Silver Dawn',
    feature2: 'Ajuste Atlético con Estructura Definida',
    feature3: 'Material Suave de Alta Durabilidad',
    feature4: 'Cremalleras de Seguridad y Bolsillos Ocultos',
    visible: true
  },

  // 5) 3047 - Superman Compression Tanks (NEW - ID: 9104)
  {
    id: 9104,
    name: '3047 - Superman Compression Tanks',
    price: 'Q.480.00',
    availability: 'Disponible',
    description: 'Camiseta de tirantes (Tank) de compresión Superman de YoungLA. Libertad total de movimiento para hombros y espalda con compresión en torso.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'tank',
    brand: 'YoungLA',
    fabric_type: '88% Polyester, 12% Spandex',
    is_compression: true,
    images: [
      {
        alt: '3047 - Superman Compression Tanks Blue',
        src: '/assets/images/marcas/youngla/hombre/3047 - Superman Compression Tanks blue.webp',
        color: 'Blue',
        dataAiHint: 'compression tank blue'
      },
      {
        alt: '3047 - Superman Compression Tanks Black',
        src: '/assets/images/marcas/youngla/hombre/3047 - Superman Compression Tanks black.webp',
        color: 'Black',
        dataAiHint: 'compression tank black'
      }
    ],
    options: { type: 'talla', values: [] },
    colors: [
      {
        hex: '#1D4ED8',
        name: 'Blue',
        options: {
          type: 'talla',
          values: [{ stock: 1, value: 'M' }]
        },
        imageSrc: '/assets/images/marcas/youngla/hombre/3047 - Superman Compression Tanks blue.webp'
      },
      {
        hex: '#000000',
        name: 'Black',
        options: {
          type: 'talla',
          values: [{ stock: 1, value: 'M' }]
        },
        imageSrc: '/assets/images/marcas/youngla/hombre/3047 - Superman Compression Tanks black.webp'
      }
    ],
    feature1: 'Corte Tank de Compresión para Espalda y Hombros',
    feature2: 'Logotipo Clásico Superman en Pecho',
    feature3: 'Material Ultra Elástico de Alto Rendimiento',
    feature4: 'Control de Humedad y Ventilación Superior',
    visible: true
  },

  // 6) 2141 - Soft AF No Cuff Sweats (NEW - ID: 9105)
  {
    id: 9105,
    name: '2141 - Soft AF No Cuff Sweats',
    price: 'Q.670.00',
    availability: 'Disponible',
    description: 'Pantalones de chándal Soft AF No Cuff de YoungLA. Diseñados sin puño inferior para una caída libre y relajada, fabricados con el tejido más suave y acogedor.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'pantalon',
    brand: 'YoungLA',
    fabric_type: '100% Cotton Fleece',
    is_compression: false,
    images: [
      {
        alt: '2141 - Soft AF No Cuff Sweats Black',
        src: '/assets/images/marcas/youngla/hombre/2141 - Soft AF No Cuff Sweats black.webp',
        color: 'Black',
        dataAiHint: 'sweatpants black'
      }
    ],
    options: { type: 'talla', values: [] },
    colors: [
      {
        hex: '#000000',
        name: 'Black',
        options: {
          type: 'talla',
          values: [{ stock: 1, value: 'S' }]
        },
        imageSrc: '/assets/images/marcas/youngla/hombre/2141 - Soft AF No Cuff Sweats black.webp'
      }
    ],
    feature1: 'Tejido Ultra Suave Exclusivo Soft AF',
    feature2: 'Corte Recto sin Puño (Open Bottom)',
    feature3: 'Cintura Elástica con Cordón de Ajuste Premium',
    feature4: 'Bolsillos Laterales Profundos',
    visible: true
  },

  // 7) 4266 - Demon Slayer: Kimetsu no Yaiba - Character Tees (NEW - ID: 9106)
  {
    id: 9106,
    name: '4266 - Demon Slayer: Kimetsu no Yaiba - Character Tees',
    price: 'Q.545.00',
    availability: 'Disponible',
    description: 'Playera oficial en colaboración con Demon Slayer: Kimetsu no Yaiba. Con estampado de alta definición de Swordsmen Duo en suave algodón de primera calidad.',
    gender: 'unisex',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'YoungLA',
    fabric_type: '100% Heavyweight Cotton',
    is_compression: false,
    images: [
      {
        alt: '4266 - Demon Slayer Character Tees Swordsmen Duo',
        src: '/assets/images/marcas/youngla/hombre/4266 - Demon Slayer- Kimetsu no Yaiba - Character Tees swordsmen duo.webp',
        color: 'Swordsmen Duo',
        dataAiHint: 'demon slayer anime tee'
      }
    ],
    options: { type: 'talla', values: [] },
    colors: [
      {
        hex: '#3A4B5C',
        name: 'Swordsmen Duo',
        options: {
          type: 'talla',
          values: [{ stock: 1, value: 'M' }]
        },
        imageSrc: '/assets/images/marcas/youngla/hombre/4266 - Demon Slayer- Kimetsu no Yaiba - Character Tees swordsmen duo.webp'
      }
    ],
    feature1: 'Colaboración Oficial Demon Slayer: Kimetsu no Yaiba',
    feature2: 'Arte Gráfico Exclusivo Swordsmen Duo',
    feature3: 'Algodón Heavyweight de Alta Densidad',
    feature4: 'Ajuste Regular / Relaxed Unisex',
    visible: true
  },

  // 8) 4297 - Demon Slayer: Kimetsu no Yaiba - Anime Tees (NEW - ID: 9107)
  {
    id: 9107,
    name: '4297 - Demon Slayer: Kimetsu no Yaiba - Anime Tees',
    price: 'Q.545.00',
    availability: 'Disponible',
    description: 'Playera gráfica de la colección Anime Demon Slayer: Kimetsu no Yaiba de YoungLA. Diseños emblemáticos Set Your Heart Ablaze y Hinokami Kagura en tributo a la serie.',
    gender: 'unisex',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'YoungLA',
    fabric_type: '100% Heavyweight Cotton',
    is_compression: false,
    images: [
      {
        alt: '4297 - Demon Slayer Anime Tees Set Your Heart Ablaze',
        src: '/assets/images/marcas/youngla/hombre/4297 - Demon Slayer- Kimetsu no Yaiba - Anime Tees set your heart ablaze.webp',
        color: 'Set Your Heart Ablaze',
        dataAiHint: 'demon slayer set your heart ablaze'
      },
      {
        alt: '4297 - Demon Slayer Anime Tees Hinokami Kagura',
        src: '/assets/images/marcas/youngla/hombre/4297 - Demon Slayer- Kimetsu no Yaiba - Anime Tees hinokami kagura.webp',
        color: 'Hinokami Kagura',
        dataAiHint: 'demon slayer hinokami kagura'
      }
    ],
    options: { type: 'talla', values: [] },
    colors: [
      {
        hex: '#B91C1C',
        name: 'Set Your Heart Ablaze',
        options: {
          type: 'talla',
          values: [
            { stock: 1, value: 'M' },
            { stock: 1, value: 'L' }
          ]
        },
        imageSrc: '/assets/images/marcas/youngla/hombre/4297 - Demon Slayer- Kimetsu no Yaiba - Anime Tees set your heart ablaze.webp'
      },
      {
        hex: '#C2410C',
        name: 'Hinokami Kagura',
        options: {
          type: 'talla',
          values: [
            { stock: 1, value: 'M' }
          ]
        },
        imageSrc: '/assets/images/marcas/youngla/hombre/4297 - Demon Slayer- Kimetsu no Yaiba - Anime Tees hinokami kagura.webp'
      }
    ],
    feature1: 'Gráficos Oficiales Impresos en Alta Durabilidad',
    feature2: 'Edición Especial Rengoku & Tanjiro Tribute',
    feature3: 'Algodón Suave y Transpirable',
    feature4: 'Corte Unisex Perfecto para Streetwear y Gym',
    visible: true
  },

  // 9) 4156 - Revenge Tees (EXISTING - ID: 2614)
  {
    id: 2614,
    name: '4156 - Revenge Tees',
    price: 'Q.510.00',
    availability: 'Disponible',
    description: 'Prenda de alto rendimiento con tecnología de gestión de humedad. Su diseño ergonómico y materiales premium garantizan frescura y confort total durante entrenamientos exigentes.',
    gender: 'unisex',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'YoungLA',
    fabric_type: '100% Cotton',
    is_compression: false,
    images: [
      {
        alt: 'Revenge Tees Black',
        src: '/assets/images/marcas/youngla/hombre/4156 - Revenge Tees Negro.webp',
        color: 'Black',
        dataAiHint: 'graphic tee black'
      },
      {
        alt: 'Revenge Tees White',
        src: "/assets/images/marcas/youngla/hombre/4156 - Revenge Tees Spring '25 white.webp",
        color: 'White',
        dataAiHint: 'graphic tee white'
      },
      {
        alt: 'Revenge Tees Black Red Wash',
        src: "/assets/images/marcas/youngla/hombre/4156 - Revenge Tees Spring '25 black red.webp",
        color: 'Black Red Wash',
        dataAiHint: 'graphic tee black red wash'
      },
      {
        alt: 'Revenge Tees Green',
        src: '/assets/images/marcas/youngla/hombre/4156 - Revenge Tees Verde.webp',
        color: 'Green',
        dataAiHint: 'graphic tee green'
      }
    ],
    options: { type: 'talla', values: [] },
    colors: [
      {
        hex: '#000000',
        name: 'Black',
        options: {
          type: 'talla',
          values: [
            { stock: 0, value: 'S' },
            { stock: 1, value: 'M' },
            { stock: 0, value: 'L' }
          ]
        },
        imageSrc: '/assets/images/marcas/youngla/hombre/4156 - Revenge Tees Negro.webp'
      },
      {
        hex: '#FFFFFF',
        name: 'White',
        options: {
          type: 'talla',
          values: [
            { stock: 1, value: 'M' }
          ]
        },
        imageSrc: "/assets/images/marcas/youngla/hombre/4156 - Revenge Tees Spring '25 white.webp"
      },
      {
        hex: '#3F1D1D',
        name: 'Black Red Wash',
        options: {
          type: 'talla',
          values: [
            { stock: 1, value: 'M' }
          ]
        },
        imageSrc: "/assets/images/marcas/youngla/hombre/4156 - Revenge Tees Spring '25 black red.webp"
      },
      {
        hex: '#008000',
        name: 'Green',
        options: {
          type: 'talla',
          values: [
            { stock: 0, value: 'S' },
            { stock: 0, value: 'M' },
            { stock: 0, value: 'L' }
          ]
        },
        imageSrc: '/assets/images/marcas/youngla/hombre/4156 - Revenge Tees Verde.webp'
      }
    ],
    feature1: 'Tejido Transpirable de Alto Rendimiento',
    feature2: 'Ajuste Atlético que Realza la Figura',
    feature3: 'Material Resistente a la Deformación',
    feature4: 'Tecnología de Gestión de Humedad',
    visible: true
  },

  // 10) 5056 - Comfy Collection - Crewneck (NEW - ID: 9108)
  {
    id: 9108,
    name: '5056 - Comfy Collection - Crewneck',
    price: 'Q.550.00',
    availability: 'Disponible',
    description: 'Sudadera cuello redondo Comfy Collection de YoungLA. Confección en forro polar ultra suave que proporciona calidez y confort insuperable para el día a día.',
    gender: 'unisex',
    category: 'ropa',
    subcategory: 'sudadera',
    brand: 'YoungLA',
    fabric_type: '80% Cotton, 20% Polyester',
    is_compression: false,
    images: [
      {
        alt: '5056 - Comfy Collection Crewneck Black',
        src: '/assets/images/marcas/youngla/hombre/5056 - Comfy Collection - Crewneck black.webp',
        color: 'Black',
        dataAiHint: 'crewneck black'
      }
    ],
    options: { type: 'talla', values: [] },
    colors: [
      {
        hex: '#000000',
        name: 'Black',
        options: {
          type: 'talla',
          values: [{ stock: 1, value: 'M' }]
        },
        imageSrc: '/assets/images/marcas/youngla/hombre/5056 - Comfy Collection - Crewneck black.webp'
      }
    ],
    feature1: 'Cuello Redondo Clásico con Ajuste Relajado',
    feature2: 'Forro Polar Ultra Suave de Alta Calidad',
    feature3: 'Puños y Dobladillo de Canalé Elástico',
    feature4: 'Diseño Minimalista y Versátil Unisex',
    visible: true
  }
];

async function sync() {
  console.log('🚀 Iniciando sincronización de productos a local JSON y Supabase...');

  // 1. Update src/lib/products.json
  const productsJsonPath = path.join(process.cwd(), 'src/lib/products.json');
  const localProducts = JSON.parse(fs.readFileSync(productsJsonPath, 'utf-8'));

  for (const item of productsData) {
    const existingIndex = localProducts.findIndex(p => p.id === item.id);
    if (existingIndex >= 0) {
      localProducts[existingIndex] = { ...localProducts[existingIndex], ...item };
      console.log(`Updated product in JSON: [${item.id}] ${item.name}`);
    } else {
      localProducts.push(item);
      console.log(`Added new product to JSON: [${item.id}] ${item.name}`);
    }
  }

  fs.writeFileSync(productsJsonPath, JSON.stringify(localProducts, null, 2), 'utf-8');
  console.log('✅ src/lib/products.json actualizado correctamente.');

  // 2. Sync to Supabase `products` table
  console.log('🔄 Sincronizando con Supabase tabla `products`...');
  for (const item of productsData) {
    const { error: pErr } = await supabase.from('products').upsert({
      id: item.id,
      name: item.name,
      price: item.price,
      availability: item.availability,
      description: item.description,
      gender: item.gender,
      category: item.category,
      subcategory: item.subcategory,
      brand: item.brand,
      fabric_type: item.fabric_type,
      is_compression: item.is_compression,
      images: item.images,
      options: item.options,
      colors: item.colors,
      feature1: item.feature1,
      feature2: item.feature2,
      feature3: item.feature3,
      feature4: item.feature4,
      visible: item.visible
    }, { onConflict: 'id' });

    if (pErr) {
      console.error(`❌ Error al subir producto ${item.id} a Supabase:`, pErr);
    } else {
      console.log(`✅ Producto [${item.id}] ${item.name} guardado en Supabase.`);
    }

    // 3. Sync to Supabase `product_variants` table
    console.log(`  🔄 Sincronizando variantes para producto ${item.id}...`);
    // Extract all variants from colors or options
    const variants = [];
    if (item.colors && item.colors.length > 0) {
      for (const col of item.colors) {
        if (col.options && col.options.values) {
          for (const opt of col.options.values) {
            variants.push({
              product_id: item.id,
              color_name: col.name,
              option_value: opt.value,
              stock: opt.stock
            });
          }
        }
      }
    } else if (item.options && item.options.values) {
      for (const opt of item.options.values) {
        variants.push({
          product_id: item.id,
          color_name: null,
          option_value: opt.value,
          stock: opt.stock
        });
      }
    }

    for (const v of variants) {
      // Find if variant already exists
      const query = supabase
        .from('product_variants')
        .select('id, stock')
        .eq('product_id', v.product_id)
        .eq('option_value', v.option_value);

      if (v.color_name) {
        query.eq('color_name', v.color_name);
      } else {
        query.is('color_name', null);
      }

      const { data: existingV, error: vFindErr } = await query;
      if (vFindErr) {
        console.error('Error buscando variante:', vFindErr);
        continue;
      }

      if (existingV && existingV.length > 0) {
        // Update stock
        const { error: vUpdErr } = await supabase
          .from('product_variants')
          .update({ stock: v.stock })
          .eq('id', existingV[0].id);

        if (vUpdErr) {
          console.error(`❌ Error actualizando variante ${v.color_name || 'N/A'} ${v.option_value}:`, vUpdErr);
        } else {
          console.log(`  ✓ Variante actualizada: ${v.color_name || 'N/A'} - ${v.option_value} -> stock ${v.stock}`);
        }
      } else {
        // Insert variant
        const { error: vInsErr } = await supabase
          .from('product_variants')
          .insert(v);

        if (vInsErr) {
          console.error(`❌ Error insertando variante ${v.color_name || 'N/A'} ${v.option_value}:`, vInsErr);
        } else {
          console.log(`  ✓ Nueva variante insertada: ${v.color_name || 'N/A'} - ${v.option_value} -> stock ${v.stock}`);
        }
      }
    }
  }

  console.log('🎉 Sincronización completa con éxito.');
}

sync();
