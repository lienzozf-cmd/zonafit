import Image from 'next/image';

const categories = [
  {
    name: 'Mujer',
    products: 47,
    href: '/mujer',
    image: {
      src: '/assets/images/marcas/gymshark/mujer/anabelrojo2.jpg',
      alt: 'Mujer',
    },
    className: 'large-vertical',
  },
  {
    name: 'Hombre',
    products: 24,
    href: '/hombre',
    image: {
      src: '/assets/images/marcas/youngla/hombre/jerdaniv.jpg',
      alt: 'Hombre',
    },
    className: 'large-horizontal',
  },
  {
    name: 'Accesorios',
    products: 24,
    href: '/accesorios',
    image: {
      src: '/assets/images/marcas/youngla/hombre/maletagym.png',
      alt: 'Accesorios',
    },
    className: 'small-square',
  },
  {
    name: 'Suplementos',
    products: 24,
    href: '/suplementos',
    image: {
      src: '/assets/images/marcas/raw/prewcb.jpg',
      alt: 'Suplementos',
    },
    className: 'small-square',
  },
  {
    name: 'Joyería',
    products: 24,
    href: '/joyeria',
    image: {
      src: '/assets/images/marcas/rgmnt/tridente.png',
      alt: 'Joyeria',
    },
    className: 'small-square',
  },
];

const CategoryGrid = () => {
  return (
    <section className="fitness-goals">
      <div className="goal-content">
        <h2>ZONA FIT GT</h2>
        <p>"Desata tu mejor versión con fuerza, estilo y elegancia. Adentrate a ZONA FIT GT y se tu mejor versión: donde tu energía se viste, se nutre y se luce."</p>
      </div>
      <div className="image-grid">
        {categories.map((category) => (
          <div
            key={category.name}
            className={`grid-item ${category.className}`}
          >
            <Image
              src={category.image.src}
              alt={category.image.alt}
              fill
              className="object-cover"
            />
            <div className="overlay-text">
              <h3>{category.name}</h3>
              <p>{category.products} productos</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
