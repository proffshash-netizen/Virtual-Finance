import { memo } from 'react';

/**
 * AnimatedClouds
 * Pure CSS transform-based cloud system that loops seamlessly.
 * Separated into distinct parallax depth layers.
 */
export const AnimatedClouds = memo(({ isFirstVisit }: { isFirstVisit: boolean }) => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" style={{ willChange: 'transform' }}>
      <div 
        className="absolute inset-0 transition-opacity duration-[1000ms] ease-in-out" 
        style={{ opacity: isFirstVisit ? 0 : 1, animation: isFirstVisit ? 'fadeIn 1s ease-in-out 0.3s forwards' : 'none' }}
      >
        <style>
          {`@keyframes fadeIn { to { opacity: 1; } }`}
        </style>
        {/* Sky Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#4CB1F6] via-[#7DD0FF] to-[#D5F2FF] parallax-layer-sky"></div>
        
        {/* Sunburst / Sun Rays */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none parallax-layer-sky">
          <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,255,255,0.4)_0%,transparent_70%)] rounded-full animate-pulse opacity-80 mix-blend-overlay"></div>
          {/* Light shafts */}
          <div className="absolute top-0 right-[5%] w-[400px] h-[1200px] bg-gradient-to-b from-white/30 to-transparent transform rotate-[-30deg] origin-top opacity-50 blur-[10px]"></div>
          <div className="absolute top-[10%] right-[15%] w-[300px] h-[1000px] bg-gradient-to-b from-white/20 to-transparent transform rotate-[-45deg] origin-top opacity-30 blur-[20px]"></div>
        </div>

        {/* Crisp Sun */}
        <div className="absolute top-[15%] right-[12%] w-[120px] h-[120px] bg-[#FFF2B2] rounded-full shadow-[0_0_80px_rgba(255,255,255,1)] parallax-layer-sky"></div>

        {/* Cloud Component Helper */}
        {(() => {
          const Cloud = ({ className, size = 1 }: { className?: string, size?: number }) => (
            <div className={`absolute ${className}`} style={{ transform: `scale(${size})` }}>
              <div className="relative w-[120px] h-[40px]">
                {/* Base */}
                <div className="absolute bottom-0 left-0 w-full h-[30px] bg-white rounded-full"></div>
                {/* Fluffs */}
                <div className="absolute bottom-[10px] left-[20px] w-[50px] h-[50px] bg-white rounded-full"></div>
                <div className="absolute bottom-[15px] left-[55px] w-[40px] h-[40px] bg-white rounded-full"></div>
              </div>
            </div>
          );
          return (
            <>
              {/* Layer 1: Distant Slow Clouds */}
              <div className="absolute inset-0 opacity-40 parallax-layer-distant">
                <div className="absolute top-[10%] w-[200%] h-[150px] animate-cloud-drift" style={{ animationDuration: '100s' }}>
                  <Cloud className="left-[10%]" size={0.6} />
                  <Cloud className="left-[40%]" size={0.7} />
                  <Cloud className="left-[80%]" size={0.5} />
                  <Cloud className="left-[120%]" size={0.8} />
                </div>
              </div>

              {/* Layer 2: Medium Clouds */}
              <div className="absolute inset-0 opacity-60 parallax-layer-mid">
                <div className="absolute top-[20%] w-[200%] h-[120px] animate-cloud-drift" style={{ animationDuration: '70s', animationDelay: '-15s' }}>
                  <Cloud className="left-[25%]" size={1} />
                  <Cloud className="left-[65%]" size={1.2} />
                  <Cloud className="left-[110%]" size={0.9} />
                </div>
              </div>

              {/* Layer 3: Foreground Faster Clouds */}
              <div className="absolute inset-0 opacity-90 parallax-layer-foreground">
                <div className="absolute top-[40%] w-[200%] h-[100px] animate-cloud-drift" style={{ animationDuration: '45s', animationDelay: '-5s' }}>
                  <Cloud className="left-[5%]" size={1.5} />
                  <Cloud className="left-[55%]" size={1.8} />
                  <Cloud className="left-[130%]" size={1.4} />
                </div>
              </div>
            </>
          );
        })()}
        
        {/* Distant Hills */}
        <div className="absolute bottom-0 left-0 w-full h-[60%] bg-[#448A27]/20 rounded-t-[100%] scale-150 translate-y-[20%] parallax-layer-mid"></div>
        
        {/* Midground Hills */}
        <div className="absolute bottom-0 left-[-20%] w-[140%] h-[40%] bg-[#65B93E]/30 rounded-t-[100%] translate-y-[10%] parallax-layer-foreground"></div>
        
        {/* Foreground Base */}
        <div className="absolute bottom-0 left-0 w-full h-[20%] bg-gradient-to-t from-[#448A27] to-[#65B93E] parallax-layer-hero"></div>
      </div>
    </div>
  );
});

AnimatedClouds.displayName = 'AnimatedClouds';
