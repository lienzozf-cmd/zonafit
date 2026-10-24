'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface IntroAnimationProps {
  onIntroFinish: () => void;
}

const IntroAnimation = ({ onIntroFinish }: IntroAnimationProps) => {
    const [isFadingOut, setIsFadingOut] = useState(false);

    const finish = useCallback(() => {
        document.body.style.overflow = '';
        onIntroFinish();
    }, [onIntroFinish]);

    const skipIntro = useCallback(() => {
        setIsFadingOut(true);
        setTimeout(finish, 250);
    }, [finish]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        // Duration: 2.0s full display before fading out
        const fadeTimer = setTimeout(() => {
            setIsFadingOut(true);
        }, 2000);

        // Finishes cleanly after 0.4s fade out (2.4s total)
        const removeTimer = setTimeout(() => {
            finish();
        }, 2400);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
            document.body.style.overflow = '';
        };
    }, [finish]);

    return (
        <div 
            className={`intro-screen ${isFadingOut ? 'fade-out' : ''}`}
            onClick={skipIntro}
            role="button"
            tabIndex={0}
            aria-label="Pantalla de bienvenida - Toca para entrar"
        >
            {/* Botón Saltar */}
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    skipIntro();
                }}
                className="absolute top-6 right-6 z-50 px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-950/80 backdrop-blur-md text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-red-600 hover:bg-red-600/10 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,0,0,0.5)] cursor-pointer"
            >
                <span>Saltar</span>
                <span className="text-red-500 font-bold">→</span>
            </button>

            {/* Floating dots neon glow */}
            <div className="floating-dot" style={{ top: '20%', left: '15%', animationDelay: '0s' }}></div>
            <div className="floating-dot" style={{ top: '70%', left: '80%', animationDelay: '1s' }}></div>
            <div className="floating-dot" style={{ top: '40%', left: '85%', animationDelay: '2s' }}></div>
            
            <div className="gym-plate-container">
                <Image
                    src="/assets/images/gym-plate-custom.webp"
                    alt="Zona Fit Plate"
                    width={320}
                    height={320}
                    className="gym-plate"
                    priority
                />
                
                <div className="intro-text-container">
                    <h1 className="intro-title">
                        <span className="zona">ZONA</span>
                        <span className="fit">FIT</span>
                    </h1>
                    <p className="intro-subtitle">LA ZONA MAS FIT DE GUATEMALA</p>
                    
                    <div className="loading-bar">
                        <div className="loading-progress" style={{ animationDuration: '2s' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntroAnimation;
