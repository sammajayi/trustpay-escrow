import confetti from 'canvas-confetti';

const colors = ['#3b82f6', '#10b981', '#6366f1', '#fbbf24'];
let active = false;

export function celebrateEscrow(): void {
  if (typeof window === 'undefined' || active || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '200',
  });
  document.body.append(canvas);

  let burst: ReturnType<typeof confetti.create> | undefined;
  const cleanup = () => {
    try {
      burst?.reset();
    } finally {
      canvas.remove();
      active = false;
    }
  };

  active = true;
  try {
    burst = confetti.create(canvas, { resize: true, disableForReducedMotion: true });
    const animation = burst({ particleCount: 110, spread: 90, startVelocity: 42, ticks: 120, colors, origin: { y: 0.62 } });
    const timer = window.setTimeout(cleanup, 2000);
    void animation?.catch(() => {
      window.clearTimeout(timer);
      cleanup();
    });
  } catch {
    cleanup();
  }
}
