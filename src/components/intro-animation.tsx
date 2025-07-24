'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const IntroAnimation = () => {
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
            }, 3500); // 1s for fade out animation

            return () => {
                clearTimeout(fadeTimer);
                clearTimeout(removeTimer);
            };
        }
    }, []);

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
