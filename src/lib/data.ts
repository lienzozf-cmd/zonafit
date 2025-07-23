
export const navLinks = [
  {
    title: 'HOMBRES',
    href: '/hombres',
    sublinks: [
      {
        title: 'Playeras',
        href: '/hombres/playeras',
        sublinks: [{ title: 'Tanks', href: '/hombres/tanks' }],
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
          { title: 'Blusas', href: '/mujeres/blusas' },
          { title: 'Bras Deportivos', href: '/mujeres/bras-deportivos' },
        ],
      },
      {
        title: 'Leggings',
        href: '/mujeres/leggings',
        sublinks: [
          { title: 'Shorts', href: '/mujeres/shorts' },
          { title: 'Leggings', href: '/mujeres/leggings' },
        ],
      },
      {
        title: 'Sudaderas',
        href: '/mujeres/sudaderas',
        sublinks: [
          { title: 'Chamarras', href: '/mujeres/chamarras' },
          { title: 'Sudaderas', href: '/mujeres/sudaderas' },
        ],
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
};

export const products: Product[] = [
  {
    id: 1,
    name: 'Superhero Compression Tees Red',
    price: 'Q.450.00',
    availability: 'Disponible',
    images: [
      {
        src: '/assets/images/marcas/youngla/hombre/superheroeroja.png',
        alt: 'Red compression shirt',
        dataAiHint: 'red shirt',
        option: 'S',
      },
      {
        src: '/assets/images/marcas/youngla/hombre/superheroeroja.png',
        alt: 'Red compression shirt M',
        dataAiHint: 'red shirt',
        option: 'M',
      },
      {
        src: '/assets/images/marcas/youngla/hombre/superheroeroja.png',
        alt: 'Red compression shirt L',
        dataAiHint: 'red shirt',
        option: 'L',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 3 },
        { value: 'M', stock: 2 },
        { value: 'L', stock: 5 },
      ],
    },
  },
  {
    id: 2,
    name: 'Warrior Compression Tees Blue',
    price: 'Q.500.00',
    availability: 'Disponible',
    images: [
      {
        src: '/assets/images/marcas/youngla/hombre/warriorazul.png',
        alt: 'Blue compression shirt',
        dataAiHint: 'blue shirt',
        option: 'S',
      },
      {
        src: '/assets/images/marcas/youngla/hombre/warriorazul.png',
        alt: 'Blue compression shirt M',
        dataAiHint: 'blue shirt',
        option: 'M',
      },
      {
        src: '/assets/images/marcas/youngla/hombre/warriorazul.png',
        alt: 'Blue compression shirt L',
        dataAiHint: 'blue shirt',
        option: 'L',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 1 },
        { value: 'M', stock: 4 },
        { value: 'L', stock: 2 },
      ],
    },
  },
  {
    id: 3,
    name: 'Legacy Drop Arm Tank Black',
    price: 'Q.450.00',
    availability: 'Disponible',
    images: [
      {
        src: '/assets/images/marcas/gymshark/hombre/GYMSTHN.png',
        alt: 'Black tank top',
        dataAiHint: 'black tank',
        option: 'S',
      },
      {
        src: '/assets/images/marcas/gymshark/hombre/GYMSTHN.png',
        alt: 'Black tank top M',
        dataAiHint: 'black tank',
        option: 'M',
      },
      {
        src: '/assets/images/marcas/gymshark/hombre/GYMSTHN.png',
        alt: 'Black tank top L',
        dataAiHint: 'black tank',
        option: 'L',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 5 },
        { value: 'M', stock: 5 },
        { value: 'L', stock: 0 },
      ],
    },
  },
  {
    id: 4,
    name: 'Power T-Shirt Black and Red',
    price: 'Q.450.00',
    availability: 'Disponible',
    images: [
      {
        src: '/assets/images/marcas/gymshark/hombre/GYMSPOWERNR.png',
        alt: 'Black and red t-shirt',
        dataAiHint: 'black red shirt',
        option: 'S',
      },
      {
        src: '/assets/images/marcas/gymshark/hombre/GYMSPOWERNR.png',
        alt: 'Black and red t-shirt M',
        dataAiHint: 'black red shirt',
        option: 'M',
      },
      {
        src: '/assets/images/marcas/gymshark/hombre/GYMSPOWERNR.png',
        alt: 'Black and red t-shirt L',
        dataAiHint: 'black red shirt',
        option: 'L',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 2 },
        { value: 'M', stock: 3 },
        { value: 'L', stock: 1 },
      ],
    },
  },
  {
    id: 5,
    name: 'Vital Seamless Crop Top Green',
    price: 'Q.450.00',
    availability: 'Disponible',
    images: [
      {
        src: '/assets/images/marcas/gymshark/mujer/anabelgyms.jpg',
        alt: 'Green crop top',
        dataAiHint: 'green crop top',
        option: 'S',
      },
      {
        src: '/assets/images/marcas/gymshark/mujer/anabelgyms.jpg',
        alt: 'Green crop top M',
        dataAiHint: 'green crop top',
        option: 'M',
      },
      {
        src: '/assets/images/marcas/gymshark/mujer/anabelgyms.jpg',
        alt: 'Green crop top L',
        dataAiHint: 'green crop top',
        option: 'L',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 4 },
        { value: 'M', stock: 1 },
        { value: 'L', stock: 3 },
      ],
    },
  },
  {
    id: 6,
    name: 'Core Hourglass Bra Tank Red',
    price: 'Q.450.00',
    availability: 'Disponible',
    images: [
      {
        src: '/assets/images/marcas/youngla/mujer/brarojoyla.png',
        alt: 'Red bra tank',
        dataAiHint: 'red bra',
        option: 'S',
      },
      {
        src: '/assets/images/marcas/youngla/mujer/brarojoyla.png',
        alt: 'Red bra tank M',
        dataAiHint: 'red bra',
        option: 'M',
      },
      {
        src: '/assets/images/marcas/youngla/mujer/brarojoyla.png',
        alt: 'Red bra tank L',
        dataAiHint: 'red bra',
        option: 'L',
      },
    ],
    options: {
      type: 'talla',
      values: [
        { value: 'S', stock: 6 },
        { value: 'M', stock: 0 },
        { value: 'L', stock: 2 },
      ],
    },
  },
  {
    id: 7,
    name: 'Proteína ISO Dragon Pharma - 2lb',
    price: 'Q.450.00',
    availability: 'Disponible',
    images: [
      {
        src: '/assets/images/marcas/dragon/isophormblue.png',
        alt: 'Blueberry protein powder',
        dataAiHint: 'protein powder',
        option: 'Blueberry',
      },
      {
        src: '/assets/images/marcas/dragon/isophormwc.png',
        alt: 'White chocolate protein powder',
        dataAiHint: 'protein powder',
        option: 'ChocolateBlanco',
      },
    ],
    options: {
      type: 'sabor',
      values: [
        { value: 'Blueberry', stock: 10 },
        { value: 'ChocolateBlanco', stock: 8 },
      ],
    },
  },
  {
    id: 8,
    name: 'Creatina Monohidratada Dragon Pharma',
    price: 'Q.450.00',
    availability: 'Disponible',
    images: [
      {
        src: '/assets/images/marcas/dragon/creatinaDP.png',
        alt: 'Creatine container',
        dataAiHint: 'creatine powder',
        option: 'Serv60',
      },
      {
        src: '/assets/images/marcas/dragon/creatinaDP.png',
        alt: 'Large creatine container',
        dataAiHint: 'creatine powder',
        option: 'Serv200',
      },
    ],
    options: {
      type: 'servicios',
      values: [
        { value: 'Serv60', stock: 15 },
        { value: 'Serv200', stock: 5 },
      ],
    },
  },
];
