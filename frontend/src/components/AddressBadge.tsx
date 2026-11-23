'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { soundSynthesizer } from '@/lib/sound-effects';

export function AddressBadge({ value, label }: { value: string; label: string }) {
  const [ripple, setRipple] = useState<{ x: number; y: number; size: number; id: number }>();
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const sequence = useRef(0);
  useEffect(() => () => {
    clearTimeout(timeout.current);
    sequence.current += 1;
  }, []);

  const copy = async (event: MouseEvent<HTMLButtonElement>) => {
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const x = event.detail ? event.clientX - left : width / 2;
    const y = event.detail ? event.clientY - top : height / 2;
    const size = 2 * Math.hypot(Math.max(x, width - x), Math.max(y, height - y));
    const id = ++sequence.current;

    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }
    if (id !== sequence.current) return;

    setCopied(true);
    setRipple({ x, y, size, id });
    soundSynthesizer.playCopyTick();
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setCopied(false);
      setRipple(undefined);
    }, 1500);
  };

  return (
    <button type="button" onClick={copy} title={label} aria-label={label}
      className="relative inline-flex h-7 w-8 shrink-0 items-center justify-center overflow-hidden rounded bg-slate-800 text-slate-200 hover:bg-slate-700">
      {ripple && <span key={ripple.id} aria-hidden="true" className="copy-ripple"
        style={{ left: ripple.x, top: ripple.y, width: ripple.size, height: ripple.size }} />}
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        className={`h-4 w-4 ${copied ? 'text-emerald-400' : ''}`}>
        {copied ? <path d="m5 12 4 4L19 6" /> : <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>}
      </svg>
      <span role="status" className="sr-only">{copied && 'Copied'}</span>
    </button>
  );
}
