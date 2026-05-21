import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const swipeVariants = {
  initial: {
    x: '100%',
  },
  animate: {
    x: ['100%', '0%', '-100%'],
    transition: {
      duration: 0.7, // Slightly faster for responsiveness
      ease: 'easeInOut' as const,
      times: [0, 0.4, 1], // Covers at 40% of duration
    },
  },
};

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Cuando el pathname cambia, ocultamos el contenido inmediatamente
    setIsVisible(false);
    
    // Esperamos a que la cortina roja esté en medio (aprox 280ms si el total es 700ms)
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname, children]);

  return (
    <div className="relative overflow-hidden min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {displayChildren}
        </motion.div>
      </AnimatePresence>

      <motion.div
        key={`swipe-${pathname}`}
        variants={swipeVariants}
        initial="initial"
        animate="animate"
        className="fixed top-0 left-0 w-full h-full bg-[#E50000] z-[9999] pointer-events-none"
        style={{ originX: 0 }}
      />
    </div>
  );
}
