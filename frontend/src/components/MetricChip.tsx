import { Badge } from './ui/badge';
import { Zap, Clock, Minus } from 'lucide-react';

interface MetricChipProps {
  status: 'HIT' | 'MISS' | 'N/A';
}

export function MetricChip({ status }: MetricChipProps) {
  const getIcon = () => {
    switch (status) {
      case 'HIT':
        return <Zap className="w-3 h-3" />;
      case 'MISS':
        return <Clock className="w-3 h-3" />;
      case 'N/A':
        return <Minus className="w-3 h-3" />;
    }
  };

  const getStyles = () => {
    switch (status) {
      case 'HIT':
        return 'bg-green-900 text-green-400 border-green-700';
      case 'MISS':
        return 'bg-amber-900 text-amber-400 border-amber-700';
      case 'N/A':
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <Badge
      variant="outline"
      className={`${getStyles()} flex items-center gap-1.5 px-2.5 py-0.5`}
    >
      {getIcon()}
      <span>{status}</span>
    </Badge>
  );
}
