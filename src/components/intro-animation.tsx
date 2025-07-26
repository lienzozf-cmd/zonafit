'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface IntroAnimationProps {
  onIntroFinish: () => void;
}

const IntroAnimation = ({ onIntroFinish }: IntroAnimationProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        const introShown = sessionStorage.getItem('introShown');
        if (!introShown) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';

            const fadeTimer = setTimeout(() => {
                setIsFadingOut(true);
            }, 2500);

            const removeTimer = setTimeout(() => {
                setIsVisible(false);
                document.body.style.overflow = '';
                sessionStorage.setItem('introShown', 'true');
                onIntroFinish();
            }, 3500); // 1s for fade out animation

            return () => {
                clearTimeout(fadeTimer);
                clearTimeout(removeTimer);
            };
        } else {
            onIntroFinish();
        }
    }, [onIntroFinish]);

    if (!isVisible) {
        return null;
    }

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
            <div className="intro-text">ZONA FIT GT</div>
        </div>
    );
};

export default IntroAnimation;
