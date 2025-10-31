import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { MetricChip } from './MetricChip';
import { Clock } from 'lucide-react';

export interface SingleFortuneData {
  id: number;
  fortune: string;
  latency: number;
  cacheStatus: 'HIT' | 'MISS' | 'N/A';
}

interface SingleFortuneViewProps {
  fortune: SingleFortuneData | null;
  onClose: () => void;
}

export function SingleFortuneView({ fortune, onClose }: SingleFortuneViewProps) {
  if (!fortune) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative max-w-lg w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute -top-12 right-0 text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Fortune Paper */}
          <div className="bg-amber-50 rounded-lg shadow-2xl px-8 py-8 text-center">
            <div className="text-gray-800 text-lg italic mb-6">
              &ldquo;{fortune.fortune}&rdquo;
            </div>
            
            {/* Metrics */}
            <div className="flex items-center justify-center gap-4 mb-4 pb-4 border-b border-gray-300">
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Clock className="w-4 h-4" />
                <span>{fortune.latency}ms</span>
              </div>
              <MetricChip status={fortune.cacheStatus} />
            </div>

            {/* Lucky numbers */}
            <div className="text-xs text-gray-500">
              Lucky numbers: {Math.floor(Math.random() * 90) + 10},{' '}
              {Math.floor(Math.random() * 90) + 10},{' '}
              {Math.floor(Math.random() * 90) + 10}
            </div>
            
            <div className="mt-4 text-xs text-gray-400">
              Fortune #{fortune.id}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
