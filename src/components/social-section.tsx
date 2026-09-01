'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SocialLink {
  href: string;
  name: string;
  label: string;
  color: string;
  glowColor: string;
  badge: string;
  path: string;
}

const socialLinks: SocialLink[] = [
  {
    href: "https://wa.me/50237331442",
    name: "WhatsApp",
    label: "WhatsApp",
    badge: "Chat Directo",
    color: "#25D366",
    glowColor: "rgba(37, 211, 102, 0.6)",
    path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
  },
  {
    href: "https://www.tiktok.com/@zonafitgt_",
    name: "TikTok",
    label: "TikTok",
    badge: "@zonafitgt_",
    color: "#00F2FE",
    glowColor: "rgba(0, 242, 254, 0.6)",
    path: "M12.525.02c1.31-.032 2.61-.019 3.91-.01.17 1.15.63 2.21 1.41 3.08.84.82 1.88 1.4 3.04 1.59v3.62c-1.31-.02-2.58-.46-3.63-1.22-.55-.4-1.01-.91-1.37-1.5-.02 3.19.01 6.38-.02 9.57-.04 1.55-.41 3.09-1.12 4.47-.85 1.59-2.22 2.86-3.88 3.51-1.89.77-4.04.85-5.96.22-1.85-.59-3.48-1.92-4.45-3.61C-.04 17.15-.17 14.3.43 11.66c.55-2.28 2-4.32 3.99-5.6 1.49-.96 3.23-1.46 5-1.42.02 1.34-.01 2.68.01 4.02-1.07-.15-2.21.09-3.11.75-.92.64-1.52 1.66-1.68 2.78-.26 1.18.06 2.48.81 3.42.75.98 1.95 1.57 3.18 1.63 1.35.08 2.76-.51 3.52-1.66.45-.63.68-1.39.67-2.16V.02h-.01z"
  },
  {
    href: "https://www.instagram.com/zonafitgt_/",
    name: "Instagram",
    label: "Instagram",
    badge: "@zonafitgt_",
    color: "#E1306C",
    glowColor: "rgba(225, 48, 108, 0.6)",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.981 1.28.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.668-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
  },
  {
    href: "https://www.facebook.com/people/Zona-Fit-Gt/pfbid02mXkKgdqTS4t2eLj6px4tNXH9L4BJtQ1DJJbsPbyguE3nN3F5hU6wSHuJ7n9p4Sfl/",
    name: "Facebook",
    label: "Facebook",
    badge: "Zona Fit Gt",
    color: "#1877F2",
    glowColor: "rgba(24, 119, 242, 0.6)",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
  }
];

const SocialSection = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <motion.aside
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Redes Sociales"
      className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2.5 p-2 bg-black/80 backdrop-blur-xl border border-white/10 border-l-0 rounded-r-2xl shadow-[0_8px_32px_rgba(0,0,0,0.7)]"
    >
      {/* Decorative accent light bar */}
      <div className="absolute top-2 bottom-2 left-0 w-[2px] bg-gradient-to-b from-transparent via-red-600 to-transparent opacity-80" />

      {socialLinks.map((link, idx) => {
        const isHovered = hoveredIdx === idx;
        return (
          <div key={link.name} className="relative flex items-center">
            <motion.a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              whileHover={{ scale: 1.18, x: 3 }}
              whileTap={{ scale: 0.95 }}
              animate={
                hoveredIdx === null
                  ? {
                      scale: [1, 1.04, 1],
                      transition: {
                        duration: 3,
                        repeat: Infinity,
                        delay: idx * 0.4,
                        ease: "easeInOut"
                      }
                    }
                  : {}
              }
              className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900/90 border border-zinc-800 transition-colors duration-300 group overflow-visible"
              style={{
                boxShadow: isHovered
                  ? `0 0 16px ${link.glowColor}, inset 0 0 8px ${link.glowColor}`
                  : '0 2px 8px rgba(0,0,0,0.4)'
              }}
            >
              {/* Animated hover background pulse */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
                style={{ backgroundColor: link.color }}
              />

              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 transition-all duration-300"
                style={{
                  fill: link.color,
                  filter: isHovered
                    ? `drop-shadow(0 0 8px ${link.color}) drop-shadow(0 0 16px ${link.glowColor})`
                    : `drop-shadow(0 1px 2px rgba(0,0,0,0.5))`
                }}
              >
                <path d={link.path} />
              </svg>
            </motion.a>

            {/* Floating Tooltip Pill that slides out on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: -8, scale: 0.9 }}
                  animate={{ opacity: 1, x: 10, scale: 1 }}
                  exit={{ opacity: 0, x: -6, scale: 0.9 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute left-full top-1/2 -translate-y-1/2 z-50 pointer-events-none whitespace-nowrap"
                >
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950/95 border border-zinc-700/80 shadow-2xl backdrop-blur-md"
                    style={{
                      borderLeftColor: link.color,
                      borderLeftWidth: '3px',
                      boxShadow: `0 8px 24px rgba(0,0,0,0.8), 0 0 12px ${link.glowColor}`
                    }}
                  >
                    <span className="text-xs font-black text-white uppercase tracking-wider">
                      {link.label}
                    </span>
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: `${link.color}22`,
                        color: link.color
                      }}
                    >
                      {link.badge}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </motion.aside>
  );
};

export default SocialSection;
