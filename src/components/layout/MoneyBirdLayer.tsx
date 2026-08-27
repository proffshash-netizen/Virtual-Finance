import { useEffect, useRef } from 'react';

const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

class BirdFlightEngine {
  el: HTMLDivElement;
  chirpEl: HTMLDivElement;
  isActive = true;
  x = -20;
  y = 0;
  targetX = 0;
  targetY = 0;
  speed = 0.05;
  facingRight = true;
  startBias: 'top' | 'bottom';
  phase: 'waiting' | 'flying' = 'waiting';
  waitTimer = 0;
  rot = 0;
  
  waypoints: {x: number, y: number}[] = [];
  currentWaypointIdx = 0;

  constructor(el: HTMLDivElement, chirpEl: HTMLDivElement, startBias: 'top' | 'bottom', initialDelay: number) {
    this.el = el;
    this.chirpEl = chirpEl;
    this.startBias = startBias;
    this.waitTimer = initialDelay;
    this.updateDOM();
  }

  generatePath() {
    this.facingRight = Math.random() > 0.5;
    const useTopBias = (this.startBias === 'top' && Math.random() > 0.2) || (this.startBias === 'bottom' && Math.random() < 0.2);
    
    const startY = useTopBias ? randomInRange(10, 45) : randomInRange(55, 85);
    const startX = this.facingRight ? -20 : 120;
    const endX = this.facingRight ? 120 : -20;

    this.x = startX;
    this.y = startY;

    this.waypoints = [];
    const numWaypoints = Math.floor(randomInRange(5, 8));
    const stepX = (endX - startX) / numWaypoints;

    let currentY = startY;
    for (let i = 1; i <= numWaypoints; i++) {
      const wX = startX + stepX * i;
      const yShift = randomInRange(-25, 25);
      currentY = Math.max(5, Math.min(90, currentY + yShift));
      this.waypoints.push({ x: wX, y: currentY });
    }

    this.currentWaypointIdx = 0;
    this.targetX = this.waypoints[0].x;
    this.targetY = this.waypoints[0].y;
    this.speed = randomInRange(0.08, 0.15); // increased organic speeds
    this.rot = 0;
    
    this.updateDOM();
  }

  update(dt: number) {
    if (!this.isActive) return;

    if (this.phase === 'waiting') {
      this.waitTimer -= dt;
      if (this.waitTimer <= 0) {
        this.generatePath();
        this.phase = 'flying';
      }
      return;
    }

    if (this.phase === 'flying') {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 1) { // reached waypoint
        this.currentWaypointIdx++;
        if (this.currentWaypointIdx >= this.waypoints.length) {
          // Flight complete
          this.phase = 'waiting';
          this.waitTimer = randomInRange(500, 2500); // Wait outside viewport
          return;
        } else {
          this.targetX = this.waypoints[this.currentWaypointIdx].x;
          this.targetY = this.waypoints[this.currentWaypointIdx].y;
        }
      }

      // Safe normalization
      const ndx = dist > 0 ? dx / dist : 0;
      const ndy = dist > 0 ? dy / dist : 0;

      // dt is roughly 16ms for 60fps. speed = vw per 16ms
      const moveDist = (this.speed / 16) * dt; 
      
      this.x += ndx * moveDist;
      this.y += ndy * moveDist;

      // Calculate banking/rotation based on vertical movement direction
      let targetRot = ndy * 25; 
      targetRot = Math.max(-20, Math.min(20, targetRot));
      
      this.rot = lerp(this.rot, targetRot, 0.1);

      this.updateDOM();
    }
  }

  updateDOM() {
    const finalRot = this.facingRight ? this.rot : -this.rot;
    const scale = this.facingRight ? 1 : -1;
    this.el.style.transform = `translate3d(${this.x}vw, ${this.y}vh, 0) rotate(${finalRot}deg) scaleX(${scale})`;
    this.chirpEl.style.transform = `scaleX(${scale})`;
  }

  destroy() {
    this.isActive = false;
  }
}

export function MoneyBirdLayer() {
  const bird1Ref = useRef<HTMLDivElement>(null);
  const chirp1Ref = useRef<HTMLDivElement>(null);
  
  const bird2Ref = useRef<HTMLDivElement>(null);
  const chirp2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bird1Ref.current || !bird2Ref.current || !chirp1Ref.current || !chirp2Ref.current) return;

    // Initialize the two birds independently
    const engine1 = new BirdFlightEngine(bird1Ref.current, chirp1Ref.current, 'top', 0);
    const engine2 = new BirdFlightEngine(bird2Ref.current, chirp2Ref.current, 'bottom', 1500);

    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;

      // clamp dt to avoid massive teleportation when returning to an inactive browser tab
      const clampedDt = Math.min(dt, 50);

      engine1.update(clampedDt);
      engine2.update(clampedDt);

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      engine1.destroy();
      engine2.destroy();
    };
  }, []);

  const BirdSVG = () => (
    <div className="w-24 h-24 relative flex items-center justify-center pointer-events-none">
      <svg viewBox="0 0 100 100" className="w-32 h-32 drop-shadow-lg">
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF7B0" />
            <stop offset="40%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
          <style>
            {`
              .wing-front { transform-origin: 50px 50px; animation: flapFront 0.15s infinite ease-in-out alternate; }
              .wing-back { transform-origin: 50px 50px; animation: flapBack 0.15s infinite ease-in-out alternate; }
              @keyframes flapFront { 0% { transform: rotate(-40deg) scaleY(1); } 100% { transform: rotate(50deg) scaleY(-0.3); } }
              @keyframes flapBack { 0% { transform: rotate(-30deg) scaleY(1); } 100% { transform: rotate(60deg) scaleY(-0.2); } }
              .body-bounce { animation: birdBounce 0.2s infinite ease-in-out alternate; }
              @keyframes birdBounce { 0% { transform: translateY(-2px); } 100% { transform: translateY(2px); } }
              .coin-shimmer { animation: shimmer 2s infinite ease-in-out alternate; }
              @keyframes shimmer { 0% { filter: brightness(1); } 100% { filter: brightness(1.2); } }
              .chirp-anim { animation: chirpFade 5s infinite; }
              @keyframes chirpFade { 0%, 90%, 100% { opacity: 0; transform: scale(0.5); } 95% { opacity: 1; transform: scale(1); } }
            `}
          </style>
        </defs>
        <g className="body-bounce">
          <path className="wing-back" d="M 45 48 C 30 15, 70 5, 75 40 Z" fill="#654321" opacity="0.9"/>
          <path d="M 32 52 L 5 42 L 15 65 L 30 58 Z" fill="#654321" />
          <ellipse cx="50" cy="55" rx="22" ry="14" fill="#8B5A2B" />
          <path d="M 32 62 C 45 72, 68 64, 70 52 C 60 65, 40 66, 32 62 Z" fill="#DEB887" />
          <circle cx="68" cy="44" r="11" fill="#8B5A2B" />
          <ellipse cx="71" cy="48" rx="4" ry="3" fill="#F5DEB3" />
          <path d="M 76 43 L 88 44 L 76 47 Z" fill="#4A4A4A" />
          
          <g className="coin-shimmer" transform="translate(83, 35)">
            <circle cx="8" cy="8" r="8" fill="url(#goldGradient)" stroke="#B8860B" strokeWidth="1" />
            <circle cx="8" cy="8" r="6" fill="none" stroke="#FFDF00" strokeWidth="0.75" opacity="0.6" />
            <text x="8" y="11.5" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="900" fill="#B8860B" textAnchor="middle" transform="scale(0.9, 1.1) translate(0.5, -0.5)">$</text>
          </g>
          
          <circle cx="72" cy="41" r="1.8" fill="#000" />
          <circle cx="72.5" cy="40.5" r="0.6" fill="#FFF" />
          <path className="wing-front" d="M 45 52 C 20 20, 60 10, 70 45 Z" fill="#A0522D" stroke="#5A3800" strokeWidth="0.5"/>
        </g>
      </svg>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[5] pointer-events-none overflow-hidden" style={{ willChange: 'transform' }}>
      
      {/* Bird 1 */}
      <div 
        ref={bird1Ref} 
        className="absolute left-0 top-0 flex flex-col items-center drop-shadow-md" 
        style={{ willChange: 'transform', transform: 'translate3d(-20vw, 0vh, 0)' }}
      >
        <BirdSVG />
        <div ref={chirp1Ref} className="absolute -top-4 -right-4 bg-white px-1.5 py-0.5 rounded-full border border-border shadow-sm chirp-anim inline-block opacity-0">
          <span className="text-[8px] font-black text-text-primary">Chirp!</span>
        </div>
      </div>

      {/* Bird 2 */}
      <div 
        ref={bird2Ref} 
        className="absolute left-0 top-0 flex flex-col items-center drop-shadow-md" 
        style={{ willChange: 'transform', transform: 'translate3d(-20vw, 0vh, 0)' }}
      >
        <BirdSVG />
        <div ref={chirp2Ref} className="absolute -top-4 -right-4 bg-white px-1.5 py-0.5 rounded-full border border-border shadow-sm chirp-anim inline-block opacity-0" style={{ animationDelay: '2.5s' }}>
          <span className="text-[8px] font-black text-text-primary">Chirp!</span>
        </div>
      </div>

    </div>
  );
}
