import { motion, AnimatePresence } from 'motion/react';
import { Badge } from './ui/badge';

interface MultiFortuneCookiesProps {
  count: number;
  openedCookies: Set<number>;
  onCrackSingle: (index: number) => void;
}

export function MultiFortuneCookies({ count, openedCookies, onCrackSingle }: MultiFortuneCookiesProps) {
  const displayCount = Math.min(count, 5);
  const excessCount = count - 5;

  return (
    <div className="relative w-full min-h-[300px] flex items-center justify-center py-8">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {/* Display up to 5 cookies */}
        {[...Array(displayCount)].map((_, index) => (
          <CookieItem 
            key={index} 
            index={index} 
            isOpen={openedCookies.has(index)}
            onClick={() => !openedCookies.has(index) && onCrackSingle(index)}
          />
        ))}
        
        {/* Show +N badge if more than 5 */}
        {excessCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Badge className="bg-amber-600 text-white text-lg px-4 py-2 h-auto">
              +{excessCount}
            </Badge>
          </motion.div>
        )}
      </div>

      {/* Hint tooltip */}
      {openedCookies.size === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap"
        >
          Click any cookie to reveal its fortune
        </motion.div>
      )}
      
      {openedCookies.size > 0 && openedCookies.size < count && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs text-slate-400 whitespace-nowrap"
        >
          {openedCookies.size}/{count} opened
        </motion.div>
      )}
    </div>
  );
}

interface CookieItemProps {
  index: number;
  isOpen: boolean;
  onClick: () => void;
}

function CookieItem({ index, isOpen, onClick }: CookieItemProps) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        delay: index * 0.1,
        type: 'spring',
        stiffness: 200
      }}
      className="relative w-24 h-24 cursor-pointer"
      onClick={onClick}
    >
      {/* Confetti effect for this cookie only */}
      <AnimatePresence>
        {isOpen && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 1,
                }}
                animate={{
                  x: (Math.random() - 0.5) * 200,
                  y: (Math.random() - 0.5) * 200,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{
                  duration: 0.4,
                  ease: 'easeOut',
                }}
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#fbbf24', '#f59e0b', '#d97706', '#fff'][
                    Math.floor(Math.random() * 4)
                  ],
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Left Half */}
      <motion.div
        className="absolute inset-0"
        animate={
          isOpen
            ? {
                x: -30,
                rotate: -15,
                opacity: 1,
              }
            : { x: 0, rotate: 0, opacity: 1 }
        }
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-lg"
        >
          <defs>
            <radialGradient id={`cookieGradientLeft${index}`} cx="50%" cy="50%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>
          </defs>
          <path
            d="M 50 10 Q 20 30, 15 50 Q 20 70, 50 90 L 50 10"
            fill={`url(#cookieGradientLeft${index})`}
            stroke="#d97706"
            strokeWidth="1"
          />
          <circle cx="35" cy="35" r="2" fill="#d97706" opacity="0.6" />
          <circle cx="30" cy="50" r="1.5" fill="#d97706" opacity="0.6" />
          <circle cx="38" cy="60" r="2" fill="#d97706" opacity="0.6" />
        </svg>
      </motion.div>

      {/* Right Half */}
      <motion.div
        className="absolute inset-0"
        animate={
          isOpen
            ? {
                x: 30,
                rotate: 15,
                opacity: 1,
              }
            : { x: 0, rotate: 0, opacity: 1 }
        }
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-lg"
        >
          <defs>
            <radialGradient id={`cookieGradientRight${index}`} cx="50%" cy="50%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>
          </defs>
          <path
            d="M 50 10 Q 80 30, 85 50 Q 80 70, 50 90 L 50 10"
            fill={`url(#cookieGradientRight${index})`}
            stroke="#d97706"
            strokeWidth="1"
          />
          <circle cx="65" cy="35" r="2" fill="#d97706" opacity="0.6" />
          <circle cx="70" cy="50" r="1.5" fill="#d97706" opacity="0.6" />
          <circle cx="62" cy="60" r="2" fill="#d97706" opacity="0.6" />
        </svg>
      </motion.div>

      {/* Hover glow effect - only for unopened cookies */}
      {!isOpen && (
        <motion.div
          className="absolute inset-0 rounded-full bg-amber-400 opacity-0 blur-lg"
          whileHover={{ opacity: 0.3 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Dimmed overlay for opened cookies */}
      {isOpen && (
        <div className="absolute inset-0 bg-slate-900/40 rounded-full" />
      )}
    </motion.div>
  );
}