import { useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface WorldCameraProps {
  children: ReactNode;
  focusedLocation: string | null; // ID of the landmark to zoom to
  locations: Record<string, { x: number; y: number }>; // percentages (0-100)
}

export function WorldCamera({ children, focusedLocation, locations }: WorldCameraProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const dragPos = useRef({ startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 });
  const hasDragged = useRef(false);
  const isDragging = useRef(false);

  useEffect(() => {
    if (!scrollRef.current) return;
    const containerWidth = scrollRef.current.clientWidth;
    const containerHeight = scrollRef.current.clientHeight;
    // Map is 100% width of container (w-full).
    const mapWidth = containerWidth;
    const mapHeight = mapWidth * (9 / 16);

    if (focusedLocation && locations[focusedLocation]) {
      const loc = locations[focusedLocation];
      const targetScale = 2; // Zoom level
      const targetX = (loc.x / 100) * mapWidth;
      const targetY = (loc.y / 100) * mapHeight;

      const centerX = containerWidth / 2;
      const centerY = containerHeight / 2;
      const moveX = centerX - targetX * targetScale + scrollRef.current.scrollLeft;
      const moveY = centerY - targetY * targetScale + scrollRef.current.scrollTop;

      controls.start({
        x: moveX,
        y: moveY,
        scale: targetScale,
        transition: { duration: 1.2, ease: [0.32, 0.72, 0, 1] }
      });
      // Disable native scroll during cinematic zoom
      scrollRef.current.style.overflow = 'hidden';
      scrollRef.current.style.pointerEvents = 'none'; // Prevent further interaction during zoom
    } else {
      controls.start({
        x: 0,
        y: 0,
        scale: 1,
        transition: { duration: 0.8, ease: "easeOut" }
      }).then(() => {
        if (scrollRef.current) {
          scrollRef.current.style.overflow = 'auto';
          scrollRef.current.style.pointerEvents = 'auto';
        }
      });
    }
  }, [focusedLocation, locations, controls]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (focusedLocation || !scrollRef.current) return;
    isDragging.current = true;
    hasDragged.current = false;
    dragPos.current = {
      startX: e.clientX,
      startY: e.clientY,
      scrollLeft: scrollRef.current.scrollLeft,
      scrollTop: scrollRef.current.scrollTop
    };
    scrollRef.current.style.cursor = 'grabbing';
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    const dx = e.clientX - dragPos.current.startX;
    const dy = e.clientY - dragPos.current.startY;
    
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      hasDragged.current = true;
    }

    scrollRef.current.scrollTop = dragPos.current.scrollTop - dy;
    scrollRef.current.scrollLeft = dragPos.current.scrollLeft - dx;
  };

  const handlePointerUp = () => {
    if (!scrollRef.current) return;
    isDragging.current = false;
    scrollRef.current.style.cursor = 'grab';
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasDragged.current) {
      e.stopPropagation();
      e.preventDefault();
      hasDragged.current = false;
    }
  };

  return (
    <div 
      ref={scrollRef} 
      className="relative w-full h-full overflow-y-auto overflow-x-hidden bg-[#55B84A] scroll-smooth"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClickCapture={handleClickCapture}
      style={{ cursor: 'grab' }}
    >
      <motion.div
        className="w-full h-max min-h-full origin-top-left"
        animate={controls}
      >
        {children}
      </motion.div>
    </div>
  );
}
