'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface IntroAnimationProps {
  onIntroFinish: () => void;
}

const IntroAnimation = ({ onIntroFinish }: IntroAnimationProps) => {
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        // Fade out starts at 2.5 seconds (leaving 0.5s for the fade)
        const fadeTimer = setTimeout(() => {
            setIsFadingOut(true);
        }, 2500); 

        // Total duration is 3 seconds
        const removeTimer = setTimeout(() => {
            document.body.style.overflow = '';
            onIntroFinish();
        }, 3000); 

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
            document.body.style.overflow = '';
        };
    }, [onIntroFinish]);

    return (
        <div className={`intro-screen ${isFadingOut ? 'fade-out' : ''}`}>
            {/* Floating dots like Flor de Seul */}
            <div className="floating-dot" style={{ top: '20%', left: '15%', animationDelay: '0s' }}></div>
            <div className="floating-dot" style={{ top: '70%', left: '80%', animationDelay: '2s' }}></div>
            <div className="floating-dot" style={{ top: '40%', left: '85%', animationDelay: '4s' }}></div>
            
            <div className="gym-plate-container">
                <Image
                    src="/assets/images/gym-plate-custom.png"
                    alt="Zona Fit Plate"
                    width={400}
                    height={400}
                    className="gym-plate"
                    unoptimized
                    priority
                />
                
                <div className="intro-text-container">
                    <h1 className="intro-title">
                        <span className="zona">ZONA</span>
                        <span className="fit">FIT</span>
                    </h1>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <p className="intro-subtitle">LA ZONA MAS FIT DE GUATEMALA</p>
                    
                    <div className="loading-bar">
                        <div className="loading-progress" style={{ animationDuration: '3s' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntroAnimation;
