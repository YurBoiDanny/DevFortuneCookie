import { Badge } from './ui/badge';
import { Server, Zap } from 'lucide-react';

interface ModeToggleProps {
  isSidecar: boolean;
  onToggle: (isSidecar: boolean) => void;
}

export function ModeToggle({ isSidecar, onToggle }: ModeToggleProps) {
  return (
    <button
      onClick={() => onToggle(!isSidecar)}
      className="group"
    >
      <Badge
        variant="outline"
        className={
          isSidecar
            ? 'bg-green-900 text-green-500 border-green-700 hover:bg-green-900/80 transition-colors'
            : 'bg-slate-800 text-slate-400 border-slate-600 hover:bg-slate-800/80 transition-colors'
        }
      >
        {isSidecar ? <Zap className="w-3 h-3 mr-1" /> : <Server className="w-3 h-3 mr-1" />}
        {isSidecar ? 'Sidecar' : 'Direct'}
      </Badge>
    </button>
  );
}