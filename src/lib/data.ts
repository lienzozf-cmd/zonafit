


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
    sublinks: [{ title: 'Rgmnt', href: '/marcas/rgmnt' }],
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
      { title: 'C4 Energy', href: '/marcas/c4-energy' },
      { title: 'Ver Todo', href: '/marcas' },
    ],
  },
];

export type ProductOption = {
  value: string;
  stock: number;
};

export type Product = {
  id: number;
  name: string;
  price: string;
  availability: string;
  images: { src: string; alt: string; dataAiHint: string; option: string }[];
  options: { type: string; values: ProductOption[] };
  description: string;
  gender: 'hombre' | 'mujer' | 'unisex';
  category: 'ropa' | 'suplemento' | 'accesorio';
  subcategory: string;
  // Ropa
  fabric_type?: string;
  is_compression?: boolean;
  // Suplemento
  benefits?: string;
  servings_info?: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: 'Superhero Compression Tees Red',
    price: 'Q.450.00',
    availability: 'Disponible',
    description: 'Conviértete en un héroe del gimnasio con esta playera de compresión. Diseñada para un rendimiento máximo y un estilo inigualable, te ayudará a superar tus límites.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    fabric_type: '88% Polyester, 12% Spandex',
    is_compression: true,
    images: [
      {
        src: "/assets/images/marcas/youngla/hombre/superheroeroja.png",
        alt: 'Red compression shirt front',
        dataAiHint: 'red shirt',
        option: 'S',
      },
       {
        src: "/assets/images/marcas/youngla/hombre/superheroeatras.png",
        alt: 'Red compression shirt back',
        dataAiHint: 'red shirt man',
        option: 'S',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 1 },
        { value: 'M', stock: 2 },
        { value: 'L', stock: 3 },
      ],
    },
  },
  {
    id: 2,
    name: 'Warrior Compression Tees Blue',
    price: 'Q.500.00',
    availability: 'Disponible',
    description: 'Desata al guerrero que llevas dentro. Esta playera de compresión azul ofrece un soporte muscular superior y una transpirabilidad excepcional para los entrenamientos más intensos.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    fabric_type: '90% Nylon, 10% Elastane',
    is_compression: true,
    images: [
      {
        src:  "/assets/images/marcas/youngla/hombre/warriorazul.png",
        alt: 'Blue compression shirt',
        dataAiHint: 'blue shirt',
        option: 'S',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 1 },
        { value: 'M', stock: 2 },
        { value: 'L', stock: 3 },
      ],
    },
  },
  {
    id: 3,
    name: 'Legacy Drop Arm Tank Black',
    price: 'Q.450.00',
    availability: 'Disponible',
    description: 'Un clásico del fitness. El Legacy Drop Arm Tank está diseñado para ofrecer una total libertad de movimiento y un look icónico que nunca pasa de moda.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'tank',
    fabric_type: '100% Algodón',
    is_compression: false,
    images: [
      {
        src:  "/assets/images/marcas/gymshark/hombre/GYMSTHN.png",
        alt: 'Black tank top',
        dataAiHint: 'black tank',
        option: 'S',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 1 },
        { value: 'M', stock: 2 },
        { value: 'L', stock: 3 },
      ],
    },
  },
  {
    id: 4,
    name: 'Power T-Shirt Black and Red',
    price: 'Q.450.00',
    availability: 'Disponible',
    description: 'Potencia y estilo se unen en esta T-Shirt. Con un ajuste atlético y un diseño audaz en negro y rojo, es la prenda perfecta tanto para dentro como para fuera del gimnasio.',
    gender: 'hombre',
    category: 'ropa',
    subcategory: 'playera',
    fabric_type: '95% Algodón, 5% Elastano',
    is_compression: false,
    images: [
      {
        src: "/assets/images/marcas/gymshark/hombre/GYMSPOWERNR.png",
        alt: 'Black and red t-shirt',
        dataAiHint: 'black red shirt',
        option: 'S',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 1 },
        { value: 'M', stock: 2 },
        { value: 'L', stock: 3 },
      ],
    },
  },
  {
    id: 5,
    name: 'Vital Seamless Crop Top Green',
    price: 'Q.450.00',
    availability: 'Disponible',
    description: 'El crop top que lo tiene todo: tecnología sin costuras para una comodidad máxima, tejido que absorbe el sudor y un diseño que realza tu figura.',
    gender: 'mujer',
    category: 'ropa',
    subcategory: 'top',
    fabric_type: '96% Nylon, 4% Elastane',
    is_compression: true,
    images: [
      {
        src: "/assets/images/marcas/gymshark/mujer/anabelgyms.jpg",
        alt: 'Green crop top',
        dataAiHint: 'green crop top',
        option: 'S',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 1 },
        { value: 'M', stock: 2 },
        { value: 'L', stock: 3 },
      ],
    },
  },
  {
    id: 6,
    name: 'Core Hourglass Bra Tank Red',
    price: 'Q.450.00',
    availability: 'Disponible',
    description: 'Diseñado para esculpir y dar soporte, este bra tank en un vibrante color rojo es tan funcional como favorecedor. Su diseño de reloj de arena realza tus curvas naturales.',
    gender: 'mujer',
    category: 'ropa',
    subcategory: 'bra-deportivo',
    fabric_type: '78% Nylon, 22% Elastane',
    is_compression: true,
    images: [
      {
        src: "/assets/images/marcas/youngla/mujer/brarojoyla.png",
        alt: 'Red bra tank',
        dataAiHint: 'red bra',
        option: 'S',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 1 },
        { value: 'M', stock: 2 },
        { value: 'L', stock: 3 },
      ],
    },
  },
  {
    id: 7,
    name: 'Proteína ISO Dragon Pharma - 2lb',
    price: 'Q.450.00',
    availability: 'Disponible',
    description: 'Isolat de proteína de suero de leche de la más alta pureza para una recuperación muscular óptima. Baja en carbohidratos y grasas, perfecta para definir.',
    gender: 'unisex',
    category: 'suplemento',
    subcategory: 'proteina',
    benefits: 'Recuperación muscular rápida, bajo en carbohidratos y grasas.',
    servings_info: 'Aproximadamente 30 servicios por envase.',
    images: [
      {
        src: "/assets/images/marcas/dragonpharma/isoproteinblb.png",
        alt: 'Blueberry protein powder',
        dataAiHint: 'protein powder',
        option: 'Blueberry',
      },
      {
        src: "/assets/images/marcas/dragonpharma/proteinachb.png",
        alt: 'White chocolate protein powder',
        dataAiHint: 'protein powder',
        option: 'ChocolateBlanco',
      },
    ],
    options: {
      type: 'sabor',
      values: [
        { value: 'Blueberry', stock: 1 },
        { value: 'ChocolateBlanco', stock: 3 },
      ],
    },
  },
  {
    id: 8,
    name: 'Creatina Monohidratada Dragon Pharma',
    price: 'Q.450.00',
    availability: 'Disponible',
    description: 'Aumenta tu fuerza, potencia y rendimiento con creatina monohidratada micronizada de alta calidad. Un suplemento esencial para cualquier atleta serio.',
    gender: 'unisex',
    category: 'suplemento',
    subcategory: 'creatina',
    benefits: 'Aumento de fuerza, mejora del rendimiento, mayor volumen muscular.',
    servings_info: 'Disponible en 60 o 200 servicios.',
    images: [
      {
        src: "/assets/images/marcas/dragonpharma/creatinaDP.png",
        alt: 'Creatine container',
        dataAiHint: 'creatine powder',
        option: 'Serv60',
      },
    ],
    options: {
      type: 'servicios',
      values: [
        { value: 'Serv60', stock: 1 },
        { value: 'Serv200', stock: 3 },
      ],
    },
  },
  // Shorts para Hombres (10 productos)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 100 + i,
    name: `Performance Short ${i + 1}`,
    price: 'Q.350.00',
    availability: 'Disponible',
    description: `Short deportivo de alto rendimiento, ideal para cualquier tipo de entrenamiento. Ligero y transpirable.`,
    gender: 'hombre' as const,
    category: 'ropa' as const,
    subcategory: 'short',
    fabric_type: '90% Polyester, 10% Spandex',
    is_compression: false,
    images: [
      {
        src: "https://placehold.co/600x400.png",
        alt: `Short ${i + 1}`,
        dataAiHint: 'men shorts',
        option: 'M',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 5 },
        { value: 'M', stock: 5 },
        { value: 'L', stock: 5 },
      ],
    },
  })),
  // Pantalones para Hombres (10 productos)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 200 + i,
    name: `Tech Jogger ${i + 1}`,
    price: 'Q.550.00',
    availability: 'Disponible',
    description: `Pantalón jogger con tejido técnico, perfecto para un look atlético y cómodo.`,
    gender: 'hombre' as const,
    category: 'ropa'as const,
    subcategory: 'pantalon',
    fabric_type: '85% Algodón, 15% Polyester',
    is_compression: false,
    images: [
      {
        src: "https://placehold.co/600x400.png",
        alt: `Jogger ${i + 1}`,
        dataAiHint: 'men joggers',
        option: 'M',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 5 },
        { value: 'M', stock: 5 },
        { value: 'L', stock: 5 },
      ],
    },
  })),
  // Sudaderas para Hombres (10 productos)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 300 + i,
    name: `Training Hoodie ${i + 1}`,
    price: 'Q.600.00',
    availability: 'Disponible',
    description: `Sudadera con capucha diseñada para el entrenamiento, te mantiene abrigado sin sacrificar movilidad.`,
    gender: 'hombre' as const,
    category: 'ropa' as const,
    subcategory: 'sudadera',
    fabric_type: '60% Algodón, 40% Polyester',
    is_compression: false,
    images: [
      {
        src: "https://placehold.co/600x400.png",
        alt: `Hoodie ${i + 1}`,
        dataAiHint: 'men hoodie',
        option: 'M',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 5 },
        { value: 'M', stock: 5 },
        { value: 'L', stock: 5 },
      ],
    },
  })),
  // Chamarras para Hombres (10 productos)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 400 + i,
    name: `Windbreaker Jacket ${i + 1}`,
    price: 'Q.700.00',
    availability: 'Disponible',
    description: `Chamarra rompevientos ligera, ideal para protegerte del clima sin añadir peso.`,
    gender: 'hombre' as const,
    category: 'ropa' as const,
    subcategory: 'chamarra',
    fabric_type: '100% Polyester',
    is_compression: false,
    images: [
      {
        src: "https://placehold.co/600x400.png",
        alt: `Jacket ${i + 1}`,
        dataAiHint: 'men jacket',
        option: 'M',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 5 },
        { value: 'M', stock: 5 },
        { value: 'L', stock: 5 },
      ],
    },
  })),
  // Tops para Mujer (10 productos)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 500 + i,
    name: `Studio Crop Top ${i + 1}`,
    price: 'Q.380.00',
    availability: 'Disponible',
    description: `Top corto versátil y cómodo, ideal para el estudio o para un look casual.`,
    gender: 'mujer' as const,
    category: 'ropa' as const,
    subcategory: 'top',
    fabric_type: '95% Cotton, 5% Elastane',
    is_compression: false,
    images: [
      {
        src: 'https://placehold.co/600x400.png',
        alt: `Women's Top ${i + 1}`,
        dataAiHint: 'woman top',
        option: 'M',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'XS', stock: 5 },
        { value: 'S', stock: 5 },
        { value: 'M', stock: 5 },
      ],
    },
  })),
  // Bras Deportivos para Mujer (10 productos)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 600 + i,
    name: `Support Sports Bra ${i + 1}`,
    price: 'Q.420.00',
    availability: 'Disponible',
    description: `Bra deportivo de alto impacto que ofrece máximo soporte y comodidad durante tus entrenamientos.`,
    gender: 'mujer' as const,
    category: 'ropa' as const,
    subcategory: 'bra-deportivo',
    fabric_type: '80% Nylon, 20% Spandex',
    is_compression: true,
    images: [
      {
        src: 'https://placehold.co/600x400.png',
        alt: `Sports Bra ${i + 1}`,
        dataAiHint: 'sports bra',
        option: 'M',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 5 },
        { value: 'M', stock: 5 },
        { value: 'L', stock: 5 },
      ],
    },
  })),
  // Leggings para Mujer (10 productos)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 700 + i,
    name: `Flex Legging ${i + 1}`,
    price: 'Q.550.00',
    availability: 'Disponible',
    description: `Leggings flexibles que se mueven contigo. Diseño que realza la figura y no transparenta.`,
    gender: 'mujer' as const,
    category: 'ropa' as const,
    subcategory: 'legging',
    fabric_type: '87% Nylon, 13% Spandex',
    is_compression: true,
    images: [
      {
        src: 'https://placehold.co/600x400.png',
        alt: `Legging ${i + 1}`,
        dataAiHint: 'woman legging',
        option: 'M',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'XS', stock: 5 },
        { value: 'S', stock: 5 },
        { value: 'M', stock: 5 },
      ],
    },
  })),
  // Shorts para Mujer (10 productos)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 800 + i,
    name: `Cycling Short ${i + 1}`,
    price: 'Q.400.00',
    availability: 'Disponible',
    description: `Shorts de ciclismo cómodos y estilizados, perfectos para entrenar o para un look athleisure.`,
    gender: 'mujer' as const,
    category: 'ropa' as const,
    subcategory: 'short',
    fabric_type: '87% Nylon, 13% Spandex',
    is_compression: true,
    images: [
      {
        src: 'https://placehold.co/600x400.png',
        alt: `Women's Short ${i + 1}`,
        dataAiHint: 'woman shorts',
        option: 'M',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'XS', stock: 5 },
        { value: 'S', stock: 5 },
        { value: 'M', stock: 5 },
      ],
    },
  })),
  // Sudaderas para Mujer (10 productos)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 900 + i,
    name: `Oversized Hoodie ${i + 1}`,
    price: 'Q.620.00',
    availability: 'Disponible',
    description: `Sudadera oversized para una máxima comodidad y estilo. Tejido suave y cálido.`,
    gender: 'mujer' as const,
    category: 'ropa' as const,
    subcategory: 'sudadera',
    fabric_type: '80% Cotton, 20% Polyester',
    is_compression: false,
    images: [
      {
        src: 'https://placehold.co/600x400.png',
        alt: `Women's Hoodie ${i + 1}`,
        dataAiHint: 'woman hoodie',
        option: 'M',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 5 },
        { value: 'M', stock: 5 },
        { value: 'L', stock: 5 },
      ],
    },
  })),
    // Chamarras para Mujer (10 productos)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 1000 + i,
    name: `Cropped Jacket ${i + 1}`,
    price: 'Q.750.00',
    availability: 'Disponible',
    description: `Chamarra corta moderna y funcional. Perfecta para combinar con tus leggings o tops favoritos.`,
    gender: 'mujer' as const,
    category: 'ropa' as const,
    subcategory: 'chamarra',
    fabric_type: '100% Polyester',
    is_compression: false,
    images: [
      {
        src: 'https://placehold.co/600x400.png',
        alt: `Women's Jacket ${i + 1}`,
        dataAiHint: 'woman jacket',
        option: 'M',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 5 },
        { value: 'M', stock: 5 },
        { value: 'L', stock: 5 },
      ],
    },
  })),
  // Pachones (10 productos)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 1100 + i,
    name: `Hydrate Water Bottle ${i + 1}`,
    price: 'Q.150.00',
    availability: 'Disponible',
    description: 'Mantente hidratado con estilo. Botella de agua duradera y libre de BPA.',
    gender: 'unisex' as const,
    category: 'accesorio' as const,
    subcategory: 'pachon',
    images: [
      {
        src: 'https://placehold.co/600x400.png',
        alt: `Water Bottle ${i + 1}`,
        dataAiHint: 'water bottle',
        option: 'Único',
      },
    ],
    options: {
      type: 'color',
      values: [{ value: 'Único', stock: 10 }],
    },
  })),
  // Shakers (10 productos)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 1200 + i,
    name: `Protein Shaker ${i + 1}`,
    price: 'Q.125.00',
    availability: 'Disponible',
    description: 'Mezcla tus batidos de proteína sin grumos. Incluye bola mezcladora.',
    gender: 'unisex' as const,
    category: 'accesorio' as const,
    subcategory: 'shaker',
    images: [
      {
        src: 'https://placehold.co/600x400.png',
        alt: `Shaker ${i + 1}`,
        dataAiHint: 'protein shaker',
        option: 'Único',
      },
    ],
    options: {
      type: 'color',
      values: [{ value: 'Único', stock: 10 }],
    },
  })),
  // Equipo de Entrenamiento (10 productos)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 1300 + i,
    name: `Training Gear ${i + 1}`,
    price: 'Q.250.00',
    availability: 'Disponible',
    description: 'Equipo esencial para tus entrenamientos, desde bandas de resistencia hasta cuerdas para saltar.',
    gender: 'unisex' as const,
    category: 'accesorio' as const,
    subcategory: 'equipo',
    images: [
      {
        src: 'https://placehold.co/600x400.png',
        alt: `Training Gear ${i + 1}`,
        dataAiHint: 'gym gear',
        option: 'Único',
      },
    ],
    options: {
      type: 'item',
      values: [{ value: 'Único', stock: 10 }],
    },
  })),
  // Gorras (10 productos)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 1400 + i,
    name: `Lifestyle Cap ${i + 1}`,
    price: 'Q.200.00',
    availability: 'Disponible',
    description: 'Completa tu look con esta gorra de estilo de vida. Ajustable y cómoda.',
    gender: 'unisex' as const,
    category: 'accesorio' as const,
    subcategory: 'gorra',
    images: [
      {
        src: 'https://placehold.co/600x400.png',
        alt: `Cap ${i + 1}`,
        dataAiHint: 'fitness cap',
        option: 'Único',
      },
    ],
    options: {
      type: 'color',
      values: [{ value: 'Único', stock: 10 }],
    },
  })),
  // Mochilas (10 productos)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 1500 + i,
    name: `Gym Backpack ${i + 1}`,
    price: 'Q.500.00',
    availability: 'Disponible',
    description: 'Lleva todo tu equipo de gimnasio en esta mochila espaciosa y duradera.',
    gender: 'unisex' as const,
    category: 'accesorio' as const,
    subcategory: 'mochila',
    images: [
      {
        src: 'https://placehold.co/600x400.png',
        alt: `Backpack ${i + 1}`,
        dataAiHint: 'gym backpack',
        option: 'Único',
      },
    ],
    options: {
      type: 'color',
      values: [{ value: 'Único', stock: 10 }],
    },
  })),
  // Maletas (10 productos)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 1600 + i,
    name: `Duffle Bag ${i + 1}`,
    price: 'Q.600.00',
    availability: 'Disponible',
    description: 'Maleta de gimnasio perfecta para viajes o para llevar todo lo que necesitas para entrenar.',
    gender: 'unisex' as const,
    category: 'accesorio' as const,
    subcategory: 'maleta',
    images: [
      {
        src: 'https://placehold.co/600x400.png',
        alt: `Duffle Bag ${i + 1}`,
        dataAiHint: 'gym bag',
        option: 'Único',
      },
    ],
    options: {
      type: 'color',
      values: [{ value: 'Único', stock: 10 }],
    },
  })),
  // Calcetines (10 productos)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 1700 + i,
    name: `Performance Socks ${i + 1}`,
    price: 'Q.100.00',
    availability: 'Disponible',
    description: 'Calcetines de rendimiento que ofrecen comodidad y soporte durante todo el día.',
    gender: 'unisex' as const,
    category: 'accesorio' as const,
    subcategory: 'calcetin',
    images: [
      {
        src: 'https://placehold.co/600x400.png',
        alt: `Socks ${i + 1}`,
        dataAiHint: 'fitness socks',
        option: 'Único',
      },
    ],
    options: {
      type: 'talla',
      values: [{ value: 'Único', stock: 10 }],
    },
  })),
];
