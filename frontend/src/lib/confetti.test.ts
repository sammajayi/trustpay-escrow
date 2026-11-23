import { afterEach, describe, expect, it, vi } from 'vitest';
import confetti from 'canvas-confetti';
import { celebrateEscrow } from './confetti';

vi.mock('canvas-confetti', () => ({ default: { create: vi.fn() } }));

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe('escrow confetti', () => {
  it('creates a canvas with brand particles and removes it after two seconds', () => {
    vi.useFakeTimers();
    const context = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({} as CanvasRenderingContext2D);
    const burst = Object.assign(vi.fn(), { reset: vi.fn() });
    vi.mocked(confetti.create).mockImplementation((canvas) => {
      canvas?.getContext('2d');
      return burst;
    });
    celebrateEscrow();

    expect(context).toHaveBeenCalledWith('2d');
    expect(burst).toHaveBeenCalledWith(expect.objectContaining({ colors: ['#3b82f6', '#10b981', '#6366f1', '#fbbf24'] }));
    expect(document.querySelector('canvas')).toHaveStyle({ position: 'fixed', pointerEvents: 'none' });
    vi.advanceTimersByTime(1999);
    expect(document.querySelector('canvas')).toBeInTheDocument();
    vi.advanceTimersByTime(1);
    expect(burst.reset).toHaveBeenCalledOnce();
    expect(document.querySelector('canvas')).toBeNull();
  });

  it('skips the canvas when reduced motion is enabled', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })));
    celebrateEscrow();
    expect(confetti.create).not.toHaveBeenCalled();
    expect(document.querySelector('canvas')).toBeNull();
  });
});
