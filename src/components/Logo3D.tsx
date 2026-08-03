'use client';

import { useEffect, useRef } from 'react';

interface Logo3DProps {
  size?: number;
  spin?: boolean;
}

export function Logo3D({ size = 56, spin = true }: Logo3DProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      el.style.transform = `rotateY(${dx * 40}deg) rotateX(${-dy * 40}deg)`;
    };
    const reset = () => {
      el.style.transform = 'rotateY(0deg) rotateX(0deg)';
    };
    const parent = el.parentElement;
    parent?.addEventListener('pointermove', handler);
    parent?.addEventListener('pointerleave', reset);
    return () => {
      parent?.removeEventListener('pointermove', handler);
      parent?.removeEventListener('pointerleave', reset);
    };
  }, []);

  const half = size / 2;
  const faceBase: React.CSSProperties = { width: size, height: size, fontSize: size * 0.34 };
  void half;

  return (
    <div className="scene" style={{ width: size, height: size }}>
      <div
        ref={ref}
        className="cube"
        style={{ width: size, height: size, animationPlayState: spin ? 'running' : 'paused' }}
      >
        <div className="cube__face cube__front" style={{ ...faceBase, background: 'linear-gradient(135deg,#1c77f5,#155fe2)', color: '#fff' }}>AM</div>
        <div className="cube__face cube__back" style={{ ...faceBase, background: 'linear-gradient(135deg,#155fe2,#19418f)', color: '#fff' }}>AM</div>
        <div className="cube__face cube__right" style={{ ...faceBase, background: 'linear-gradient(135deg,#3296ff,#1c77f5)', color: '#fff' }}>
          <span style={{ fontSize: size * 0.5 }}>✓</span>
        </div>
        <div className="cube__face cube__left" style={{ ...faceBase, background: 'linear-gradient(135deg,#8ed1ff,#3296ff)', color: '#142855' }}>
          <span style={{ fontSize: size * 0.5 }}>✓</span>
        </div>
        <div className="cube__face cube__top" style={{ ...faceBase, background: 'linear-gradient(135deg,#ffbb2d,#f9a807)', color: '#142855' }}>AM</div>
        <div className="cube__face cube__bottom" style={{ ...faceBase, background: 'linear-gradient(135deg,#f9a807,#dd8003)', color: '#142855' }}>AM</div>
      </div>
    </div>
  );
}

export function LogoLockup({ size = 44 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3 select-none">
      <Logo3D size={size} />
      <div className="leading-none">
        <div className="font-extrabold text-xl tracking-tight text-white">
          Apply<span className="text-gradient">Mitra</span>
        </div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-brand-300/80">Forms Cafe</div>
      </div>
    </div>
  );
}
