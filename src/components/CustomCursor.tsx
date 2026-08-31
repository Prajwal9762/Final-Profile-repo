import React, { useEffect, useState, useRef } from 'react';

interface CursorState {
  x: number;
  y: number;
  hovered: boolean;
  text: string;
  variant: 'default' | 'button' | 'card' | 'image' | 'link';
}

export const CustomCursor: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const [cursor, setCursor] = useState<CursorState>({
    x: -100,
    y: -100,
    hovered: false,
    text: '',
    variant: 'default',
  });

  const dotRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const trailRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    if (isMobile) return;

    // Enable custom cursor cursor-none class
    document.documentElement.classList.add('custom-cursor-active');

    const handleMouseMove = (e: MouseEvent) => {
      dotRef.current = { x: e.clientX, y: e.clientY };

      // Detect hover element target
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('[data-cursor], button, a, input, textarea, .interactive-card');
      if (interactive) {
        const cursorAttr = interactive.getAttribute('data-cursor');
        const isButton = interactive.tagName === 'BUTTON' || interactive.classList.contains('btn');
        const isImage = interactive.tagName === 'IMG' || interactive.classList.contains('img-container');
        const isCard = interactive.classList.contains('interactive-card');

        let text = cursorAttr || '';
        let variant: CursorState['variant'] = 'link';

        if (cursorAttr) {
          text = cursorAttr;
          variant = 'button';
        } else if (isButton) {
          text = 'VIEW →';
          variant = 'button';
        } else if (isCard) {
          text = 'EXPLORE';
          variant = 'card';
        } else if (isImage) {
          text = 'VIEW';
          variant = 'image';
        }

        setCursor((prev) => ({
          ...prev,
          hovered: true,
          text,
          variant,
        }));
      } else {
        setCursor((prev) => ({
          ...prev,
          hovered: false,
          text: '',
          variant: 'default',
        }));
      }
    };

    const animateTrail = () => {
      // Lerp smooth follow
      trailRef.current.x += (dotRef.current.x - trailRef.current.x) * 0.18;
      trailRef.current.y += (dotRef.current.y - trailRef.current.y) * 0.18;

      setCursor((prev) => ({
        ...prev,
        x: dotRef.current.x,
        y: dotRef.current.y,
      }));

      requestRef.current = requestAnimationFrame(animateTrail);
    };

    window.addEventListener('mousemove', handleMouseMove);
    requestRef.current = requestAnimationFrame(animateTrail);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isMobile]);

  if (isMobile) return null;

  const isExpanded = cursor.hovered || cursor.text !== '';

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Outer Ring with Lerp Trailing */}
      <div
        className={`fixed left-0 top-0 rounded-full border border-cyan-400/60 bg-cyan-500/10 backdrop-blur-[2px] transition-transform duration-100 ease-out flex items-center justify-center text-cyan-300 font-mono text-[10px] font-bold tracking-wider shadow-[0_0_20px_rgba(56,189,248,0.25)] ${
          isExpanded ? 'scale-150 border-cyan-300 bg-cyan-500/20 shadow-[0_0_30px_rgba(56,189,248,0.4)]' : 'scale-100'
        }`}
        style={{
          width: isExpanded ? '70px' : '36px',
          height: isExpanded ? '70px' : '36px',
          transform: `translate3d(${trailRef.current.x - (isExpanded ? 35 : 18)}px, ${
            trailRef.current.y - (isExpanded ? 35 : 18)
          }px, 0)`,
        }}
      >
        {cursor.text && (
          <span className="px-1 text-center whitespace-nowrap animate-pulse select-none">
            {cursor.text}
          </span>
        )}
      </div>

      {/* Main Inner Glowing Dot */}
      <div
        className="fixed left-0 top-0 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#38bdf8]"
        style={{
          transform: `translate3d(${cursor.x - 5}px, ${cursor.y - 5}px, 0)`,
        }}
      />
    </div>
  );
};
