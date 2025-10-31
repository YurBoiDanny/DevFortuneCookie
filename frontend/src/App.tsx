import { useState, useEffect, useRef } from 'react';
import { FortuneCookie, CookieVariant } from './components/FortuneCookie';
import { NumberCarouselInput } from './components/NumberCarouselInput';
import { FortunePaper } from './components/FortunePaper';
import { SelectionModeToggle } from './components/SelectionModeToggle';
import { ModeToggle } from './components/ModeToggle';
import { MetricsDisplay } from './components/MetricsDisplay';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { RotateCcw, Loader2, Info } from 'lucide-react';
import { Toaster, toast } from 'sonner';

interface FortuneResponse {
  message?: string;
  fortune?: string;
  delayMs?: number;
  id?: number;
}

const COOKIE_VARIANTS: CookieVariant[] = ['classic', 'cocoa', 'matcha', 'cyberpunk', 'glass', 'pixel'];

const getRandomVariant = (): CookieVariant => {
  return COOKIE_VARIANTS[Math.floor(Math.random() * COOKIE_VARIANTS.length)];
};

export default function App() {
  // State
  const [fortuneCount, setFortuneCount] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectionMode, setSelectionMode] = useState<'random' | 'pick'>('random');
  const [isSidecar, setIsSidecar] = useState(false); // Start with Direct mode
  const [fortune, setFortune] = useState<string | null>(null);
  const [fortuneId, setFortuneId] = useState<number | null>(null);
  const [requestMs, setRequestMs] = useState<number | null>(null);
  const [cacheStatus, setCacheStatus] = useState<'HIT' | 'MISS' | 'N/A' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCookieOpen, setIsCookieOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cookieVariant, setCookieVariant] = useState<CookieVariant>(getRandomVariant());

  // Refs
  const selectionControlsRef = useRef<HTMLDivElement>(null);

  // Fetch fortune count on mount or when mode changes
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const basePath = isSidecar ? '/api' : '/direct';
        const endpoint = `${basePath}/fortunes/count`;

        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Failed to fetch count');

        const data = await response.json();
        setFortuneCount(data.count || 100);
      } catch (error) {
        console.error('Error fetching count:', error);
        setFortuneCount(100); // Fallback to 100
      }
    };

    fetchCount();
  }, [isSidecar]);

  // Fetch fortune
  const fetchFortune = async () => {
    setIsLoading(true);
    setError(null);
    setIsCookieOpen(true);

    const startTime = performance.now();

    try {
      const basePath = isSidecar ? '/api' : '/direct';
      const endpoint = selectionMode === 'random'
        ? `${basePath}/fortune`
        : `${basePath}/fortune/${selectedIndex}`;

      const response = await fetch(endpoint);

      // Handle rate limiting
      if (response.status === 429 || response.status === 503) {
        toast.warning('Service is under heavy load. Please try again in a moment.', {
          duration: 4000,
          icon: <Info className="w-4 h-4" />,
        });
        setIsLoading(false);
        setIsCookieOpen(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: FortuneResponse = await response.json();
      const clientRequestTime = Math.round(performance.now() - startTime);

      // Read X-Cache header
      const xCache = response.headers.get('X-Cache');
      let detectedCacheStatus: 'HIT' | 'MISS' | 'N/A' = 'N/A';

      if (xCache) {
        const upperCache = xCache.toUpperCase();
        if (upperCache.includes('HIT')) {
          detectedCacheStatus = 'HIT';
        } else if (upperCache.includes('MISS')) {
          detectedCacheStatus = 'MISS';
        }
      }

      // Wait for animation to complete (crack + confetti ~600ms)
      setTimeout(() => {
        setFortune(data.message || data.fortune || 'No fortune available');
        setFortuneId(data.id !== undefined ? data.id : null);
        setRequestMs(clientRequestTime);
        setCacheStatus(detectedCacheStatus);
        setIsLoading(false);
      }, 600);

    } catch (error) {
      console.error('Error fetching fortune:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch fortune');
      setFortune(null);
      setFortuneId(null);
      setRequestMs(null);
      setCacheStatus(null);
      setIsLoading(false);
      setIsCookieOpen(false);
    }
  };

  const handleReveal = () => {
    fetchFortune();
  };

  const handleAnotherFortune = () => {
    setFortune(null);
    setFortuneId(null);
    setRequestMs(null);
    setCacheStatus(null);
    setError(null);
    setIsCookieOpen(false);
    setCookieVariant(getRandomVariant());
  };

  const handleModeChange = (mode: 'random' | 'pick') => {
    setSelectionMode(mode);
    handleAnotherFortune();
  };

  const handleModeToggle = (newIsSidecar: boolean) => {
    setIsSidecar(newIsSidecar);
    handleAnotherFortune();
  };

  // Handle fortune ID click - switch to Pick mode and set the index
  const handleFortuneIdClick = (id: number) => {
    setSelectionMode('pick');
    setSelectedIndex(id);
    handleAnotherFortune();

    // Scroll to selection controls
    setTimeout(() => {
      selectionControlsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);
  };

  return (
    <>
      <Toaster position="top-center" />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl bg-slate-800/50 backdrop-blur-sm border-slate-700 shadow-2xl relative">
          {/* Mode Badge - Sidecar/Direct */}
          <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
            <ModeToggle isSidecar={isSidecar} onToggle={handleModeToggle} />
            <div className="text-xs text-slate-500">
              Currently using: <span className={isSidecar ? 'text-green-400' : 'text-amber-400'}>
                {isSidecar ? 'Sidecar' : 'Direct'}
              </span>
            </div>
          </div>

          <div className="p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-amber-400 mb-2">Dev Fortune Cookie</h1>
              <p className="text-gray-400">
                {fortune
                  ? 'Your fortune has been revealed!'
                  : 'Click the cookie or choose a number to reveal your fortune.'}
              </p>
            </div>

            {/* Fortune Cookie (always visible) */}
            <div className="mb-8" aria-live="polite">
              <FortuneCookie
                isOpen={isCookieOpen}
                onCrack={!fortune ? handleReveal : () => { }}
                isLoading={isLoading}
                variant={cookieVariant}
              />
            </div>

            {/* Selection Controls (visible when no fortune) */}
            {!fortune && !isLoading && (
              <div ref={selectionControlsRef} className="mb-8 space-y-6 scroll-mt-24">
                {/* Mode Toggle */}
                <div className="flex justify-center">
                  <SelectionModeToggle mode={selectionMode} onChange={handleModeChange} />
                </div>

                {/* Number Carousel Input (Pick mode) */}
                {selectionMode === 'pick' && fortuneCount > 0 && (
                  <div className="flex flex-col items-center gap-4">
                    <NumberCarouselInput
                      value={selectedIndex}
                      min={0}
                      max={fortuneCount - 1}
                      onChange={setSelectedIndex}
                      disabled={isLoading}
                    />
                  </div>
                )}

                {/* Reveal Button */}
                <div className="flex justify-center">
                  <Button
                    onClick={handleReveal}
                    disabled={isLoading}
                    size="lg"
                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 h-11"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Revealing...
                      </>
                    ) : (
                      <>
                        Reveal Fortune
                        {selectionMode === 'pick' && ` #${selectedIndex}`}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-900/20 border border-red-800/50 text-red-400 text-sm text-center">
                <p className="mb-2">{error}</p>
                <Button
                  onClick={handleAnotherFortune}
                  variant="outline"
                  size="sm"
                  className="border-red-700 text-red-400 hover:bg-red-900/30"
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Fortune Paper */}
            {fortune && !isLoading && (
              <div className="mb-8" aria-live="polite">
                <FortunePaper
                  message={fortune}
                  fortuneId={fortuneId !== null ? fortuneId : undefined}
                  onIdClick={handleFortuneIdClick}
                />
              </div>
            )}

            {/* Metrics Display */}
            {fortune && !isLoading && (
              <div className="mb-8">
                <MetricsDisplay
                  requestMs={requestMs}
                  cacheStatus={cacheStatus}
                  isLoading={isLoading}
                />
              </div>
            )}

            {/* Another Fortune Button */}
            {fortune && !isLoading && (
              <div className="flex justify-center">
                <Button
                  onClick={handleAnotherFortune}
                  disabled={isLoading}
                  className="bg-amber-600 hover:bg-amber-700 text-white h-11"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Another Fortune
                </Button>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 text-center text-xs text-gray-600">
              Built for developers, by developers 🤖
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
