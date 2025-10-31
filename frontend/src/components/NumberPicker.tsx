import { useState, useEffect, useRef } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface NumberPickerProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function NumberPicker({ value, min, max, onChange, disabled }: NumberPickerProps) {
  const [inputValue, setInputValue] = useState(value.toString());
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const startValueRef = useRef(0);

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const clamp = (num: number) => Math.max(min, Math.min(max, num));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    // Try to parse and clamp live
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed)) {
      const clamped = clamp(parsed);
      if (clamped === parsed) {
        onChange(clamped);
      }
    }
  };

  const handleBlur = () => {
    const parsed = parseInt(inputValue, 10);
    if (isNaN(parsed)) {
      setInputValue(value.toString());
    } else {
      const clamped = clamp(parsed);
      setInputValue(clamped.toString());
      onChange(clamped);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      increment();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      decrement();
    }
  };

  // Mouse wheel support
  const handleWheel = (e: React.WheelEvent) => {
    if (disabled) return;
    e.preventDefault();
    
    if (e.deltaY < 0) {
      increment();
    } else if (e.deltaY > 0) {
      decrement();
    }
  };

  // Mobile drag support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    setIsDragging(true);
    startYRef.current = e.touches[0].clientY;
    startValueRef.current = value;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const deltaY = startYRef.current - e.touches[0].clientY;
    const steps = Math.round(deltaY / 30); // 30px per step
    const newValue = clamp(startValueRef.current + steps);
    
    if (newValue !== value) {
      onChange(newValue);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Desktop drag support
  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    startYRef.current = e.clientY;
    startValueRef.current = value;
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaY = startYRef.current - e.clientY;
    const steps = Math.round(deltaY / 30); // 30px per step
    const newValue = clamp(startValueRef.current + steps);
    
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

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        {/* Decrement button */}
        <Button
          variant="outline"
          size="icon"
          onClick={decrement}
          disabled={disabled || value <= min}
          className="h-9 w-9 border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-30"
          aria-label="Decrement"
        >
          <Minus className="w-4 h-4" />
        </Button>

        {/* Input field with drag & wheel support */}
        <div
          ref={containerRef}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          className={`
            relative
            ${!disabled && 'cursor-ns-resize touch-none select-none'}
            ${isDragging && 'cursor-grabbing'}
          `}
        >
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="w-24 text-center border-slate-600 bg-slate-900 text-slate-100 font-mono text-lg h-11 pointer-events-auto"
            aria-label="Fortune number"
            onFocus={(e) => e.target.select()}
          />
          
          {/* Drag hint overlay (shows on hover for desktop) */}
          {!disabled && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <div className="text-[10px] text-slate-500 bg-slate-900/90 px-1 rounded">
                ⇅
              </div>
            </div>
          )}
        </div>

        {/* Increment button */}
        <Button
          variant="outline"
          size="icon"
          onClick={increment}
          disabled={disabled || value >= max}
          className="h-9 w-9 border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-30"
          aria-label="Increment"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="text-xs text-slate-500">
        Valid: {min}–{max}
      </div>
    </div>
  );
}
