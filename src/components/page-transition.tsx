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

  return (
    <div className="relative min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
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
