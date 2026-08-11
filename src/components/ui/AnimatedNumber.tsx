import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  format?: (val: number) => string;
  className?: string;
  delay?: number;
  prefix?: string; // optional prefix, e.g., currency symbol
}

export function AnimatedNumber({ value, format = (v) => Math.round(v).toLocaleString(), className, delay = 0, prefix }: AnimatedNumberProps) {
  const [hasMounted, setHasMounted] = useState(false);
  
  // Spring physics for a satisfying "tick up" effect
  const springValue = useSpring(0, {
    stiffness: 60,
    damping: 15,
    mass: 1,
  });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    
    // A slight delay gives the page time to transition before counting up
    const timeout = setTimeout(() => {
      springValue.set(value);
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [value, springValue, hasMounted, delay]);

  const display = useTransform(springValue, (current) => format(current));

  return (
    <motion.span className={className}>
       {prefix && <span className="mr-1">{prefix}</span>}{display as any}
    </motion.span>
  );
}
