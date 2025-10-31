import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

export type CookieVariant = 'classic' | 'cocoa' | 'matcha' | 'cyberpunk' | 'glass' | 'pixel';

interface FortuneCookieProps {
  isOpen: boolean;
  onCrack: () => void;
  isLoading?: boolean;
  variant?: CookieVariant;
}

const VARIANT_STYLES = {
  classic: {
    gradient: ['#fbbf24', '#f59e0b'],
    stroke: '#d97706',
    confetti: ['#fbbf24', '#f59e0b', '#d97706', '#fff'],
  },
  cocoa: {
    gradient: ['#78350f', '#451a03'],
    stroke: '#1c0a00',
    confetti: ['#78350f', '#92400e', '#451a03', '#fef3c7'],
  },
  matcha: {
    gradient: ['#84cc16', '#65a30d'],
    stroke: '#4d7c0f',
    confetti: ['#84cc16', '#65a30d', '#bef264', '#fff'],
  },
  cyberpunk: {
    gradient: ['#f0abfc', '#c084fc'],
    stroke: '#a855f7',
    confetti: ['#f0abfc', '#c084fc', '#06b6d4', '#fbbf24'],
  },
  glass: {
    gradient: ['rgba(148, 163, 184, 0.3)', 'rgba(100, 116, 139, 0.3)'],
    stroke: '#64748b',
    confetti: ['#94a3b8', '#cbd5e1', '#e2e8f0', '#fff'],
  },
  pixel: {
    gradient: ['#22c55e', '#16a34a'],
    stroke: '#15803d',
    confetti: ['#22c55e', '#16a34a', '#fbbf24', '#3b82f6'],
  },
};

export function FortuneCookie({ isOpen, onCrack, isLoading, variant = 'classic' }: FortuneCookieProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasShownConfetti, setHasShownConfetti] = useState(false);

  const style = VARIANT_STYLES[variant];

  useEffect(() => {
    if (isOpen && !hasShownConfetti) {
      setShowConfetti(true);
      setHasShownConfetti(true);
      // Hide confetti after animation
      setTimeout(() => setShowConfetti(false), 600);
    }
    
    // Reset when cookie closes
    if (!isOpen) {
      setHasShownConfetti(false);
      setShowConfetti(false);
    }
  }, [isOpen, hasShownConfetti]);

  const handleClick = () => {
    if (!isOpen && !isLoading) {
      onCrack();
    }
  };

  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      {/* Cookie Halves */}
      <motion.div 
        className="relative w-48 h-48 cursor-pointer" 
        onClick={handleClick}
        animate={isLoading ? {
          rotate: [0, -2, 2, -2, 2, 0],
        } : {}}
        transition={isLoading ? {
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: 0.5,
        } : {}}
      >
        {/* Left Half */}
        <motion.div
          className="absolute inset-0"
          animate={
            isOpen
              ? {
                  x: -60,
                  rotate: -15,
                  opacity: 1,
                }
              : { x: 0, rotate: 0, opacity: 1 }
          }
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          <svg
            viewBox="0 0 100 100"
            className={`w-full h-full drop-shadow-xl ${variant === 'cyberpunk' ? 'drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]' : ''}`}
          >
            {/* Left cookie half */}
            <defs>
              <radialGradient id={`cookieGradientLeft-${variant}`} cx="50%" cy="50%">
                <stop offset="0%" stopColor={style.gradient[0]} />
                <stop offset="100%" stopColor={style.gradient[1]} />
              </radialGradient>
              {variant === 'pixel' && (
                <pattern id="pixelPattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="4" height="4" fill="#15803d" opacity="0.3" />
                  <rect x="4" y="4" width="4" height="4" fill="#15803d" opacity="0.3" />
                </pattern>
              )}
            </defs>
            <path
              d="M 50 10 Q 20 30, 15 50 Q 20 70, 50 90 L 50 10"
              fill={variant === 'pixel' ? 'url(#pixelPattern)' : `url(#cookieGradientLeft-${variant})`}
              stroke={style.stroke}
              strokeWidth={variant === 'pixel' ? '2' : '1'}
              opacity={variant === 'glass' ? '0.8' : '1'}
            />
            {/* Texture dots - variant specific */}
            {variant === 'matcha' && (
              <>
                <circle cx="35" cy="35" r="2" fill="#4d7c0f" opacity="0.8" />
                <circle cx="30" cy="50" r="1.5" fill="#4d7c0f" opacity="0.6" />
                <circle cx="38" cy="60" r="2" fill="#4d7c0f" opacity="0.8" />
                <circle cx="42" cy="45" r="1" fill="#4d7c0f" opacity="0.6" />
                <circle cx="32" cy="42" r="1.5" fill="#4d7c0f" opacity="0.7" />
              </>
            )}
            {variant === 'classic' && (
              <>
                <circle cx="35" cy="35" r="2" fill="#d97706" opacity="0.6" />
                <circle cx="30" cy="50" r="1.5" fill="#d97706" opacity="0.6" />
                <circle cx="38" cy="60" r="2" fill="#d97706" opacity="0.6" />
                <circle cx="42" cy="45" r="1" fill="#d97706" opacity="0.6" />
              </>
            )}
            {variant === 'cocoa' && (
              <>
                <circle cx="35" cy="35" r="2" fill="#451a03" opacity="0.8" />
                <circle cx="30" cy="50" r="1.5" fill="#451a03" opacity="0.8" />
                <circle cx="38" cy="60" r="2" fill="#451a03" opacity="0.8" />
                <circle cx="42" cy="45" r="1" fill="#451a03" opacity="0.8" />
              </>
            )}
          </svg>
        </motion.div>

        {/* Right Half */}
        <motion.div
          className="absolute inset-0"
          animate={
            isOpen
              ? {
                  x: 60,
                  rotate: 15,
                  opacity: 1,
                }
              : { x: 0, rotate: 0, opacity: 1 }
          }
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          <svg
            viewBox="0 0 100 100"
            className={`w-full h-full drop-shadow-xl ${variant === 'cyberpunk' ? 'drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]' : ''}`}
          >
            {/* Right cookie half */}
            <defs>
              <radialGradient id={`cookieGradientRight-${variant}`} cx="50%" cy="50%">
                <stop offset="0%" stopColor={style.gradient[0]} />
                <stop offset="100%" stopColor={style.gradient[1]} />
              </radialGradient>
            </defs>
            <path
              d="M 50 10 Q 80 30, 85 50 Q 80 70, 50 90 L 50 10"
              fill={variant === 'pixel' ? 'url(#pixelPattern)' : `url(#cookieGradientRight-${variant})`}
              stroke={style.stroke}
              strokeWidth={variant === 'pixel' ? '2' : '1'}
              opacity={variant === 'glass' ? '0.8' : '1'}
            />
            {/* Texture dots */}
            {variant === 'matcha' && (
              <>
                <circle cx="65" cy="35" r="2" fill="#4d7c0f" opacity="0.8" />
                <circle cx="70" cy="50" r="1.5" fill="#4d7c0f" opacity="0.6" />
                <circle cx="62" cy="60" r="2" fill="#4d7c0f" opacity="0.8" />
                <circle cx="58" cy="45" r="1" fill="#4d7c0f" opacity="0.6" />
                <circle cx="68" cy="42" r="1.5" fill="#4d7c0f" opacity="0.7" />
              </>
            )}
            {variant === 'classic' && (
              <>
                <circle cx="65" cy="35" r="2" fill="#d97706" opacity="0.6" />
                <circle cx="70" cy="50" r="1.5" fill="#d97706" opacity="0.6" />
                <circle cx="62" cy="60" r="2" fill="#d97706" opacity="0.6" />
                <circle cx="58" cy="45" r="1" fill="#d97706" opacity="0.6" />
              </>
            )}
            {variant === 'cocoa' && (
              <>
                <circle cx="65" cy="35" r="2" fill="#451a03" opacity="0.8" />
                <circle cx="70" cy="50" r="1.5" fill="#451a03" opacity="0.8" />
                <circle cx="62" cy="60" r="2" fill="#451a03" opacity="0.8" />
                <circle cx="58" cy="45" r="1" fill="#451a03" opacity="0.8" />
              </>
            )}
          </svg>
        </motion.div>

        {/* Hover glow effect */}
        {!isOpen && !isLoading && (
          <motion.div
            className={`absolute inset-0 rounded-full opacity-0 blur-xl ${
              variant === 'cyberpunk' ? 'bg-purple-500' : 
              variant === 'matcha' ? 'bg-lime-400' :
              variant === 'cocoa' ? 'bg-yellow-900' :
              variant === 'glass' ? 'bg-slate-400' :
              variant === 'pixel' ? 'bg-green-500' :
              'bg-amber-400'
            }`}
            whileHover={{ opacity: 0.3 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>

      {/* Confetti effect */}
      <AnimatePresence>
        {showConfetti && !prefersReducedMotion && (
          <>
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 1,
                }}
                animate={{
                  x: (Math.random() - 0.5) * 500,
                  y: (Math.random() - 0.5) * 500,
                  opacity: 0,
                  scale: 0,
                  rotate: Math.random() * 720,
                }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut',
                }}
                className="absolute top-1/2 left-1/2 rounded-full"
                style={{
                  width: Math.random() * 8 + 4,
                  height: Math.random() * 8 + 4,
                  backgroundColor: style.confetti[Math.floor(Math.random() * style.confetti.length)],
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Hint tooltip */}
      {!isOpen && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap"
        >
          Click to crack open
        </motion.div>
      )}
    </div>
  );
}
