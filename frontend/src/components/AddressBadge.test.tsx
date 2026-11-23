import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AddressBadge } from './AddressBadge';
import { soundSynthesizer } from '@/lib/sound-effects';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('address copy feedback', () => {
  it('ripples from the click and shows a checkmark for 1.5 seconds', async () => {
    vi.useFakeTimers();
    const playTick = vi.spyOn(soundSynthesizer, 'playCopyTick').mockResolvedValue();
    const { container } = render(<AddressBadge value="full-hash" label="Copy Transaction Hash" />);
    const button = screen.getByRole('button', { name: 'Copy Transaction Hash' });
    vi.spyOn(button, 'getBoundingClientRect').mockReturnValue(new DOMRect(10, 20, 32, 28));
    await act(async () => { fireEvent.click(button, { detail: 1, clientX: 17, clientY: 30 }); });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('full-hash');
    expect(container.querySelector('.copy-ripple')).toHaveStyle({ left: '7px', top: '10px' });
    expect(container.querySelector('svg')).toHaveClass('text-emerald-400');
    expect(playTick).toHaveBeenCalledOnce();

    act(() => vi.advanceTimersByTime(1499));
    expect(screen.getByRole('status')).toHaveTextContent('Copied');
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('plays a short tone with Web Audio and honors the mute preference', async () => {
    const oscillator = { frequency: { setValueAtTime: vi.fn() }, connect: vi.fn(), start: vi.fn(), stop: vi.fn() };
    const gain = { gain: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() }, connect: vi.fn() };
    const { SoundSynthesizer } = await import('@/lib/sound-effects');
    vi.stubGlobal('AudioContext', class {
      state = 'running';
      currentTime = 0;
      destination = {};
      createOscillator = () => oscillator;
      createGain = () => gain;
    });
    const synth = new SoundSynthesizer();
    try {
      await expect(synth.playCopyTick()).resolves.toBeUndefined();
      expect(oscillator.stop).toHaveBeenCalledWith(0.055);
      localStorage.setItem('notification_sounds_muted', 'true');
      await synth.playCopyTick();
      expect(oscillator.start).toHaveBeenCalledOnce();
    } finally {
      vi.unstubAllGlobals();
      localStorage.removeItem('notification_sounds_muted');
    }
  });
});
