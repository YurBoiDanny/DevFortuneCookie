import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface FortunePaperProps {
  message: string;
  fortuneId?: number;
  onIdClick?: (id: number) => void;
}

const COPY_PREFIX = "Danny's DevDay Fortune Cookie Demo - My Fortune is … ";

export function FortunePaper({ message, fortuneId, onIdClick }: FortunePaperProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const textToCopy = `${COPY_PREFIX}${message}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 1200);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleIdClick = () => {
    if (fortuneId !== undefined && onIdClick) {
      onIdClick(fortuneId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative"
    >
      {/* Paper slip */}
      <div className="relative bg-[#F8F7F3] rounded-lg shadow-lg p-8 border border-slate-200">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none rounded-lg"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Fold line suggestion */}
        <div className="absolute left-8 right-8 top-1/2 h-px bg-slate-300/30 -translate-y-1/2" />

        {/* Fortune text */}
        <p className="relative text-gray-900 text-lg leading-relaxed text-center italic">
          &ldquo;{message}&rdquo;
        </p>

        {/* Fortune ID footer (clickable) */}
        {fortuneId !== undefined && (
          <div className="relative mt-6 pt-4 border-t border-slate-300/50 text-center">
            <button
              onClick={handleIdClick}
              className="text-[10px] text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              aria-label={`View fortune #${fortuneId}`}
            >
              Fortune #{fortuneId}
            </button>
          </div>
        )}

        {/* Red seal stamp (decorative) */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-600/10 border-2 border-red-600/30 flex items-center justify-center">
          <span className="text-[8px] text-red-600/60 font-bold">福</span>
        </div>
      </div>

      {/* Copy button */}
      <div className="absolute -top-3 -right-3">
        <Button
          onClick={handleCopy}
          size="icon"
          variant="secondary"
          className="h-10 w-10 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 shadow-lg"
          aria-label={copied ? 'Copied!' : 'Copy fortune'}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
                <Check className="w-4 h-4 text-green-400" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
                <Copy className="w-4 h-4 text-slate-300" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>
    </motion.div>
  );
}