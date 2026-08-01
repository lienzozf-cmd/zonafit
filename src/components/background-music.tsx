'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showUI, setShowUI] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let targetSrc = '/Numb (Instrumental) - Linkin Park.mp3';

    if (pathname.startsWith('/mujeres')) {
      targetSrc = '/Justin Bieber - Beauty And A Beat ft. Nicki Minaj (Official Audio).mp3';
    } else if (pathname === '/product/2664' || pathname === '/product/2665') {
      targetSrc = '/DAVID LAID - Outside GYM MOTIVATION.mp3';
    } else if (pathname.startsWith('/product/')) {
      // Do nothing, let the custom event handle product page loads
      return;
    }

    const currentRelativeSrc = audio.getAttribute('src');
    if (currentRelativeSrc !== targetSrc) {
      audio.src = targetSrc;
      audio.load();
      if (isPlaying) {
        audio.play().catch(() => {});
      }
    }
  }, [pathname, isPlaying]);

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

    const handlePlayEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      const gender = customEvent.detail?.gender;
      const productId = customEvent.detail?.productId;
      
      let targetSrc = '/Numb (Instrumental) - Linkin Park.mp3';

      if (productId === 2664 || productId === 2665) {
        targetSrc = '/DAVID LAID - Outside GYM MOTIVATION.mp3';
      } else if (gender === 'mujer') {
        targetSrc = '/Justin Bieber - Beauty And A Beat ft. Nicki Minaj (Official Audio).mp3';
      }

      audio.muted = false;
      
      const currentRelativeSrc = audio.getAttribute('src');
      if (currentRelativeSrc !== targetSrc) {
        audio.src = targetSrc;
        audio.load();
        audio.play().catch(() => {});
      } else if (audio.paused) {
        audio.play().catch(() => {});
      }
    };

    window.addEventListener('play-music', handlePlayEvent);

    window.addEventListener('mousemove', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });
    window.addEventListener('pointerdown', unlockAudio, { once: true });

    return () => {
      clearTimeout(uiTimer);
      window.removeEventListener('play-music', handlePlayEvent as EventListener);
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
      <audio ref={audioRef} src="/Numb (Instrumental) - Linkin Park.mp3" loop playsInline />

      <AnimatePresence>
        {showUI && (
          <motion.button
            onClick={toggle}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1, backgroundColor: '#ffd700' }}
            whileTap={{ scale: 0.95 }}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 border border-yellow-300 text-black shadow-[0_0_15px_rgba(234,179,8,0.6)] cursor-pointer"
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
