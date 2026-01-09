
import productsData from './products.json';
import type { Product } from './types';

export const products: Product[] = productsData as Product[];

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
      { title: 'Dfyne', href: '/marcas/dfyne' },
      { title: 'Dragon Pharma', href: '/marcas/dragon-pharma' },
      { title: 'RAW', href: '/marcas/raw' },
      { title: 'RGMNT', href: '/marcas/rgmnt' },
      { title: 'Bum Energy', href: '/marcas/bum-energy' },
      { title: 'Civil Regime', href: '/marcas/civil-regime' },
      { title: 'Ver Todo', href: '/marcas' },
    ],
  },
];
