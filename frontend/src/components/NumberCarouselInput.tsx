import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';

interface NumberCarouselInputProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  variant?: 'compact' | 'full';
}

export function NumberCarouselInput({ 
  value, 
  min, 
  max, 
  onChange, 
  disabled = false,
  variant = 'full' 
}: NumberCarouselInputProps) {
  const [inputValue, setInputValue] = useState(value.toString());
  const [isFocused, setIsFocused] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startValueRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isFocused) {
      setInputValue(value.toString());
    }
  }, [value, isFocused]);

  const clamp = (num: number) => Math.max(min, Math.min(max, num));

  const getVisibleNumbers = () => {
    const visibleCount = variant === 'compact' ? 3 : 5;
    const halfVisible = Math.floor(visibleCount / 2);
    const result = [];
    
    for (let i = -halfVisible; i <= halfVisible; i++) {
      const num = value + i;
      if (num >= min && num <= max) {
        result.push({ num, offset: i });
      }
    }
    return result;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setIsError(false);

    // Try to parse and validate
    if (val === '') {
      return;
    }

    const parsed = parseInt(val, 10);
    if (isNaN(parsed)) {
      setIsError(true);
      return;
    }

    // Clamp and update
    const clamped = clamp(parsed);
    if (clamped === parsed) {
      onChange(clamped);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    inputRef.current?.select();
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parseInt(inputValue, 10);
    
    if (isNaN(parsed) || inputValue === '') {
      setInputValue(value.toString());
      setIsError(false);
    } else {
      const clamped = clamp(parsed);
      setInputValue(clamped.toString());
      onChange(clamped);
      setIsError(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      e.preventDefault();
      increment();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      e.preventDefault();
      decrement();
    }
  };

  const increment = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const decrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  // Touch/Mouse drag support
  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled || isFocused) return;
    setIsDragging(true);
    startXRef.current = e.clientX;
    startValueRef.current = value;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startXRef.current;
    const steps = Math.round(deltaX / 40); // 40px per step
    const newValue = clamp(startValueRef.current + steps);
    
    if (newValue !== value) {
      onChange(newValue);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const visibleNumbers = getVisibleNumbers();

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Carousel */}
      <div className="flex items-center gap-2">
        {/* Left stepper */}
        <Button
          variant="ghost"
          size="icon"
          onClick={decrement}
          disabled={disabled || value <= min}
          className="h-10 w-10 text-slate-400 hover:text-slate-200 disabled:opacity-30"
          aria-label="Previous number"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        {/* Number carousel with center input */}
        <div
          className={`
            relative overflow-hidden rounded-lg border bg-slate-900/50
            ${isError ? 'border-red-500' : isFocused ? 'border-amber-500' : 'border-slate-700'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : isDragging ? 'cursor-grabbing' : 'cursor-grab'}
            ${variant === 'compact' ? 'h-14 w-32' : 'h-16 w-48'}
          `}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          role="spinbutton"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label="Fortune number selector"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              {visibleNumbers.map(({ num, offset }) => {
                const isCurrent = offset === 0;
                const opacity = isCurrent ? 1 : Math.max(0.2, 1 - Math.abs(offset) * 0.4);
                const scale = isCurrent ? 1 : Math.max(0.6, 1 - Math.abs(offset) * 0.2);
                const translateX = offset * (variant === 'compact' ? 36 : 48);

                return (
                  <motion.div
                    key={num}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                      opacity,
                      scale,
                      x: translateX,
                    }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute flex items-center justify-center pointer-events-none"
                  >
                    {isCurrent ? (
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        disabled={disabled}
                        className={`
                          w-16 text-center bg-transparent border-none outline-none
                          font-mono tabular-nums pointer-events-auto
                          ${variant === 'compact' ? 'text-2xl' : 'text-3xl'}
                          ${isError ? 'text-red-400' : 'text-amber-400'}
                        `}
                        aria-label="Type fortune number"
                      />
                    ) : (
                      <span className={`font-mono tabular-nums text-slate-500 ${variant === 'compact' ? 'text-lg' : 'text-xl'}`}>
                        {num}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Center highlight */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`${variant === 'compact' ? 'w-12 h-12' : 'w-16 h-14'} border-2 border-amber-500/30 rounded`} />
          </div>
        </div>

        {/* Right stepper */}
        <Button
          variant="ghost"
          size="icon"
          onClick={increment}
          disabled={disabled || value >= max}
          className="h-10 w-10 text-slate-400 hover:text-slate-200 disabled:opacity-30"
          aria-label="Next number"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Helper text */}
      <div className={`text-xs ${isError ? 'text-red-400' : 'text-slate-500'}`}>
        {isError ? 'Please enter a valid number' : `Select fortune index (0–${max})`}
      </div>
    </div>
  );
}
