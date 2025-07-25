import Image from 'next/image';

const CategoryGrid = () => {
  return (
    <section className="fitness-goals">
      <div className="goal-content">
        <h2>ZONA FIT GT</h2>
        <p>"Desata tu mejor versión con fuerza, estilo y elegancia. Adentrate a ZONA FIT GT y se tu mejor versión: donde tu energía se viste, se nutre y se luce.".</p>
      </div>
      <div className="image-grid">
        <div className="grid-item large-vertical">
          <Image src="/assets/images/marcas/gymshark/mujer/anabelrojo2.jpg" alt="Mujer" width={500} height={1000} data-ai-hint="woman fitness" className="object-cover w-full h-full" />
          <div className="overlay-text">
            <h3>Mujer</h3>
            <p>47 productos</p>
          </div>
        </div>
        <div className="grid-item large-horizontal">
          <Image src="/assets/images/marcas/youngla/hombre/jerdaniv.jpg" alt="Hombre" width={1000} height={500} data-ai-hint="man fitness" className="object-cover w-full h-full" />
          <div className="overlay-text">
            <h3>Hombre</h3>
            <p>24 productos</p>
          </div>
        </div>
        <div className="grid-item small-square">
          <Image src="/assets/images/marcas/youngla/hombre/maletagym.png" alt="Accesorios" width={500} height={500} data-ai-hint="gym accessories" className="object-cover w-full h-full" />
          <div className="overlay-text">
            <h3>Accesorios</h3>
            <p>24 productos</p>
          </div>
        </div>
        <div className="grid-item small-square">
          <Image src="/assets/images/marcas/raw/prewcb.jpg" alt="Suplementos" width={500} height={500} data-ai-hint="supplements" className="object-cover w-full h-full" />
          <div className="overlay-text">
            <h3>Suplementos</h3>
            <p>24 productos</p>
          </div>
        </div>
        <div className="grid-item small-square">
          <Image src="/assets/images/marcas/rgmnt/tridente.png" alt="Joyeria" width={500} height={500} data-ai-hint="jewelry" className="object-cover w-full h-full" />
          <div className="overlay-text">
            <h3>Joyeria</h3>
            <p>24 productos</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
