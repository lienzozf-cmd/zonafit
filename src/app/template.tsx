'use client';

import { motion } from 'framer-motion';
import Curtain from '@/components/curtain';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Curtain />
      {children}
    </>
  );
}
