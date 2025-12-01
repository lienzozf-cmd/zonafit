
export const navLinks = [
  {
    title: 'HOMBRES',
    href: '/hombres',
    sublinks: [
      {
        title: 'Playeras',
        href: '/hombres/playeras',
        sublinks: [{ title: 'Tanks', href: '/hombres/playeras/tanks' }],
      },
      { title: 'Shorts', href: '/hombres/shorts' },
      { title: 'Pantalones', href: '/hombres/pantalones' },
      { title: 'Sudaderas', href: '/hombres/sudaderas' },
      { title: 'Chamarras', href: '/hombres/chamarras' },
      { title: 'Ver Todo', href: '/hombres' },
    ],
  },
  {
    title: 'MUJERES',
    href: '/mujeres',
    sublinks: [
      {
        title: 'Blusas',
        href: '/mujeres/blusas',
        sublinks: [
          { title: 'Tops', href: '/mujeres/tops' },
          { title: 'Bras Deportivos', href: '/mujeres/bras-deportivos' },
        ],
      },
      {
        title: 'Leggings',
        href: '/mujeres/leggings',
        sublinks: [{ title: 'Shorts', href: '/mujeres/shorts' }],
      },
      {
        title: 'Sudaderas',
        href: '/mujeres/sudaderas',
        sublinks: [{ title: 'Chamarras', href: '/mujeres/chamarras' }],
      },
      { title: 'Ver Todo', href: '/mujeres' },
    ],
  },
  {
    title: 'ACCESORIOS',
    href: '/accesorios',
    sublinks: [
      {
        title: 'Pachones y Shakers',
        href: '/accesorios/pachones-shakers',
        sublinks: [
          { title: 'Pachones', href: '/accesorios/pachones' },
          { title: 'Shakers', href: '/accesorios/shakers' },
        ],
      },
      { title: 'Equipo de Entrenamiento', href: '/accesorios/equipo' },
      { title: 'Gorras', href: '/accesorios/gorras' },
      {
        title: 'Mochilas y Maletas',
        href: '/accesorios/mochilas-maletas',
        sublinks: [
          { title: 'Mochilas', href: '/accesorios/mochilas' },
          { title: 'Maletas', href: '/accesorios/maletas' },
        ],
      },
      { title: 'Calcetines', href: '/accesorios/calcetines' },
      { title: 'Ver Todo', href: '/accesorios' },
    ],
  },
  {
    title: 'SUPLEMENTOS',
    href: '/suplementos',
    sublinks: [
      { title: 'Proteínas', href: '/suplementos/proteinas' },
      { title: 'Creatinas', href: '/suplementos/creatinas' },
      { title: 'Pre Entrenos', href: '/suplementos/pre-entrenos' },
      { title: 'Aminoácidos', href: '/suplementos/aminoacidos' },
      { title: 'L-Carnitina', href: '/suplementos/l-carnitina' },
      { title: 'Ver Todo', href: '/suplementos' },
    ],
  },
  {
    title: 'JOYERIA',
    href: '/joyeria',
    sublinks: [{ title: 'Rgmnt', href: '/joyeria/rgmnt' }],
  },
  {
    title: 'MARCAS',
    href: '/marcas',
    sublinks: [
      { title: 'YoungLA', href: '/marcas/youngla' },
      { title: 'Gymshark', href: '/marcas/gymshark' },
      { title: 'Darc Sport', href: '/marcas/darc-sport' },
      { title: 'Vanquish', href: '/marcas/vanquish' },
      { title: 'Dragon Pharma', href: '/marcas/dragon-pharma' },
      { title: 'RAW', href: '/marcas/raw' },
      { title: 'RGMNT', href: '/marcas/rgmnt' },
      { title: 'Bum Energy', href: '/marcas/bum-energy' },
      { title: 'Civil Regime', href: '/marcas/civil-regime' },
      { title: 'Ver Todo', href: '/marcas' },
    ],
  },
];

export type ProductOption = {
  value: string;
  stock: number;
};

export type ProductColor = {
  name: string;
  hex: string;
  imageSrc: string;
  options: {
    type: string;
    values: ProductOption[];
  };
};

export type Product = {
  id: number;
  name: string;
  price: string;
  availability: string;
  images: { src: string; alt: string; dataAiHint: string; option?: string; color?: string; }[];
  options: { 
    type: string; 
    values: ProductOption[];
  };
  description: string;
  gender: 'hombre' | 'mujer' | 'unisex';
  category: 'ropa' | 'suplemento' | 'accesorio' | 'joyeria';
  subcategory: string;
  brand: string;
  // Ropa
  fabric_type?: string;
  is_compression?: boolean;
  colors?: ProductColor[];
  // Suplemento
  benefits?: string;
  servings_info?: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: 'Superhero Compression Tees',
    price: 'Q.435.00',
    availability: 'Agotado',
    description:
      'Conviértete en un héroe del gimnasio con esta playera de compresión. Diseñada para un rendimiento máximo y un estilo inigualable, te ayudará a superar tus límites.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'YoungLA',
    fabric_type: '88% Polyester, 12% Spandex',
    is_compression: true,
    images: [
      {
        src: '/assets/images/marcas/youngla/hombre/superheroeroja.png',
        alt: 'Red compression shirt front',
        dataAiHint: 'red shirt',
        color: 'Roja',
      },
      {
        src: '/assets/images/marcas/youngla/hombre/superheroenegra.png',
        alt: 'Black compression shirt',
        dataAiHint: 'black shirt',
        color: 'Negra',
      },
    ],
    options: {
        type: 'talla',
        values: [],
    },
    colors: [
      {
        name: 'Roja',
        hex: '#ff0000',
        imageSrc:
          '/assets/images/marcas/youngla/hombre/superheroeroja.png',
        options: {
            type: 'talla',
            values: [
                { value: 'S', stock: 0 },
                { value: 'M', stock: 0 },
                { value: 'L', stock: 0 },
            ],
        }
      },
      {
        name: 'Negra',
        hex: '#000000',
        imageSrc:
          '/assets/images/marcas/youngla/hombre/superheroenegra.png',
        options: {
            type: 'talla',
            values: [
                { value: 'S', stock: 0 },
                { value: 'M', stock: 0 },
                { value: 'L', stock: 0 },
            ],
        }
      },
    ],
  },
  {
    id: 2,
    name: 'Warrior Compression Tees',
    price: 'Q.450.00',
    availability: 'Disponible',
    description:
      'Desata al guerrero que llevas dentro. Esta playera de compresión ofrece un soporte muscular superior y una transpirabilidad excepcional para los entrenamientos más intensos.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'YoungLA',
    fabric_type: '90% Nylon, 10% Elastane',
    is_compression: true,
    images: [
      {
        src: '/assets/images/marcas/youngla/hombre/warriorazul.png',
        alt: 'Blue compression shirt',
        dataAiHint: 'blue shirt',
        color: 'Azul',
      },
      {
        src: '/assets/images/marcas/youngla/hombre/warriornegra.png',
        alt: 'Black compression shirt',
        dataAiHint: 'black shirt',
        color: 'Negra',
      },
      {
        src: '/assets/images/marcas/youngla/hombre/warriorgris.png',
        alt: 'Gray compression shirt',
        dataAiHint: 'gray shirt',
        color: 'Gris',
      },
    ],
    options: {
        type: 'talla',
        values: [],
    },
    colors: [
      {
        name: 'Azul',
        hex: '#0000ff',
        imageSrc: '/assets/images/marcas/youngla/hombre/warriorazul.png',
        options: {
            type: 'talla',
            values: [
                { value: 'S', stock: 0 },
                { value: 'M', stock: 0 },
                { value: 'L', stock: 0 },
            ],
        }
      },
      {
        name: 'Negra',
        hex: '#000000',
        imageSrc: '/assets/images/marcas/youngla/hombre/warriornegra.png',
        options: {
            type: 'talla',
            values: [
                { value: 'S', stock: 0 },
                { value: 'M', stock: 1 },
                { value: 'L', stock: 0 },
            ],
        }
      },
      {
        name: 'Gris',
        hex: '#808080',
        imageSrc: '/assets/images/marcas/youngla/hombre/warriorgris.png',
        options: {
            type: 'talla',
            values: [
                { value: 'S', stock: 0 },
                { value: 'M', stock: 2 },
                { value: 'L', stock: 0 },
            ],
        }
      },
    ],
  },
  {
    id: 3,
    name: 'ONYX 5.0 SEAMLESS-T SHIRT',
    price: 'Q.675.00',
    availability: 'Agotado',
    description:
      'Experimenta la tecnología sin costuras con la Onyx 5.0. Diseñada para un máximo confort y un rendimiento sin restricciones, esta camiseta es perfecta para cualquier tipo de entrenamiento.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'Gymshark',
    fabric_type: '64% Nylon, 28% Polyester, 8% Elastane',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/gymshark/hombre/onyxnegra.jpg',
        alt: 'Onyx Seamless T-Shirt',
        dataAiHint: 'black shirt',
        color: 'Black/Onyx Grey'
      },
      {
        src: '/assets/images/marcas/gymshark/hombre/onyxgris.png',
        alt: 'Onyx Seamless T-Shirt light grey',
        dataAiHint: 'light grey shirt',
        color: 'Light Grey'
      },
      {
        src: '/assets/images/marcas/gymshark/hombre/onyxroja.jpg',
        alt: 'Onyx Seamless T-Shirt carmin red',
        dataAiHint: 'red shirt',
        color: 'Carmin Red'
      },
    ],
    options: {
        type: 'talla',
        values: [],
    },
    colors: [
      {
        name: 'Black/Onyx Grey',
        hex: '#343434',
        imageSrc: '/assets/images/marcas/gymshark/hombre/onyxnegra.jpg',
        options: {
          type: 'talla',
          values: [
            { value: 'S', stock: 0 },
            { value: 'M', stock: 0 },
            { value: 'L', stock: 0 },
          ],
        }
      },
      {
        name: 'Light Grey',
        hex: '#D3D3D3',
        imageSrc: '/assets/images/marcas/gymshark/hombre/onyxgris.png',
        options: {
          type: 'talla',
          values: [
            { value: 'S', stock: 0 },
            { value: 'M', stock: 0 },
            { value: 'L', stock: 0 },
          ],
        }
      },
      {
        name: 'Carmin Red',
        hex: '#960018',
        imageSrc: '/assets/images/marcas/gymshark/hombre/onyxroja.jpg',
        options: {
          type: 'talla',
          values: [
            { value: 'S', stock: 0 },
            { value: 'M', stock: 0 },
            { value: 'L', stock: 0 },
          ],
        }
      },
    ],
  },
  {
    id: 4,
    name: 'Power T-Shirt Black and Red',
    price: 'Q.450.00',
    availability: 'Agotado',
    description:
      'Potencia y estilo se unen en esta T-Shirt. Con un ajuste atlético y un diseño audaz en negro y rojo, es la prenda perfecta tanto para dentro como para fuera del gimnasio.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'Gymshark',
    fabric_type: '95% Algodón, 5% Elastano',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/gymshark/hombre/GYMSPOWERNR.png',
        alt: 'Black and red t-shirt',
        dataAiHint: 'black red shirt',
        option: 'S',
      },
    ],
    options: {
        type: 'talla',
        values: [],
    },
    colors: [
      {
        name: 'Black/Red',
        hex: '#000000',
        imageSrc: '/assets/images/marcas/gymshark/hombre/GYMSPOWERNR.png',
        options: {
          type: 'talla',
          values: [
            { value: 'S', stock: 0 },
            { value: 'M', stock: 0 },
            { value: 'L', stock: 0 },
          ],
        }
      },
    ],
  },
  {
    id: 5,
    name: 'Vital Seamless Crop Top Green',
    price: 'Q.450.00',
    availability: 'Agotado',
    description:
      'El crop top que lo tiene todo: tecnología sin costuras para una comodidad máxima, tejido que absorbe el sudor y un diseño que realza tu figura.',
    gender: 'mujer',
    category: 'ropa',
    subcategory: 'top',
    brand: 'Gymshark',
    fabric_type: '96% Nylon, 4% Elastane',
    is_compression: true,
    images: [
      {
        src: '/assets/images/marcas/gymshark/mujer/anabelgyms.jpg',
        alt: 'Green crop top',
        dataAiHint: 'green crop top',
        option: 'S',
      },
    ],
    options: {
        type: 'talla',
        values: [],
    },
    colors: [
      {
        name: 'Green',
        hex: '#008000',
        imageSrc: '/assets/images/marcas/gymshark/mujer/anabelgyms.jpg',
        options: {
          type: 'talla',
          values: [
            { value: 'S', stock: 0 },
            { value: 'M', stock: 0 },
            { value: 'L', stock: 0 },
          ],
        }
      },
    ],
  },
  {
    id: 6,
    name: 'Trident Pendant - Gold 14K SS "22.5"',
    price: 'Q.475.00',
    availability: 'Disponible',
    description:
      'Eleva tu estilo con este colgante exclusivo de RGMNT. Hecho con materiales de primera calidad para un look audaz y duradero.',
    gender: 'unisex',
    category: 'joyeria',
    subcategory: 'rgmnt',
    brand: 'RGMNT',
    images: [
      {
        src: '/assets/images/marcas/rgmnt/tridente.png',
        alt: 'Jewelry',
        dataAiHint: 'men jewelry',
        option: 'Gold',
      },
    ],
    options: { type: 'material', values: [{ value: 'Gold', stock: 2 }] },
  },
  {
    id: 7,
    name: 'Proteina ISO Dragon Pharma',
    price: 'Q.515.00',
    availability: 'Agotado',
    description:
      'Isolat de proteína de suero de leche de la más alta pureza para una recuperación muscular óptima. Baja en carbohidratos y grasas, perfecta para definir.',
    gender: 'unisex',
    category: 'suplemento',
    subcategory: 'proteina',
    brand: 'Dragon Pharma',
    benefits: 'Recuperación muscular rápida, bajo en carbohidratos y grasas.',
    servings_info: 'Aproximadamente 30 servicios por envase.',
    images: [
      {
        src: '/assets/images/marcas/dragonpharma/isoproteinblb.png',
        alt: 'Blueberry protein powder',
        dataAiHint: 'protein powder',
        option: 'Blueberry',
      },
      {
        src: '/assets/images/marcas/dragonpharma/proteinachb.png',
        alt: 'White chocolate protein powder',
        dataAiHint: 'protein powder',
        option: 'ChocolateBlanco',
      },
    ],
    options: {
      type: 'sabor',
      values: [
        { value: 'Blueberry', stock: 0 },
        { value: 'ChocolateBlanco', stock: 0 },
      ],
    },
  },
  {
    id: 8,
    name: 'Creatina Monohidratada Dragon Pharma 60 serv',
    price: 'Q.345.00',
    availability: 'Agotado',
    description: 'Aumenta tu fuerza, potencia y rendimiento con creatina monohidratada micronizada de alta calidad. Un suplemento esencial para cualquier atleta serio.',
    gender: 'unisex',
    category: 'suplemento',
    subcategory: 'creatina',
    brand: 'Dragon Pharma',
    benefits: 'Aumento de fuerza, mejora del rendimiento, mayor volumen muscular.',
    servings_info: '60 servicios.',
    images: [
      {
        src: '/assets/images/marcas/dragonpharma/creatinaDP.png',
        alt: 'Creatine container 60 servings',
        dataAiHint: 'creatine powder',
      },
    ],
    options: { type: 'servicios', values: [{ value: 'Único', stock: 0 }] },
  },
  {
    id: 9,
    name: 'Creatina Monohidratada Dragon Pharma 200 serv',
    price: 'Q.595.00',
    availability: 'Agotado',
    description: 'Aumenta tu fuerza, potencia y rendimiento con creatina monohidratada micronizada de alta calidad. Un suplemento esencial para cualquier atleta serio en formato grande.',
    gender: 'unisex',
    category: 'suplemento',
    subcategory: 'creatina',
    brand: 'Dragon Pharma',
    benefits: 'Aumento de fuerza, mejora del rendimiento, mayor volumen muscular.',
    servings_info: '200 servicios.',
    images: [
      {
        src: '/assets/images/marcas/dragonpharma/creatinaDP.png',
        alt: 'Creatine container 200 servings',
        dataAiHint: 'creatine powder',
      },
    ],
    options: { type: 'servicios', values: [{ value: 'Único', stock: 0 }] },
  },
  {
    id: 1800,
    name: 'Proteína whey Dragon Pharma',
    price: 'Q.500.00',
    availability: 'Agotado',
    description:
      'Proteína de suero de leche de alta calidad, perfecta para la recuperación post-entrenamiento.',
    gender: 'unisex',
    category: 'suplemento',
    subcategory: 'proteina',
    brand: 'Dragon Pharma',
    benefits: 'Apoya el crecimiento muscular, rápida absorción.',
    servings_info: '30 servicios por envase.',
    images: [
      {
        src: '/assets/images/marcas/dragonpharma/proteinaPDP.png',
        alt: 'Protein',
        dataAiHint: 'protein supplement',
        option: 'Pastel de cumpleaños',
      },
    ],
    options: {
      type: 'sabor',
      values: [{ value: 'Pastel de cumpleaños', stock: 0 }],
    },
  },
  {
    id: 2301,
    name: 'Minimal Rope Chain - Gold 14K SS "22"',
    price: 'Q.295.00',
    availability: 'Disponible',
    description:
      'Cadena de cuerda minimalista en oro de 14K. Un toque de elegancia para cualquier ocasión.',
    gender: 'unisex',
    category: 'joyeria',
    subcategory: 'rgmnt',
    brand: 'RGMNT',
    images: [
      {
        src: '/assets/images/marcas/rgmnt/Minimal Rope Chain gold.png',
        alt: 'Gold Rope Chain',
        dataAiHint: 'gold chain',
      },
    ],
    options: { type: 'material', values: [{ value: 'Gold', stock: 2 }] },
  },
  {
    id: 2302,
    name: 'Minimal Rope Bracelet Gold -14K Gold SS "8"',
    price: 'Q.255.00',
    availability: 'Disponible',
    description:
      'Pulsera de cuerda minimalista en oro de 14K. Estilo y sofisticación en tu muñeca.',
    gender: 'unisex',
    category: 'joyeria',
    subcategory: 'rgmnt',
    brand: 'RGMNT',
    images: [
      {
        src: '/assets/images/marcas/rgmnt/Minimal Rope Bracelet gold.png',
        alt: 'Gold Rope Bracelet',
        dataAiHint: 'gold bracelet',
      },
    ],
    options: { type: 'material', values: [{ value: 'Gold', stock: 1 }] },
  },
  {
    id: 2303,
    name: 'Minimal Rope Chain - SS Silver "20"',
    price: 'Q.285.00',
    availability: 'Disponible',
    description:
      'Cadena de cuerda minimalista en plata de ley. Un accesorio versátil y moderno.',
    gender: 'unisex',
    category: 'joyeria',
    subcategory: 'rgmnt',
    brand: 'RGMNT',
    images: [
      {
        src: '/assets/images/marcas/rgmnt/Minimal Rope Chain silver.png',
        alt: 'Silver Rope Chain',
        dataAiHint: 'silver chain',
      },
    ],
    options: { type: 'material', values: [{ value: 'Silver', stock: 2 }] },
  },
  {
    id: 2304,
    name: 'Minimal Rope Bracelet - SS Silver "8"',
    price: 'Q.235.00',
    availability: 'Disponible',
    description:
      'Pulsera de cuerda minimalista en plata de ley. El complemento perfecto para tu look diario.',
    gender: 'unisex',
    category: 'joyeria',
    subcategory: 'rgmnt',
    brand: 'RGMNT',
    images: [
      {
        src: '/assets/images/marcas/rgmnt/Minimal Rope Bracelet silver.png',
        alt: 'Silver Rope Bracelet',
        dataAiHint: 'silver bracelet',
      },
    ],
    options: { type: 'material', values: [{ value: 'Silver', stock: 2 }] },
  },
  {
    id: 2519,
    name: 'Legacy Logo Tight Shorts',
    price: 'Q.240.00',
    availability: 'Disponible',
    description: 'Shorts ajustados con el logo Legacy para un look clásico y atlético.',
    gender: 'mujer',
    category: 'ropa',
    subcategory: 'short',
    brand: 'Gymshark',
    fabric_type: '87% Nylon, 13% Spandex',
    is_compression: true,
    images: [
      {
        src: '/assets/images/marcas/gymshark/mujer/Legacy Logo Tight Shorts NEGRO.png',
        alt: 'Legacy Logo Tight Shorts',
        dataAiHint: 'woman shorts',
        option: 'Negro',
      },
    ],
    options: { type: 'talla', values: [{ value: 'M', stock: 1 }] },
  },
  {
    id: 2520,
    name: 'Legacy Bra',
    price: 'Q.245.00',
    availability: 'Disponible',
    description: 'Bra deportivo Legacy para un soporte y estilo inigualables.',
    gender: 'mujer',
    category: 'ropa',
    subcategory: 'bras-deportivo',
    brand: 'Gymshark',
    fabric_type: '87% Nylon, 13% Spandex',
    is_compression: true,
    images: [
      {
        src: '/assets/images/marcas/gymshark/mujer/legacy bra negro.png',
        alt: 'Legacy Bra',
        dataAiHint: 'sports bra',
        option: 'Negro',
      },
    ],
    options: { type: 'talla', values: [{ value: 'M', stock: 1 }] },
  },
  {
    id: 2523,
    name: 'Flex Shorts',
    price: 'Q.345.00',
    availability: 'Disponible',
    description: 'Shorts Flex para máxima flexibilidad y comodidad.',
    gender: 'mujer',
    category: 'ropa',
    subcategory: 'short',
    brand: 'Gymshark',
    fabric_type: '87% Nylon, 13% Spandex',
    is_compression: true,
    images: [
      {
        src: '/assets/images/marcas/gymshark/mujer/Flex Shorts gris.png',
        alt: 'Flex Shorts',
        dataAiHint: 'woman shorts',
      },
    ],
    options: { type: 'talla', values: [{ value: 'M', stock: 1 }] },
  },
  {
    id: 2524,
    name: 'Crop Top Flex',
    price: 'Q.336.00',
    availability: 'Disponible',
    description: 'Crop top de la línea Flex para un ajuste perfecto y cómodo.',
    gender: 'mujer',
    category: 'ropa',
    subcategory: 'top',
    brand: 'Gymshark',
    fabric_type: '87% Nylon, 13% Spandex',
    is_compression: true,
    images: [
      {
        src: '/assets/images/marcas/gymshark/mujer/Crop Top Flex negro.png',
        alt: 'Crop Top Flex',
        dataAiHint: 'woman top',
        option: 'Negro',
      },
    ],
    options: { type: 'talla', values: [{ value: 'S', stock: 1 }] },
  },
  {
    id: 2525,
    name: 'Power Oversized Long Sleeve Top',
    price: 'Q.280.00',
    availability: 'Disponible',
    description: 'Top de manga larga oversized para un look potente y relajado.',
    gender: 'mujer',
    category: 'ropa',
    subcategory: 'top',
    brand: 'Gymshark',
    fabric_type: '100% Cotton',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/gymshark/mujer/Power Oversized Long Sleeve Top negro.png',
        alt: 'Power Oversized Long Sleeve Top',
        dataAiHint: 'woman top',
        option: 'Negro',
      },
    ],
    options: { type: 'talla', values: [{ value: 'S', stock: 1 }] },
  },
  {
    id: 2527,
    name: 'Strength Graphic Joggers',
    price: 'Q.345.00',
    availability: 'Disponible',
    description: 'Joggers con gráfico del departamento de fuerza para un look completo.',
    gender: 'mujer',
    category: 'ropa',
    subcategory: 'pantalon',
    brand: 'Gymshark',
    fabric_type: '100% Cotton',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/gymshark/mujer/Strength  Graphic Joggers.png',
        alt: 'Strength Department Graphic Joggers',
        dataAiHint: 'woman joggers',
        option: 'Negro',
      },
    ],
    options: { type: 'talla', values: [{ value: 'S', stock: 1 }] },
  },
  {
    id: 2535,
    name: 'Adapt Fleck Sports Bra',
    price: 'Q.446.00',
    availability: 'Disponible',
    description:
      'Bra deportivo de la línea Adapt Fleck para un ajuste y soporte perfectos.',
    gender: 'mujer',
    category: 'ropa',
    subcategory: 'bras-deportivo',
    brand: 'Gymshark',
    fabric_type: '79% Nylon, 15% Polyester, 6% Elastane',
    is_compression: true,
    images: [
      {
        src: '/assets/images/marcas/gymshark/mujer/Adapt Fleck Sports Bra morado.png',
        alt: 'Adapt Fleck Sports Bra',
        dataAiHint: 'sports bra',
        option: 'Morado',
      },
    ],
    options: { type: 'talla', values: [{ value: 'S', stock: 1 }] },
  },
  {
    id: 2536,
    name: 'Adapt Fleck Seamless Shorts',
    price: 'Q.400.00',
    availability: 'Disponible',
    description: 'Shorts sin costuras de la línea Adapt Fleck para un confort inigualable.',
    gender: 'mujer',
    category: 'ropa',
    subcategory: 'short',
    brand: 'Gymshark',
    fabric_type: '79% Nylon, 15% Polyester, 6% Elastane',
    is_compression: true,
    images: [
      {
        src: '/assets/images/marcas/gymshark/mujer/Adapt Fleck Seamless Shorts morado.png',
        alt: 'Adapt Fleck Seamless Shorts',
        dataAiHint: 'woman shorts',
        option: 'Morado',
      },
    ],
    options: { type: 'talla', values: [{ value: 'S', stock: 1 }] },
  },
  {
    id: 2539,
    name: 'Mesh Sports Bra',
    price: 'Q.266.00',
    availability: 'Disponible',
    description: 'Bra deportivo con detalles de malla para mayor transpirabilidad.',
    gender: 'mujer',
    category: 'ropa',
    subcategory: 'bras-deportivo',
    brand: 'Gymshark',
    fabric_type: '88% Polyester, 12% Elastane',
    is_compression: true,
    images: [
      {
        src: '/assets/images/marcas/gymshark/mujer/Mesh Sports Bra negro.png',
        alt: 'Mesh Sports Bra',
        dataAiHint: 'sports bra',
        option: 'Negro',
      },
    ],
    options: { type: 'talla', values: [{ value: 'S', stock: 2 }] },
  },
  {
    id: 2541,
    name: 'Ruched Sports Bra',
    price: 'Q.291.00',
    availability: 'Disponible',
    description: 'Bra deportivo con diseño fruncido para un estilo único.',
    gender: 'mujer',
    category: 'ropa',
    subcategory: 'bras-deportivo',
    brand: 'Gymshark',
    fabric_type: '87% Nylon, 13% Spandex',
    is_compression: true,
    images: [
      {
        src: '/assets/images/marcas/gymshark/mujer/Ruched Sports Bra negro.png',
        alt: 'Ruched Sports Bra',
        dataAiHint: 'sports bra',
        option: 'Negro',
      },
    ],
    options: { type: 'talla', values: [{ value: 'S', stock: 1 }] },
  },
  {
    id: 2542,
    name: 'Strap Feature Sports Bra',
    price: 'Q.285.00',
    availability: 'Disponible',
    description: 'Bra deportivo con tirantes decorativos para un look moderno.',
    gender: 'mujer',
    category: 'ropa',
    subcategory: 'bras-deportivo',
    brand: 'Gymshark',
    fabric_type: '87% Nylon, 13% Spandex',
    is_compression: true,
    images: [
      {
        src: '/assets/images/marcas/gymshark/mujer/Strap Feature Sports Bra negro.png',
        alt: 'Strap Feature Sports Bra',
        dataAiHint: 'sports bra',
        option: 'negro',
      },
    ],
    options: { type: 'talla', values: [{ value: 'M', stock: 1 }] },
  },
  {
    id: 2543,
    name: 'Flex Shorts',
    price: 'Q.270.00',
    availability: 'Disponible',
    description: 'Shorts Flex para máxima flexibilidad y comodidad.',
    gender: 'mujer',
    category: 'ropa',
    subcategory: 'short',
    brand: 'Gymshark',
    fabric_type: '87% Nylon, 13% Spandex',
    is_compression: true,
    images: [
      {
        src: '/assets/images/marcas/gymshark/mujer/Flex Shorts negro.png',
        alt: 'Flex Shorts',
        dataAiHint: 'woman shorts',
        option: 'Negro',
      },
    ],
    options: { type: 'talla', values: [{ value: 'S', stock: 1 }] },
  },
  {
    id: 2544,
    name: 'Elevate Cycling Shorts',
    price: 'Q.296.00',
    availability: 'Disponible',
    description: 'Shorts de ciclismo de la línea Elevate para un rendimiento superior.',
    gender: 'mujer',
    category: 'ropa',
    subcategory: 'short',
    brand: 'Gymshark',
    fabric_type: '78% Polyester, 22% Elastane',
    is_compression: true,
    images: [
      {
        src: '/assets/images/marcas/gymshark/mujer/Elevate Cycling Shorts negro.png',
        alt: 'Elevate Cycling Shorts',
        dataAiHint: 'woman shorts',
        option: 'Negro',
      },
    ],
    options: { type: 'talla', values: [{ value: 'S', stock: 1 }] },
  },
  {
    id: 2602,
    name: 'Premium Tee SAMURAI bushido',
    price: 'Q.595.00',
    availability: 'Disponible',
    description: 'Playera premium de Darc Sport con diseño de Samurai Bushido.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'Darc Sport',
    fabric_type: '100% Algodón',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/darcsport/Premium Tee  samurai bushido.png',
        alt: 'Premium Tee SAMURAI bushido',
        dataAiHint: 'men shirt',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 1 },
      ],
    },
  },
  {
    id: 2603,
    name: 'Premium Oversized Gogeta',
    price: 'Q.595.00',
    availability: 'Disponible',
    description: 'Playera premium de Darc Sport con diseño clásico de Dragon Ball.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'Darc Sport',
    fabric_type: '100% Algodón',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/darcsport/Premium Tee dragon ball gogeta.jpeg',
        alt: 'Premium Tee dragon ball classic',
        dataAiHint: 'men shirt',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 1 },
      ],
    },
  },
  {
    id: 2604,
    name: 'Through Fire And Storm "Premium" Oversized Tee in Wolf Gray',
    price: 'Q.435.00',
    availability: 'Disponible',
    description: 'Playera básica de Darc Sport, ideal para cualquier entrenamiento.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'Darc Sport',
    fabric_type: '100% Algodón',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/darcsport/Through Fire And Storm Premium Oversized Tee in Wolf Gray .png',
        alt: 'Darc Sport T-shirt',
        dataAiHint: 'men shirt',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 1 },
      ],
    },
  },
  {
    id: 2605,
    name: 'Vanquish Unconquerable Shorts',
    price: 'Q.345.00',
    availability: 'Disponible',
    description: 'Shorts de alto rendimiento para entrenamientos intensos.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'short',
    brand: 'Vanquish',
    fabric_type: '90% Polyester, 10% Spandex',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/vanquish/Vanquishunconquerableshortsnegro.png',
        alt: 'Vanquish Unconquerable Shorts',
        dataAiHint: 'men shorts',
        option: 'M',
      },
    ],
    options: { type: 'talla', values: [{ value: 'M', stock: 1 }] },
  },
  {
    id: 2608,
    name: '4071 - Gods & Heroes Tees',
    price: 'Q.435.00',
    availability: 'Disponible',
    description: 'Playera de la colección Dioses y Héroes.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'YoungLA',
    fabric_type: '100% Cotton',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/youngla/hombre/403 Elite Tees AZUL.png',
        alt: 'Gods & Heroes Tees',
        dataAiHint: 'graphic tee',
        option: 'M',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 0 },
        { value: 'M', stock: 1 },
        { value: 'L', stock: 0 },
      ],
    },
  },
  {
    id: 2609,
    name: 'Hella Pocket Sweats',
    price: 'Q.600.00',
    availability: 'Agotado',
    description:
      'Pantalones de chándal con múltiples bolsillos, funcionales y con estilo.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'pantalon',
    brand: 'YoungLA',
    fabric_type: '100% Cotton',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/youngla/hombre/2005 - Hella Pocket Sweats morado.png',
        alt: 'Hella Pocket Sweats',
        dataAiHint: 'men pants',
        option: 'S',
      },
    ],
    options: { type: 'talla', values: [{ value: 'S', stock: 0 }] },
  },
  {
    id: 2610,
    name: 'The Boys Graphic Tees',
    price: 'Q.450.00',
    availability: 'Disponible',
    description: 'Playera con gráfico de la serie "The Boys".',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'YoungLA',
    fabric_type: '100% Cotton',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/youngla/hombre/4095 - The Boys® Graphic Tees.png',
        alt: 'The Boys Graphic Tees',
        dataAiHint: 'graphic tee',
        option: 'M',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 1 },
        { value: 'M', stock: 0 },
        { value: 'L', stock: 0 },
      ],
    },
  },
  {
    id: 2611,
    name: 'The Boys® Cut-Offs',
    price: 'Q.450.00',
    availability: 'Agotado',
    description: 'Playera sin mangas con gráfico oficial de la serie "The Boys®".',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'YoungLA',
    fabric_type: '100% Cotton',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/youngla/hombre/3005 - The Boys® Cut-Offs.png',
        alt: 'The Boys® Graphic Tees',
        dataAiHint: 'graphic tee',
        option: 'S',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 0 },
        { value: 'M', stock: 0 },
        { value: 'L', stock: 0 },
      ],
    },
  },
  {
    id: 2612,
    name: 'UFC™ Cut-Off hoodies',
    price: 'Q.495.00',
    availability: 'Disponible',
    description: 'Sudadera sin mangas con licencia oficial de UFC™.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'sudadera',
    brand: 'YoungLA',
    fabric_type: '80% Cotton, 20% Polyester',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/youngla/hombre/5003 - UFC™ Cut-Off hoodies ROJO.png',
        alt: 'UFC™ Cut-Off hoodies',
        dataAiHint: 'ufc hoodie',
        option: 'M',
      },
    ],
    options: { type: 'talla', values: [{ value: 'M', stock: 1 }] },
  },
  {
    id: 2613,
    name: 'UFC™ Jersey',
    price: 'Q.445.00',
    availability: 'Disponible',
    description: 'Jersey con licencia oficial de UFC™.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'YoungLA',
    fabric_type: '100% Polyester',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/youngla/hombre/4207 - UFC™ Jersey GRIS.png',
        alt: 'UFC™ Jersey',
        dataAiHint: 'ufc jersey',
        option: 'S',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 1 },
        { value: 'M', stock: 0 },
        { value: 'L', stock: 0 },
      ],
    },
  },
  {
    id: 2614,
    name: 'Revenge Tees',
    price: 'Q.395.00',
    availability: 'Disponible',
    description: 'Playera de la colección "Revenge".',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'YoungLA',
    fabric_type: '100% Cotton',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/youngla/hombre/4156 - Revenge Tees Negro.png',
        alt: 'Revenge Tees Black',
        dataAiHint: 'graphic tee black',
        option: 'S',
      },
      {
        src: '/assets/images/marcas/youngla/hombre/4156 - Revenge Tees Verde.png',
        alt: 'Revenge Tees Green',
        dataAiHint: 'graphic tee green',
        option: 'S',
      },
    ],
    options: {
        type: 'talla',
        values: [],
    },
    colors: [
      {
        name: 'Black',
        hex: '#000000',
        imageSrc: '/assets/images/marcas/youngla/hombre/4156 - Revenge Tees Negro.png',
        options: {
            type: 'talla',
            values: [
                { value: 'S', stock: 0 },
                { value: 'M', stock: 1 },
                { value: 'L', stock: 0 },
            ],
        }
      },
      {
        name: 'Green',
        hex: '#008000',
        imageSrc: '/assets/images/marcas/youngla/hombre/4156 - Revenge Tees Verde.png',
        options: {
            type: 'talla',
            values: [
                { value: 'S', stock: 1 },
                { value: 'M', stock: 0 },
                { value: 'L', stock: 0 },
            ],
        }
      },
    ],
  },
  {
    id: 2615,
    name: 'GRAND SLAM BASEBALL JERSEYS',
    price: 'Q.495.00',
    availability: 'Disponible',
    description: 'Jersey de béisbol de la colección "Grand Slam".',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'YoungLA',
    fabric_type: '100% Polyester',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/youngla/hombre/3002 GRAND SLAM BASEBALL JERSEYS NEGRO.png',
        alt: 'GRAND SLAM BASEBALL JERSEYS',
        dataAiHint: 'baseball jersey',
        option: 'M',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 0 },
        { value: 'M', stock: 1 },
        { value: 'L', stock: 0 },
      ],
    },
  },
  {
    id: 2616,
    name: 'Effortless Sets',
    price: 'Q.370.00',
    availability: 'Disponible',
    description: 'Conjunto "Effortless" para un look cómodo y coordinado.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'sudadera',
    brand: 'YoungLA',
    fabric_type: '95% Cotton, 5% Elastane',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/youngla/hombre/5092 - Effortless Sets NEGRO.png',
        alt: 'Effortless Sets',
        dataAiHint: 'men set',
        option: 'M',
      },
    ],
    options: { type: 'talla', values: [{ value: 'M', stock: 1 }] },
  },
  {
    id: 2617,
    name: 'Digital Compression Tees',
    price: 'Q.325.00',
    availability: 'Disponible',
    description: 'Playera de compresión con un diseño digital moderno.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'YoungLA',
    fabric_type: '88% Polyester, 12% Spandex',
    is_compression: true,
    images: [
      {
        src: '/assets/images/marcas/youngla/hombre/437 Digital Compression Tees Roja.png',
        alt: 'Digital Compression Tees',
        dataAiHint: 'compression shirt',
        option: 'S',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 1 },
        { value: 'M', stock: 0 },
        { value: 'L', stock: 0 },
      ],
    },
  },
  {
    id: 2618,
    name: 'Combat Compression',
    price: 'Q.315.00',
    availability: 'Disponible',
    description:
      'Ropa de compresión para combate, diseñada para el máximo rendimiento.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'YoungLA',
    fabric_type: '88% Polyester, 12% Spandex',
    is_compression: true,
    images: [
      {
        src: '/assets/images/marcas/youngla/hombre/478 - Combat Compression Tees AZUL.png',
        alt: 'Combat Compression Blue',
        dataAiHint: 'compression wear blue',
        option: 'S',
      },
      {
        src: '/assets/images/marcas/youngla/hombre/478 - Combat Compression Tees NEGRA.png',
        alt: 'Combat Compression Black',
        dataAiHint: 'compression wear black',
        option: 'S',
      },
    ],
    options: {
        type: 'talla',
        values: [],
    },
    colors: [
      {
        name: 'Azul',
        hex: '#0000FF',
        imageSrc:
          '/assets/images/marcas/youngla/hombre/478 - Combat Compression Tees AZUL.png',
        options: {
            type: 'talla',
            values: [
                { value: 'S', stock: 0 },
                { value: 'M', stock: 2 },
                { value: 'L', stock: 0 },
            ],
        }
      },
      {
        name: 'Negro',
        hex: '#000000',
        imageSrc:
          '/assets/images/marcas/youngla/hombre/478 - Combat Compression Tees NEGRA.png',
        options: {
            type: 'talla',
            values: [
                { value: 'S', stock: 2 },
                { value: 'M', stock: 0 },
                { value: 'L', stock: 0 },
            ],
        }
      },
    ],
  },
  {
    id: 2619,
    name: 'Iron Compression',
    price: 'Q.375.00',
    availability: 'Disponible',
    description: 'Compresión de hierro para un soporte inquebrantable.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'YoungLA',
    fabric_type: '90% Polyester, 10% Spandex',
    is_compression: true,
    images: [
      {
        src: '/assets/images/marcas/youngla/hombre/425 - IRON COMPRESSION TEES VERDE.png',
        alt: 'Iron Compression',
        dataAiHint: 'compression shirt',
        option: 'S',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 1 },
        { value: 'M', stock: 0 },
        { value: 'L', stock: 0 },
      ],
    },
  },
  {
    id: 2620,
    name: 'YoungLA Keychains',
    price: 'Q.130.00',
    availability: 'Disponible',
    description: 'Llavero oficial de YoungLA para llevar contigo.',
    gender: 'unisex',
    category: 'accesorio',
    subcategory: 'equipo',
    brand: 'YoungLA',
    images: [
      {
        src: '/assets/images/Accesorios/933 YoungLA Keychains negro.png',
        alt: 'YoungLA Keychains',
        dataAiHint: 'keychain',
      },
    ],
    options: { type: 'color', values: [{ value: 'Único', stock: 2 }] },
  },
  {
    id: 2626,
    name: 'Crew Socks 3pk (Blancos)',
    price: 'Q.236.00',
    availability: 'Disponible',
    description: 'Paquete de 3 calcetines blancos, un básico indispensable.',
    gender: 'unisex',
    category: 'accesorio',
    subcategory: 'calcetin',
    brand: 'Gymshark',
    images: [
      {
        src: '/assets/images/Accesorios/Crew Socks 3pk blancos talla s.png',
        alt: 'Crew Socks 3pk',
        dataAiHint: 'fitness socks',
        option: 'S',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 1 },
        { value: 'M', stock: 1 },
      ],
    },
  },
  {
    id: 2627,
    name: 'Crew Socks 3pk (Mixto)',
    price: 'Q.235.00',
    availability: 'Disponible',
    description: 'Paquete de 3 calcetines en colores mixtos (blanco, gris, negro).',
    gender: 'unisex',
    category: 'accesorio',
    subcategory: 'calcetin',
    brand: 'Gymshark',
    images: [
      {
        src: '/assets/images/Accesorios/Crew Socks 3pk negro, blanco, gris.png',
        alt: 'Crew Socks 3pk',
        dataAiHint: 'fitness socks',
      },
    ],
    options: { type: 'talla', values: [{ value: 'S', stock: 2 }] },
  },
  {
    id: 2628,
    name: 'Ease Woven Joggers',
    price: 'Q.375.00',
    availability: 'Disponible',
    description: 'Joggers tejidos para una comodidad excepcional.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'pantalon',
    brand: 'Gymshark',
    fabric_type: '100% Poliéster',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/gymshark/hombre/Ease Woven Joggers gris.png',
        alt: 'Ease Woven Joggers',
        dataAiHint: 'men joggers',
        option: 'S',
      },
    ],
    options: { type: 'talla', values: [{ value: 'S', stock: 1 }] },
  },
  {
    id: 2629,
    name: 'Element Long Sleeve T-Shirt',
    price: 'Q.340.00',
    availability: 'Disponible',
    description: 'Playera de manga larga, ligera y cómoda.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'Gymshark',
    fabric_type: '88% Poliéster, 12% Elastano',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/gymshark/hombre/Element Long Sleeve T-Shirt negra y rojo.png',
        alt: 'Element Long Sleeve T-Shirt',
        dataAiHint: 'men shirt',
        option: 'S',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 1 },
      ],
    },
  },
  {
    id: 2630,
    name: 'Legacy Hoodie',
    price: 'Q.280.00',
    availability: 'Disponible',
    description: 'Sudadera con capucha, un clásico de Gymshark.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'sudadera',
    brand: 'Gymshark',
    fabric_type: '80% Algodón, 20% Poliéster',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/gymshark/hombre/Legacy Hoodie negra.png',
        alt: 'Legacy Hoodie',
        dataAiHint: 'men hoodie',
        option: 'S',
      },
    ],
    options: { type: 'talla', values: [{ value: 'S', stock: 1 }] },
  },
  {
    id: 2631,
    name: 'Built in the UK T-Shirt',
    price: 'Q.240.00',
    availability: 'Disponible',
    description: 'Playera conmemorativa "Built in the UK".',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'Gymshark',
    fabric_type: '100% Algodón',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/gymshark/hombre/Built in the UK T-Shirt azul.png',
        alt: 'Built in the UK T-Shirt',
        dataAiHint: 'men shirt',
        option: 'S',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 1 },
      ],
    },
  },
  {
    id: 2632,
    name: 'Sets N Reps T-Shirt',
    price: 'Q.380.00',
    availability: 'Disponible',
    description: 'Playera ideal para tus entrenamientos de series y repeticiones.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'Gymshark',
    fabric_type: '100% Algodón',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/gymshark/hombre/Sets N Reps T-Shirt verde.png',
        alt: 'Sets N Reps T-Shirt',
        dataAiHint: 'men shirt',
        option: 'S',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 1 },
      ],
    },
  },
  {
    id: 2633,
    name: 'Rest Day Essentials Cargo Joggers',
    price: 'Q.411.00',
    availability: 'Disponible',
    description: 'Joggers cargo, esenciales para tus días de descanso.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'pantalon',
    brand: 'Gymshark',
    fabric_type: '100% Algodón',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/gymshark/hombre/Rest Day Essentials Cargo Joggers negro.png',
        alt: 'Rest Day Essentials Cargo Joggers',
        dataAiHint: 'men joggers',
        option: 'M',
      },
    ],
    options: { type: 'talla', values: [{ value: 'M', stock: 1 }] },
  },
  {
    id: 2634,
    name: 'Crest 7" Shorts',
    price: 'Q.296.00',
    availability: 'Disponible',
    description: 'Shorts de 7 pulgadas de la línea Crest.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'short',
    brand: 'Gymshark',
    fabric_type: '80% Algodón, 20% Poliéster',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/gymshark/hombre/Crest7.png',
        alt: 'CREST 7" SHORTS',
        dataAiHint: 'men shorts',
        option: 'S',
      },
    ],
    options: { type: 'talla', values: [{ value: 'S', stock: 1 }] },
  },
  {
    id: 2635,
    name: 'Lifting Club Apparel Graphic Shorts',
    price: 'Q.245.00',
    availability: 'Disponible',
    description: 'Shorts con gráfico del "Lifting Club Apparel".',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'short',
    brand: 'Gymshark',
    fabric_type: '100% Algodón',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/gymshark/hombre/Liftingclubapparelgraphicshortsnegro.png',
        alt: 'Lifting Club Apparel Graphic Shorts',
        dataAiHint: 'men shorts',
        option: 'XL',
      },
    ],
    options: { type: 'talla', values: [{ value: 'XL', stock: 1 }] },
  },
  {
    id: 2636,
    name: 'Strength Dept Graphic T-Shirt',
    price: 'Q.255.00',
    availability: 'Disponible',
    description: 'Playera del departamento de fuerza.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'Gymshark',
    fabric_type: '100% Algodón',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/gymshark/hombre/Strength Dept Graphic T-Shirt blanca.png',
        alt: 'Strength Dept Graphic T-Shirt',
        dataAiHint: 'men shirt',
        option: 'M',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'M', stock: 1 },
      ],
    },
  },
  {
    id: 2637,
    name: 'British Lifting Goods Graphic T-Shirt',
    price: 'Q.285.00',
    availability: 'Agotado',
    description: 'Playera con gráfico de "British Lifting Goods".',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'Gymshark',
    fabric_type: '100% Algodón',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/gymshark/hombre/British Lifting Goods Graphic T-Shirt azul.png',
        alt: 'British Lifting Goods Graphic T-Shirt',
        dataAiHint: 'men shirt',
        option: 'S',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 0 },
        { value: 'M', stock: 0 },
        { value: 'L', stock: 0 },
      ],
    },
  },
  {
    id: 2638,
    name: 'Sets and Reps 3pk Crew Socks',
    price: 'Q.251.00',
    availability: 'Disponible',
    description:
      'Calcetines para tus sets y reps, en un conveniente paquete de 3.',
    gender: 'unisex',
    category: 'accesorio',
    subcategory: 'calcetin',
    brand: 'Gymshark',
    images: [
      {
        src: '/assets/images/Accesorios/Sets and Reps 3pk Crew.png',
        alt: 'Sets and Reps 3pk Crew Socks',
        dataAiHint: 'fitness socks',
      },
    ],
    options: { type: 'talla', values: [{ value: 'S', stock: 2 }] },
  },
  {
    id: 2639,
    name: 'SILICONE GRIP LIFTING STRAPS',
    price: 'Q.275.00',
    availability: 'Disponible',
    description: 'Straps de levantamiento con agarre de silicona para mayor seguridad.',
    gender: 'unisex',
    category: 'accesorio',
    subcategory: 'equipo',
    brand: 'Gymshark',
    images: [
      {
        src: '/assets/images/Accesorios/Silicone Lifting Straps negro.png',
        alt: 'Lifting Straps',
        dataAiHint: 'lifting straps',
      },
    ],
    options: { type: 'color', values: [{ value: 'Único', stock: 1 }] },
  },
  {
    id: 2640,
    name: 'Redeveloped Silicone Lifting Straps',
    price: 'Q.295.00',
    availability: 'Disponible',
    description: 'Straps de levantamiento con agarre de silicona para mayor seguridad.',
    gender: 'unisex',
    category: 'accesorio',
    subcategory: 'equipo',
    brand: 'Gymshark',
    images: [
      {
        src: '/assets/images/Accesorios/Silicone Lifting Straps morado.png',
        alt: 'Lifting Straps',
        dataAiHint: 'lifting straps',
      },
    ],
    options: { type: 'color', values: [{ value: 'Único', stock: 1 }] },
  },
  {
    id: 2641,
    name: '14OZ SHAKER BOTTLE',
    price: 'Q.226.00',
    availability: 'Disponible',
    description: 'Shaker de 14oz para mezclar tus suplementos.',
    gender: 'unisex',
    category: 'accesorio',
    subcategory: 'shaker',
    brand: 'Gymshark',
    images: [
      {
        src: '/assets/images/Accesorios/14OZ SHAKER BOTTLE.png',
        alt: 'Shaker Bottle',
        dataAiHint: 'shaker bottle',
        option: 'Único',
      },
    ],
    options: { type: 'color', values: [{ value: 'Único', stock: 1 }] },
  },
  {
    id: 2642,
    name: 'TU MARIDO MOISES SHAKER CUP',
    price: 'Q.170.00',
    availability: 'Disponible',
    description: 'Shaker exclusivo "tu marido moises" de Dragon Pharma.',
    gender: 'unisex',
    category: 'accesorio',
    subcategory: 'shaker',
    brand: 'Dragon Pharma',
    images: [
      {
        src: '/assets/images/marcas/dragonpharma/TU MARIDO MOISES SHAKER CUP .png',
        alt: 'Dragon Pharma Shaker',
        dataAiHint: 'shaker bottle',
      },
    ],
    options: { type: 'color', values: [{ value: 'Único', stock: 1 }] },
  },
  {
    id: 2643,
    name: 'Superman Compression Tees',
    price: 'Q.515.00',
    availability: 'Agotado',
    description:
      'Playera de compresión con el icónico logo de Superman para un rendimiento heroico.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'YoungLA',
    fabric_type: '88% Polyester, 12% Spandex',
    is_compression: true,
    images: [
      {
        src: '/assets/images/marcas/youngla/hombre/4117 - SUPERMAN COMPRESSION TEES.png',
        alt: 'Superman Compression Tee',
        dataAiHint: 'superman shirt',
        option: 'M',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 0 },
        { value: 'M', stock: 0 },
        { value: 'L', stock: 0 },
      ],
    },
  },
  {
    id: 2644,
    name: 'Warrior Compression Hoodies',
    price: 'Q.480.00',
    availability: 'Disponible',
    description:
      'Sudadera con capucha de compresión para un look de guerrero y un rendimiento superior.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'sudadera',
    brand: 'YoungLA',
    fabric_type: '90% Nylon, 10% Elastane',
    is_compression: true,
    images: [
      {
        src: '/assets/images/marcas/youngla/hombre/Warrior Compression Hoodies.png',
        alt: 'Warrior Compression Hoodie',
        dataAiHint: 'men hoodie',
        option: 'S',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 1 },
        { value: 'M', stock: 1 },
      ],
    },
  },
  {
    id: 2645,
    name: 'Premium Oversized Broly',
    price: 'Q.595.00',
    availability: 'Disponible',
    description: 'Playera de la colección Dioses y Héroes, ahora en un nuevo color.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'Darc Sport',
    fabric_type: '100% Algodón',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/darcsport/Premium Tee dragon ball broly.jpeg',
        alt: 'Gods & Heroes Tees New Color',
        dataAiHint: 'graphic tee',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 1 },
      ],
    },
  },
  {
    id: 2647,
    name: 'Monster Ultra Black',
    price: 'Q.33.00',
    availability: 'Disponible',
    description: 'Bebida energética Monster Ultra Black sin azúcar.',
    gender: 'unisex',
    category: 'suplemento',
    subcategory: 'pre-entreno',
    brand: 'Monster',
    benefits: 'Energía sin azúcar.',
    servings_info: '1 lata.',
    images: [
      {
        src: '/assets/images/marcas/monster/monster.png',
        alt: 'Monster Ultra Black',
        dataAiHint: 'energy drink',
      },
    ],
    options: { type: 'sabor', values: [{ value: 'Único', stock: 9 }] },
  },
  {
    id: 2648,
    name: 'Bum Energy',
    price: 'Q.33.00',
    availability: 'Disponible',
    description: 'Bebida energética Bum Energy para un impulso extra.',
    gender: 'unisex',
    category: 'suplemento',
    subcategory: 'pre-entreno',
    brand: 'Bum Energy',
    benefits: 'Aumento de energía y enfoque.',
    servings_info: '1 lata.',
    images: [
      {
        src: '/assets/images/marcas/bumenergy/bumlemon.png',
        alt: 'Bum Energy Mora y Limonada',
        dataAiHint: 'energy drink',
        option: 'Blueberry Lemon',
      },
      {
        src: '/assets/images/marcas/bumenergy/bumcherry.png',
        alt: 'Bum Energy Helado de Cereza',
        dataAiHint: 'energy drink',
        option: 'Cherry Frost',
      },
    ],
    options: {
      type: 'sabor',
      values: [
        { value: 'Blueberry Lemon', stock: 6 },
        { value: 'Cherry Frost', stock: 7 },
      ],
    },
  },
  {
    id: 2649,
    name: 'BUM Essential Pre-workout',
    price: 'Q.400.00',
    availability: 'Disponible',
    description: 'Pre-entreno Thavage edición Carlos Belcast para un rendimiento superior.',
    gender: 'unisex',
    category: 'suplemento',
    subcategory: 'pre-entreno',
    brand: 'RAW',
    benefits: 'Energía explosiva y enfoque mental.',
    servings_info: '40 servicios.',
    images: [
      {
        src: '/assets/images/marcas/raw/precarlosb.png',
        alt: 'Pre-Workout Thavage Carlos Belcast',
        dataAiHint: 'pre-workout supplement',
      },
    ],
    options: { type: 'sabor', values: [{ value: 'liche', stock: 1 }] },
  },
  {
    id: 2650,
    name: 'VENOM INFERNO BRAZO DE 50 LIMÓN',
    price: 'Q.485.00',
    availability: 'Disponible',
    description: 'Pre-entreno Venom Inferno para una intensidad máxima en tus entrenamientos.',
    gender: 'unisex',
    category: 'suplemento',
    subcategory: 'pre-entreno',
    brand: 'Dragon Pharma',
    benefits: 'Extrema energía y vascularización.',
    servings_info: '30 servicios.',
    images: [
      {
        src: '/assets/images/marcas/dragonpharma/VENOM INFERNO BRAZO DE 50 LIMÓN.png',
        alt: 'Venom Inferno - Brazo de 50 Limon',
        dataAiHint: 'pre-workout supplement',
      },
    ],
    options: { type: 'sabor', values: [{ value: 'Único', stock: 2 }] },
  },
  {
    id: 2651,
    name: 'Venom Mangonada',
    price: 'Q.530.00',
    availability: 'Disponible',
    description: 'Pre-entreno Venom con delicioso sabor a mangonada.',
    gender: 'unisex',
    category: 'suplemento',
    subcategory: 'pre-entreno',
    brand: 'Dragon Pharma',
    benefits: 'Energía y sabor tropical.',
    servings_info: '30 servicios.',
    images: [
      {
        src: '/assets/images/marcas/dragonpharma/Venom Mangonada.png',
        alt: 'Venom Mangonada',
        dataAiHint: 'pre-workout supplement',
      },
    ],
    options: { type: 'sabor', values: [{ value: 'Único', stock: 1 }] },
  },
  {
    id: 2652,
    name: 'Iso 100 - Dynamatize - Chocolate',
    price: 'Q.665.00',
    availability: 'Disponible',
    description: 'Proteína aislada de alta calidad sabor chocolate.',
    gender: 'unisex',
    category: 'suplemento',
    subcategory: 'proteina',
    brand: 'Dymatize',
    benefits: 'Recuperación muscular rápida, 25g de proteína por servicio.',
    servings_info: '71 servicios.',
    images: [
      {
        src: '/assets/images/marcas/suplementos/iso100choco.png',
        alt: 'Iso 100 - Dynamatize - Chocolate',
        dataAiHint: 'protein powder',
      },
    ],
    options: { type: 'sabor', values: [{ value: 'Único', stock: 1 }] },
  },
  {
    id: 2653,
    name: 'Iso 100 - Dynamatize - Cocoa Pebbles',
    price: 'Q.685.00',
    availability: 'Disponible',
    description: 'Proteína aislada con el delicioso y único sabor de Cocoa Pebbles.',
    gender: 'unisex',
    category: 'suplemento',
    subcategory: 'proteina',
    brand: 'Dymatize',
    benefits: 'Recuperación muscular rápida y sabor increíble.',
    servings_info: '71 servicios.',
    images: [
      {
        src: '/assets/images/marcas/suplementos/iso100cocoa.png',
        alt: 'Iso 100 - Dynamatize - Cocoa Pebbles',
        dataAiHint: 'protein powder',
      },
    ],
    options: { type: 'sabor', values: [{ value: 'Único', stock: 2 }] },
  },
  {
    id: 2654,
    name: 'Creatina Platinum',
    price: 'Q.365.00',
    availability: 'Disponible',
    description: 'Creatina de alta calidad para mejorar la fuerza y el rendimiento.',
    gender: 'unisex',
    category: 'suplemento',
    subcategory: 'creatina',
    brand: 'Muscletech',
    benefits: 'Aumento de fuerza y volumen muscular.',
    servings_info: '80 servicios.',
    images: [
      {
        src: '/assets/images/marcas/suplementos/creatinamuscletech.png',
        alt: 'Creatina Muscletech',
        dataAiHint: 'creatine powder',
      },
    ],
    options: { type: 'presentación', values: [{ value: 'Único', stock: 1 }] },
  },
  {
    id: 2655,
    name: 'Raw Sleep',
    price: 'Q.385.00',
    availability: 'Disponible',
    description: 'Fórmula para mejorar la calidad del sueño y la recuperación nocturna.',
    gender: 'unisex',
    category: 'suplemento',
    subcategory: 'aminoacidos',
    brand: 'RAW',
    benefits: 'Promueve un sueño reparador y profundo.',
    servings_info: '30 servicios.',
    images: [
      {
        src: '/assets/images/marcas/raw/rawsleep.png',
        alt: 'Raw Sleep',
        dataAiHint: 'sleep supplement',
      },
    ],
    options: { type: 'presentación', values: [{ value: 'Único', stock: 2 }] },
  },
  {
    id: 2656,
    name: 'DR. FEAAR® - Complete Essential Amino Acid Raspberry Lemon',
    price: 'Q.350.00',
    availability: 'Disponible',
    description: 'Fórmula avanzada de aminoácidos esenciales para la recuperación y el rendimiento.',
    gender: 'unisex',
    category: 'suplemento',
    subcategory: 'aminoacidos',
    brand: 'Dragon Pharma',
    benefits: 'Mejora la síntesis de proteínas y la recuperación muscular.',
    servings_info: '30 servicios.',
    images: [
      {
        src: '/assets/images/marcas/dragonpharma/DR. FEAAR® - Complete Essential Amino Acid Raspberry Lemonade.png',
        alt: 'Aminoácidos Dr. Feaar - Dragon Pharma',
        dataAiHint: 'amino acids',
      },
    ],
    options: { type: 'sabor', values: [{ value: 'Único', stock: 1 }] },
  },
  {
    id: 2657,
    name: 'Glutamina - Dragon Pharma',
    price: 'Q.345.00',
    availability: 'Agotado',
    description: 'Glutamina pura para apoyar la recuperación muscular y la salud intestinal.',
    gender: 'unisex',
    category: 'suplemento',
    subcategory: 'aminoacidos',
    brand: 'Dragon Pharma',
    benefits: 'Reduce el dolor muscular y apoya el sistema inmunológico.',
    servings_info: '60 servicios.',
    images: [
      {
        src: '/assets/images/marcas/dragonpharma/GLUTAMINE 30 SERVS.png',
        alt: 'Glutamina - Dragon Pharma',
        dataAiHint: 'glutamine powder',
      },
    ],
    options: { type: 'presentación', values: [{ value: 'Único', stock: 0 }] },
  },
  {
    id: 2658,
    name: 'GREENS & REDS',
    price: 'Q.485.00',
    availability: 'Disponible',
    description: 'Superalimentos en polvo para una dosis diaria de vitaminas, minerales y antioxidantes.',
    gender: 'unisex',
    category: 'suplemento',
    subcategory: 'proteina',
    brand: 'Dragon Pharma',
    benefits: 'Apoyo al sistema inmunológico y bienestar general.',
    servings_info: '30 servicios.',
    images: [
      {
        src: '/assets/images/marcas/dragonpharma/GREENS & REDS.png',
        alt: 'Greens and Reds - Dragon Pharma',
        dataAiHint: 'superfood powder',
      },
    ],
    options: { type: 'sabor', values: [{ value: 'Único', stock: 1 }] },
  },
  {
    id: 2659,
    name: 'Metal WLVS "Pierce" Hoodie in Black',
    price: 'Q.625.00',
    availability: 'Disponible',
    description: 'Sudadera con capucha de la colección Metal WLVS.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'sudadera',
    brand: 'Darc Sport',
    fabric_type: '100% Cotton',
    is_compression: false,
    images: [
      {
        src: '/assets/images/marcas/darcsport/Metal WLVS ”Pierce”Hoodie.png',
        alt: 'Metal WLVS Pierce Hoodie',
        dataAiHint: 'men hoodie'
      }
    ],
    options: {
      type: 'talla',
      values: [{value: 'S', stock: 1}]
    }
  },
  {
    id: 2660,
    name: 'Gains Seamless Washed Shorts',
    price: 'Q.575.00',
    availability: 'Disponible',
    description: 'Shorts sin costuras de la colección Gains para un confort y estilo inigualables.',
    gender: 'mujer',
    category: 'ropa',
    subcategory: 'short',
    brand: 'Gymshark',
    fabric_type: '89% Nylon, 11% Elastane',
    is_compression: true,
    images: [
      {
        src: '/assets/images/marcas/gymshark/mujer/gains_seamless_washed_shorts_gris.png',
        alt: 'Gains Seamless Washed Shorts',
        dataAiHint: 'woman shorts',
      },
    ],
    options: {
      type: 'talla',
      values: [{ value: 'L', stock: 1 }],
    },
  },
  {
    id: 2661,
    name: 'Impact Bra',
    price: 'Q.460.00',
    availability: 'Disponible',
    description: 'Bra deportivo de alto impacto para un soporte superior durante tus entrenamientos más intensos.',
    gender: 'mujer',
    category: 'ropa',
    subcategory: 'bras-deportivo',
    brand: 'DFYNE',
    fabric_type: '78% Nylon, 22% Elastane',
    is_compression: true,
    images: [
      {
        src: '/assets/images/marcas/dfyne/impact-bra-black.png',
        alt: 'Impact Bra Black',
        dataAiHint: 'sports bra black',
      },
    ],
    options: {
        type: 'talla',
        values: [],
    },
    colors: [
        {
            name: 'Negro',
            hex: '#000000',
            imageSrc: '/assets/images/marcas/dfyne/impact-bra-black.png',
            options: {
                type: 'talla',
                values: [{ value: 'S', stock: 1 }],
            }
        }
    ]
  },
  {
    id: 2662,
    name: 'Impact Short',
    price: 'Q.540.00',
    availability: 'Disponible',
    description: 'Shorts de alto impacto diseñados para moverse contigo, ofreciendo comodidad y estilo.',
    gender: 'mujer',
    category: 'ropa',
    subcategory: 'short',
    brand: 'DFYNE',
    fabric_type: '78% Nylon, 22% Elastane',
    is_compression: true,
    images: [
      {
        src: '/assets/images/marcas/dfyne/impact-short-black.png',
        alt: 'Impact Short Black',
        dataAiHint: 'woman shorts black',
      },
    ],
    options: {
        type: 'talla',
        values: [],
    },
    colors: [
        {
            name: 'Negro',
            hex: '#000000',
            imageSrc: '/assets/images/marcas/dfyne/impact-short-black.png',
            options: {
                type: 'talla',
                values: [{ value: 'S', stock: 1 }],
            }
        }
    ]
  },
  {
    id: 2663,
    name: 'Compression Batman',
    price: 'Q.595.00',
    availability: 'Agotado',
    description: 'Conviértete en el caballero de la noche del gimnasio con esta playera de compresión de Batman. Oferta especial: antes Q.750.00, ahora Q.595.00.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    brand: 'YoungLA',
    fabric_type: '88% Polyester, 12% Spandex',
    is_compression: true,
    images: [
      {
        src: '/assets/images/marcas/youngla/hombre/batman-compression.png',
        alt: 'Batman Compression black',
        dataAiHint: 'batman shirt black',
      },
    ],
    options: {
        type: 'talla',
        values: [],
    },
    colors: [
        {
            name: 'Negra',
            hex: '#000000',
            imageSrc: '/assets/images/marcas/youngla/hombre/batman-compression.png',
            options: {
                type: 'talla',
                values: [
                    { value: 'S', stock: 0 },
                    { value: 'M', stock: 0 },
                    { value: 'L', stock: 0 },
                ],
            }
        }
    ]
  }
];

    