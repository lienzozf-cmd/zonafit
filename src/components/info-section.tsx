
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
    <section className="bg-transparent py-16 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-3">
          {infoData.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent text-accent-foreground">
                {item.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
              <p className="max-w-xs text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
