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

        // Reduced fade-out timer from 2.5s to 1.5s
        const fadeTimer = setTimeout(() => {
            setIsFadingOut(true);
        }, 1500); 

        // Reduced total duration from 3.5s to 2.5s
        const removeTimer = setTimeout(() => {
            document.body.style.overflow = '';
            onIntroFinish();
        }, 2500); 

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
            // Ensure body overflow is reset if component unmounts early
            document.body.style.overflow = '';
        };
    }, [onIntroFinish]);

    return (
        <div className={`intro-screen ${isFadingOut ? 'fade-out' : ''}`}>
            <div className="intro-logo-container">
                <div className="gun-barrel"></div>
                <div className="gun-flash"></div>
                <Image
                    src="/assets/images/logos/logo.png"
                    alt="Zona Fit Logo"
                    width={160}
                    height={160}
                    className="intro-logo"
                    unoptimized
                    priority
                />
            </div>
            <div className="loading-bar">
                <div className="loading-progress"></div>
            </div>
        </div>
    );
};

export default IntroAnimation;
