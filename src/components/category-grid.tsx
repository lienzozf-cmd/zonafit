import Image from 'next/image';

const CategoryGrid = () => {
  return (
    <section className="fitness-goals">
      <div className="goal-content">
        <h2>ZONA FIT GT</h2>
        <p>"Desata tu mejor versión con fuerza, estilo y elegancia. Adentrate a ZONA FIT GT y se tu mejor versión: donde tu energía se viste, se nutre y se luce.".</p>
      </div>
      <div className="image-grid">
        <div className="grid-row">
            <div className="grid-item mujer">
              <Image src="/assets/images/marcas/gymshark/mujer/anabelrojo2.jpg" alt="Mujer" width={600} height={600} data-ai-hint="woman fitness" className="object-cover w-full h-full" />
              <div className="overlay-text">
                <h3>Mujer</h3>
                <p>47 productos</p>
              </div>
            </div>
            <div className="grid-item hombre">
              <Image src="/assets/images/marcas/youngla/hombre/jerdaniv.jpg" alt="Hombre" width={600} height={600} data-ai-hint="man fitness" className="object-cover w-full h-full" />
              <div className="overlay-text">
                <h3>Hombre</h3>
                <p>24 productos</p>
              </div>
            </div>
        </div>
        <div className="grid-row">
            <div className="grid-item accesorios">
              <Image src="/assets/images/marcas/youngla/hombre/maletagym.png" alt="Accesorios" width={400} height={400} data-ai-hint="gym accessories" className="object-cover w-full h-full" />
              <div className="overlay-text">
                <h3>Accesorios</h3>
                <p>24 productos</p>
              </div>
            </div>
            <div className="grid-item suplementos">
              <Image src="/assets/images/marcas/raw/prewcb.jpg" alt="Suplementos" width={400} height={400} data-ai-hint="supplements" className="object-cover w-full h-full" />
              <div className="overlay-text">
                <h3>Suplementos</h3>
                <p>24 productos</p>
              </div>
            </div>
            <div className="grid-item joyeria">
                <Image src="/assets/images/marcas/rgmnt/tridente.png" alt="Joyeria" width={400} height={400} data-ai-hint="jewelry" className="object-cover w-full h-full" />
                <div className="overlay-text">
                    <h3>Joyeria</h3>
                    <p>24 productos</p>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
