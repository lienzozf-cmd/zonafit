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

        const fadeTimer = setTimeout(() => {
            setIsFadingOut(true);
        }, 2500);

        const removeTimer = setTimeout(() => {
            document.body.style.overflow = '';
            onIntroFinish();
        }, 3500); // 1s for fade out animation

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
