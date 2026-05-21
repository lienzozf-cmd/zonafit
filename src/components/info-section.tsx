
'use client';

import { BadgeCheck, Truck, Users } from 'lucide-react';

const infoData = [
  {
    icon: <BadgeCheck className="h-10 w-10" />,
    title: 'Productos 100% Originales',
    description:
      'Garantizamos que cada producto en nuestra tienda es 100% auténtico, directamente de las mejores marcas de fitness del mundo.',
  },
  {
    icon: <Truck className="h-10 w-10" />,
    title: 'Envíos a toda Guatemala',
    description:
      'No importa dónde te encuentres, llevamos tu ropa, suplementos y accesorios de fitness hasta la puerta de tu casa.',
  },
  {
    icon: <Users className="h-10 w-10" />,
    title: 'Asesoría Personalizada',
    description:
      '¿No estás seguro de qué necesitas? Te ayudamos a elegir los productos perfectos para alcanzar tus metas de entrenamiento.',
  },
];

const InfoSection = () => {
  return (
    <section className="bg-black py-24 text-white relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("/assets/images/diamond-bg.png")', backgroundSize: '100px' }} />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
          {infoData.map((item, index) => (
            <div key={index} className="flex flex-col items-center group transition-all duration-500 hover:transform hover:-translate-y-2">
              <div className="mb-8 relative">
                {/* Glow effect behind icon */}
                <div className="absolute inset-0 bg-red-600 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
                
                <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-red-600 shadow-2xl group-hover:border-red-600/50 group-hover:text-red-500 transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                  {item.icon}
                </div>
              </div>
              
              <h3 className="mb-4 text-2xl font-black tracking-tight text-white uppercase group-hover:text-red-600 transition-colors duration-300">
                {item.title}
              </h3>
              
              <div className="h-px w-12 bg-red-600/30 mb-4 group-hover:w-20 transition-all duration-500" />
              
              <p className="max-w-[280px] text-zinc-500 text-center text-sm sm:text-base leading-relaxed group-hover:text-zinc-400 transition-colors duration-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
    </section>
  );
};

export default InfoSection;
