import React, { useEffect, useState } from 'react';

const AtmosphericOverlay: React.FC = () => {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const count = 50;
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      left: `${Math.random() * 100}%`,
      bottom: `-${Math.random() * 20}%`,
      duration: `${15 + Math.random() * 20}s`,
      delay: `${Math.random() * 10}s`,
      blur: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle-point"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: p.left,
            bottom: p.bottom,
            animationDuration: p.duration,
            animationDelay: p.delay,
            filter: `blur(${p.blur}px)`,
            backgroundColor: Math.random() > 0.8 ? '#22d3ee' : '#fff', // 偶尔出现的青色晶体
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40" />
    </div>
  );
};

export default AtmosphericOverlay;