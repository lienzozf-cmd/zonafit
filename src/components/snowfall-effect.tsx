'use client';

import { useEffect, useState }from 'react';

interface SnowfallEffectProps {
  snowflakeCount?: number;
}

const SnowfallEffect = ({ snowflakeCount = 150 }: SnowfallEffectProps) => {
  const [snowflakes, setSnowflakes] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const createSnowflakes = () => {
      const newSnowflakes = Array.from({ length: snowflakeCount }).map((_, i) => {
        const style = {
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${5 + Math.random() * 5}s`,
          left: `${Math.random() * 100}vw`,
          fontSize: `${10 + Math.random() * 10}px`,
          opacity: Math.random(),
        };
        return <div key={i} className="snowflake" style={style}>❄</div>;
      });
      setSnowflakes(newSnowflakes);
    };

    createSnowflakes();
  }, [snowflakeCount]);

  return <div className="snowfall-container">{snowflakes}</div>;
};

export default SnowfallEffect;
