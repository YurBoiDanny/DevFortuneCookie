import { Clock } from 'lucide-react';
import { MetricChip } from './MetricChip';
import { Skeleton } from './ui/skeleton';

interface MetricsDisplayProps {
  requestMs: number | null;
  serverDelayMs?: number | null;
  cacheStatus: 'HIT' | 'MISS' | 'N/A' | null;
  isLoading?: boolean;
}

export function MetricsDisplay({ requestMs, cacheStatus, isLoading }: MetricsDisplayProps) {
  if (requestMs === null && cacheStatus === null && !isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-6 bg-slate-900/50 rounded-lg border border-slate-700">
      {/* Request Time (Client-measured - Primary) */}
      <div className="flex flex-col items-center gap-2 min-w-[160px]">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Clock className="w-4 h-4" />
          <span>Request Time</span>
        </div>
        {isLoading ? (
          <Skeleton className="h-10 w-24 bg-slate-700" />
        ) : requestMs !== null ? (
          <div className="text-slate-100 font-mono tabular-nums">
            <span className="text-3xl font-bold">{requestMs}</span>
            <span className="text-base ml-1">ms</span>
          </div>
        ) : (
          <div className="text-slate-500 text-3xl">—</div>
        )}
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px h-16 bg-slate-700" />

      {/* Cache Status */}
      <div className="flex flex-col items-center gap-2 min-w-[140px]">
        <div className="text-slate-400 text-sm">Cache</div>
        {isLoading ? (
          <Skeleton className="h-6 w-16 bg-slate-700" />
        ) : cacheStatus ? (
          <MetricChip status={cacheStatus} />
        ) : (
          <div className="text-slate-500 text-2xl">—</div>
        )}
      </div>
    </div>
  );
}