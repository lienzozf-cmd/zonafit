
'use client';

import { BadgeCheck, Truck, Users } from 'lucide-react';

const infoData = [
  {
    icon: <BadgeCheck className="h-6 w-6" />,
    title: 'Productos 100% Originales',
    description:
      'Garantizamos que cada producto en nuestra tienda es 100% auténtico, directamente de las mejores marcas de fitness del mundo.',
  },
  {
    icon: <Truck className="h-6 w-6" />,
    title: 'Envíos a toda Guatemala',
    description:
      'No importa dónde te encuentres, llevamos tu ropa, suplementos y accesorios de fitness hasta la puerta de tu casa.',
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Asesoría Personalizada',
    description:
      '¿No estás seguro de qué necesitas? Te ayudamos a elegir los productos perfectos para alcanzar tus metas de entrenamiento.',
  },
];

const InfoSection = () => {
  return (
    <section className="bg-black py-16 md:py-20 text-white relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/assets/images/diamond-bg.png")', backgroundSize: '100px' }} />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {infoData.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-5 p-6 sm:p-7 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 shadow-2xl hover:border-red-600/40 hover:shadow-[0_0_30px_rgba(220,38,38,0.2)] transition-all duration-300 group"
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white group-hover:scale-110 shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all duration-300">
                {item.icon}
              </div>
              
              <div className="flex flex-col text-left">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white uppercase group-hover:text-red-500 transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-medium leading-relaxed mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
    </section>
  );
};

export default InfoSection;
