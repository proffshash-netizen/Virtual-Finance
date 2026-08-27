import { useEffect, useState } from 'react';
import { useTransform, useMotionValue, animate } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  format?: (val: number) => string;
  className?: string;
  delay?: number;
  prefix?: string; // optional prefix, e.g., currency symbol
}

export function AnimatedNumber({ value, format = (v) => Math.round(v).toLocaleString(), className, delay = 0, prefix }: AnimatedNumberProps) {
  const [hasMounted, setHasMounted] = useState(false);
  
  const motionValue = useMotionValue(0);
  const display = useTransform(motionValue, (current) => format(current));
  const [displayText, setDisplayText] = useState(format(0));

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    
    // A slight delay gives the page time to transition before counting up
    const timeout = setTimeout(() => {
      animate(motionValue, value, {
        duration: 0.5,
        ease: "easeOut"
      });
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [value, motionValue, hasMounted, delay]);

  useEffect(() => {
    return display.on('change', (latest) => {
      setDisplayText(latest);
    });
  }, [display]);

  return (
    <span className={className}>
       {prefix && <span className="mr-1">{prefix}</span>}{displayText}
    </span>
  );
}
