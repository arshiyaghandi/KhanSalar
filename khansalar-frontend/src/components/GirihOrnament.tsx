import React from 'react';

interface GirihOrnamentProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const ShamsehStar: React.FC<GirihOrnamentProps> = ({ 
  className = "text-khansalar-gold", 
  size = 40,
  glow = true 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${glow ? 'drop-shadow-[0_0_8px_rgba(229,184,105,0.4)]' : ''}`}
    >
      {/* Outer 8-pointed star points */}
      <polygon 
        points="50,5 61,35 95,50 61,65 50,95 39,65 5,50 39,35" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        fill="rgba(10, 26, 59, 0.6)"
      />
      {/* Secondary rotated 8-pointed star */}
      <polygon 
        points="50,15 75,25 85,50 75,75 50,85 25,75 15,50 25,25" 
        stroke="#00c8b3" 
        strokeWidth="1.8" 
        strokeDasharray="2 2"
      />
      {/* Central Inner Medallion */}
      <circle cx="50" cy="50" r="14" stroke="currentColor" strokeWidth="2" fill="#071530" />
      <circle cx="50" cy="50" r="8" fill="#e5b869" fillOpacity="0.8" />
    </svg>
  );
};

export const CornerArabesque: React.FC<{ className?: string; position?: 'tr' | 'tl' | 'br' | 'bl' }> = ({
  className = "text-khansalar-gold/30",
  position = 'tr'
}) => {
  const transform = {
    tr: '',
    tl: 'scaleX(-1)',
    br: 'scaleY(-1)',
    bl: 'scale(-1, -1)'
  }[position];

  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute pointer-events-none ${className}`}
      style={{ transform }}
    >
      <path
        d="M44 4C44 26.0914 26.0914 44 4 44M44 4H20M44 4V20M40 8C40 22 22 40 8 40"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="36" cy="12" r="2" fill="currentColor" />
    </svg>
  );
};
