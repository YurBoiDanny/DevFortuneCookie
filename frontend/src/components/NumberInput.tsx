import { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface NumberInputProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function NumberInput({ value, min, max, onChange, disabled }: NumberInputProps) {
  const [inputValue, setInputValue] = useState(value.toString());

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
      if (clamped !== parsed) {
        // Show the typed value but don't update the actual value yet
        setInputValue(val);
      } else {
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

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
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

        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="w-20 text-center border-slate-600 bg-slate-900 text-slate-100 font-mono text-lg h-9"
          aria-label="Fortune number"
        />

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
