'use client';

import { motion } from 'framer-motion';

const Curtain = () => {
  return (
    <motion.div
      initial={{ x: 0 }}
      animate={{ x: '-100%' }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'hsl(var(--background))',
        zIndex: 9998, 
      }}
    />
  );
};

export default Curtain;
