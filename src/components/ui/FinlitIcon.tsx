import type { SVGProps } from 'react';

export function FinlitIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <style>
        {`
          @keyframes coinFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-1.5px); }
          }
          @keyframes sparkleTwinkle {
            0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
            50% { transform: scale(0.4) rotate(45deg); opacity: 0.3; }
          }
          @keyframes shineSweep {
            0%, 20% { transform: translateX(-15px) skewX(-45deg); }
            80%, 100% { transform: translateX(45px) skewX(-45deg); }
          }
          .finlit-coin-group {
            animation: coinFloat 3s ease-in-out infinite;
            transform-origin: center;
          }
          .finlit-sparkle-1 {
            animation: sparkleTwinkle 2s ease-in-out infinite;
            transform-origin: 17px 7px;
          }
          .finlit-sparkle-2 {
            animation: sparkleTwinkle 2.5s ease-in-out infinite 1s;
            transform-origin: 6.5px 15.5px;
          }
          .finlit-shine {
            animation: shineSweep 4s ease-in-out infinite;
          }
        `}
      </style>
      <defs>
        <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="coinRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
        <filter id="coinShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.25" />
        </filter>
        <filter id="sparkleGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="1" floodColor="#FFFFFF" floodOpacity="0.8" />
        </filter>
        <clipPath id="coinClip">
          <circle cx="12" cy="12" r="11" />
        </clipPath>
      </defs>

      <g className="finlit-coin-group" filter="url(#coinShadow)">
        {/* Outer Rim */}
        <circle cx="12" cy="12" r="11" fill="url(#coinRimGrad)" />
        {/* Inner Coin */}
        <circle cx="12" cy="12" r="9" fill="url(#coinGrad)" stroke="#B45309" strokeWidth="0.5" />
        
        {/* Dollar Sign */}
        <g stroke="#FEF3C7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" transform="scale(0.6) translate(8, 8)">
          <path d="M12 2v20" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </g>
        
        {/* Shimmering glass sweep overlay */}
        <g clipPath="url(#coinClip)">
          <rect className="finlit-shine" x="0" y="-5" width="8" height="34" fill="rgba(255,255,255,0.4)" />
        </g>

        {/* Twinkling Sparkles */}
        <path className="finlit-sparkle-1" d="M16 6 L17 4 L18 6 L20 7 L18 8 L17 10 L16 8 L14 7 Z" fill="#FFFFFF" filter="url(#sparkleGlow)" />
        <path className="finlit-sparkle-2" d="M6 15 L6.5 14 L7 15 L8 15.5 L7 16 L6.5 17 L6 16 L5 15.5 Z" fill="#FFFFFF" filter="url(#sparkleGlow)" opacity="0.9" />
      </g>
    </svg>
  );
}
