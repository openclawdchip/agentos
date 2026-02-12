import { useEffect, useState, useRef } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function AnimatedNumber({ 
  value, 
  duration = 500, 
  decimals = 0,
  suffix = '',
  prefix = '',
  className = ''
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const startValueRef = useRef(value);
  const startTimeRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    startValueRef.current = displayValue;
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }
      
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = startValueRef.current + (value - startValueRef.current) * easeProgress;
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  const formattedValue = decimals > 0 
    ? displayValue.toFixed(decimals) 
    : Math.round(displayValue).toString();

  return (
    <span className={`font-mono-data ${className}`}>
      {prefix}{formattedValue}{suffix}
    </span>
  );
}
