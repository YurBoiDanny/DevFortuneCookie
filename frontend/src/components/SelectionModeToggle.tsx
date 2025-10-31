import { Shuffle, Target } from 'lucide-react';

interface SelectionModeToggleProps {
  mode: 'random' | 'pick';
  onChange: (mode: 'random' | 'pick') => void;
}

export function SelectionModeToggle({ mode, onChange }: SelectionModeToggleProps) {
  return (
    <div className="inline-flex items-center rounded-lg bg-slate-900/70 p-1 border border-slate-700">
      <button
        onClick={() => onChange('random')}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
          ${mode === 'random' 
            ? 'bg-slate-700 text-slate-100 shadow-sm' 
            : 'text-slate-400 hover:text-slate-300'
          }
        `}
        aria-pressed={mode === 'random'}
      >
        <Shuffle className="w-4 h-4" />
        Random
      </button>
      <button
        onClick={() => onChange('pick')}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
          ${mode === 'pick'
            ? 'bg-slate-700 text-slate-100 shadow-sm'
            : 'text-slate-400 hover:text-slate-300'
          }
        `}
        aria-pressed={mode === 'pick'}
      >
        <Target className="w-4 h-4" />
        Pick by Number
      </button>
    </div>
  );
}
