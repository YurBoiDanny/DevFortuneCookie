import { motion } from 'motion/react';
import { ScrollArea } from './ui/scroll-area';
import { MetricChip } from './MetricChip';
import { Card } from './ui/card';
import { Clock } from 'lucide-react';

export interface FortuneItem {
  id: number;
  fortune: string;
  latency: number;
  cacheStatus: 'HIT' | 'MISS' | 'N/A';
}

interface FortuneListProps {
  fortunes: FortuneItem[];
}

export function FortuneList({ fortunes }: FortuneListProps) {
  if (fortunes.length === 0) {
    return null;
  }

  // Single fortune - display as before
  if (fortunes.length === 1) {
    const fortune = fortunes[0];
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="space-y-4"
      >
        <div className="bg-amber-50 rounded-lg shadow-2xl px-8 py-6 text-center">
          <div className="text-gray-800 italic">&ldquo;{fortune.fortune}&rdquo;</div>
          <div className="mt-3 text-xs text-gray-500 border-t border-gray-300 pt-2">
            Lucky numbers: {Math.floor(Math.random() * 90) + 10},{' '}
            {Math.floor(Math.random() * 90) + 10},{' '}
            {Math.floor(Math.random() * 90) + 10}
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-4 h-4" />
            <span>{fortune.latency}ms</span>
          </div>
          <MetricChip status={fortune.cacheStatus} />
        </div>
      </motion.div>
    );
  }

  // Multiple fortunes - display as scrollable list
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="space-y-3"
    >
      <div className="text-center text-sm text-slate-400">
        Fetched {fortunes.length} fortunes
      </div>
      <ScrollArea className="h-[400px] rounded-lg border border-slate-700 bg-slate-900/30 p-4">
        <div className="space-y-3">
          {fortunes.map((fortune, index) => (
            <motion.div
              key={fortune.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 p-4 space-y-3">
                {/* Fortune Text */}
                <div className="bg-amber-50 rounded-lg px-4 py-3">
                  <div className="text-gray-800 text-sm italic">
                    &ldquo;{fortune.fortune}&rdquo;
                  </div>
                </div>
                
                {/* Metrics Row */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{fortune.latency}ms</span>
                    </div>
                    <MetricChip status={fortune.cacheStatus} />
                  </div>
                  <div className="text-slate-500">#{fortune.id}</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </motion.div>
  );
}