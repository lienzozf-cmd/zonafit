

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
    subcategory: 'top',
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
];
