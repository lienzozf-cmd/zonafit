'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showUI, setShowUI] = useState(false);

  useEffect(() => {
    const uiTimer = setTimeout(() => setShowUI(true), 3500);

    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.4;
    audio.muted = true; // Start muted — browsers ALWAYS allow this

    // Sync button icon with real audio state
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));

    // Start playing immediately (muted — always allowed by Chrome)
    audio.play().catch(() => {});

    // KEY TRICK: Changing .muted on an already-playing audio does NOT
    // require a user gesture — only the initial play() does.
    // So mousemove CAN unmute without any Chrome restriction!
    let unlocked = false;
    const unlockAudio = () => {
      if (unlocked) return;
      unlocked = true;
      audio.muted = false; // No user gesture needed — audio already playing!
      window.removeEventListener('mousemove', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('pointerdown', unlockAudio);
    };

    window.addEventListener('mousemove', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });
    window.addEventListener('pointerdown', unlockAudio, { once: true });

    return () => {
      clearTimeout(uiTimer);
      window.removeEventListener('mousemove', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('pointerdown', unlockAudio);
    };
  }, []);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    // Make sure it's unmuted first
    audio.muted = false;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] pointer-events-none">
      <audio ref={audioRef} src="/background-music.mp3" loop playsInline />

      <AnimatePresence>
        {showUI && (
          <motion.button
            onClick={toggle}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.35)' }}
            whileTap={{ scale: 0.95 }}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-black shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
            title={isPlaying ? 'Silenciar música' : 'Activar música'}
          >
            <AnimatePresence mode="wait">
              {isPlaying ? (
                <motion.div
                  key="on"
                  initial={{ opacity: 0, rotate: -15 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 15 }}
                  transition={{ duration: 0.15 }}
                >
                  <Volume2 size={18} />
                </motion.div>
              ) : (
                <motion.div
                  key="off"
                  initial={{ opacity: 0, rotate: -15 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 15 }}
                  transition={{ duration: 0.15 }}
                >
                  <VolumeX size={18} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BackgroundMusic;
