import { useEffect, useRef, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

interface NumberCarouselProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function NumberCarousel({ value, min, max, onChange, disabled }: NumberCarouselProps) {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const startValueRef = useRef(0);

  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        increment();
        break;
      case 'ArrowDown':
        e.preventDefault();
        decrement();
        break;
      case 'PageUp':
        e.preventDefault();
        onChange(Math.min(max, value + 10));
        break;
      case 'PageDown':
        e.preventDefault();
        onChange(Math.max(min, value - 10));
        break;
      case 'Home':
        e.preventDefault();
        onChange(min);
        break;
      case 'End':
        e.preventDefault();
        onChange(max);
        break;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    startYRef.current = e.clientY;
    startValueRef.current = value;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaY = startYRef.current - e.clientY;
    const steps = Math.round(deltaY / 30); // 30px per step
    const newValue = Math.max(min, Math.min(max, startValueRef.current + steps));
    
    if (newValue !== value) {
      onChange(newValue);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, value]);

  const getVisibleNumbers = () => {
    const result = [];
    for (let i = -2; i <= 2; i++) {
      const num = value + i;
      if (num >= min && num <= max) {
        result.push({ num, offset: i });
      }
    }
    return result;
  };

  const visibleNumbers = getVisibleNumbers();

  return (
    <div className="flex items-center gap-2">
      {/* Up button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={decrement}
        disabled={disabled || value <= min}
        className="h-8 w-8 text-slate-400 hover:text-slate-200 disabled:opacity-30"
        aria-label="Previous number"
      >
        <ChevronUp className="w-4 h-4" />
      </Button>

      {/* Carousel */}
      <div
        ref={containerRef}
        className={`relative h-32 w-20 overflow-hidden rounded-lg border border-slate-700 bg-slate-900/50 ${
          disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'
        }`}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="spinbutton"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label="Fortune number selector"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {visibleNumbers.map(({ num, offset }) => {
            const isCurrent = offset === 0;
            const opacity = isCurrent ? 1 : Math.max(0.2, 1 - Math.abs(offset) * 0.3);
            const scale = isCurrent ? 1 : Math.max(0.7, 1 - Math.abs(offset) * 0.15);
            const translateY = offset * 32;

            return (
              <div
                key={num}
                className="absolute flex items-center justify-center transition-all duration-150 ease-out"
                style={{
                  opacity,
                  transform: `translateY(${translateY}px) scale(${scale})`,
                }}
              >
                <span
                  className={`font-mono tabular-nums ${
                    isCurrent ? 'text-amber-400 text-2xl' : 'text-slate-500 text-lg'
                  }`}
                >
                  {num}
                </span>
              </div>
            );
          })}
        </div>

        {/* Center highlight */}
        <div className="absolute top-1/2 left-0 right-0 h-10 -translate-y-1/2 border-y border-amber-500/30 pointer-events-none" />
      </div>

      {/* Down button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={increment}
        disabled={disabled || value >= max}
        className="h-8 w-8 text-slate-400 hover:text-slate-200 disabled:opacity-30"
        aria-label="Next number"
      >
        <ChevronDown className="w-4 h-4" />
      </Button>
    </div>
  );
}
