import { Badge } from './ui/badge';
import { Server } from 'lucide-react';

export function ModeBadge() {
  const port = typeof window !== 'undefined' ? window.location.port : '';
  const isSidecar = port === '8081';
  const mode = isSidecar ? 'Sidecar' : 'Direct';

  return (
    <Badge
      variant="outline"
      className={
        isSidecar
          ? 'bg-green-900 text-green-500 border-green-700'
          : 'bg-slate-800 text-slate-400 border-slate-600'
      }
    >
      <Server className="w-3 h-3 mr-1" />
      {mode}
    </Badge>
  );
}