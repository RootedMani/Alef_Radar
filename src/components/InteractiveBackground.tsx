import React, { useEffect, useRef } from 'react';

interface InteractiveBackgroundProps {
  darkMode: boolean;
}

interface Shape {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRot: number;
  opacity: number;
  type: 'radar-ring' | 'diamond' | 'cross' | 'circle' | 'dot' | 'square';
  mass: number;
}

export const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({ darkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates and state
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 160,
      isActive: false,
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initShapes();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isActive = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.isActive = true;
      }
    };

    const handleMouseLeave = () => {
      mouse.isActive = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    // Initialize shapes
    let shapes: Shape[] = [];
    const shapeTypes: Shape['type'][] = [
      'radar-ring',
      'diamond',
      'cross',
      'circle',
      'dot',
      'square',
    ];

    const initShapes = () => {
      const count = Math.min(48, Math.max(22, Math.floor((width * height) / 38000)));
      shapes = [];

      for (let i = 0; i < count; i++) {
        const type = shapeTypes[i % shapeTypes.length];
        const size =
          type === 'radar-ring'
            ? Math.random() * 24 + 20
            : type === 'diamond' || type === 'square'
            ? Math.random() * 16 + 10
            : type === 'cross'
            ? Math.random() * 12 + 8
            : Math.random() * 14 + 6;

        shapes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          size,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.015,
          opacity: Math.random() * 0.32 + 0.18,
          type,
          mass: size * 0.08,
        });
      }
    };

    initShapes();

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle cursor illumination effect in monochrome
      if (mouse.isActive && mouse.x > 0 && mouse.y > 0) {
        const glow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouse.radius * 1.5
        );
        if (darkMode) {
          glow.addColorStop(0, 'rgba(255, 255, 255, 0.09)');
          glow.addColorStop(0.5, 'rgba(255, 255, 255, 0.03)');
          glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        } else {
          glow.addColorStop(0, 'rgba(0, 0, 0, 0.06)');
          glow.addColorStop(0.5, 'rgba(0, 0, 0, 0.02)');
          glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw and update each shape
      for (let i = 0; i < shapes.length; i++) {
        const s = shapes[i];

        // Mouse interaction: push away from cursor
        const dx = s.x - mouse.x;
        const dy = s.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius && mouse.isActive) {
          const force = (1 - dist / mouse.radius) * 1.8;
          const angle = Math.atan2(dy, dx);
          // Acceleration vector away from mouse
          s.vx += (Math.cos(angle) * force) / s.mass;
          s.vy += (Math.sin(angle) * force) / s.mass;
          s.vRot += (force * 0.02 * (dx > 0 ? 1 : -1)) / s.mass;

          // Draw subtle radar connection ray to cursor
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(s.x, s.y);
          ctx.strokeStyle = darkMode
            ? `rgba(255, 255, 255, ${(1 - dist / mouse.radius) * 0.22})`
            : `rgba(0, 0, 0, ${(1 - dist / mouse.radius) * 0.14})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Apply friction to dampen mouse impulses
        s.vx *= 0.982;
        s.vy *= 0.982;
        s.vRot *= 0.988;

        // Base drifting speed floor
        const currentSpeed = Math.hypot(s.vx, s.vy);
        if (currentSpeed < 0.2) {
          s.vx += (Math.random() - 0.5) * 0.02;
          s.vy += (Math.random() - 0.5) * 0.02;
        }

        // Update positions
        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.vRot;

        // Screen boundary wrapping
        if (s.x < -s.size * 2) s.x = width + s.size;
        if (s.x > width + s.size * 2) s.x = -s.size;
        if (s.y < -s.size * 2) s.y = height + s.size;
        if (s.y > height + s.size * 2) s.y = -s.size;

        // Connect nearby shapes with subtle lines (radar web)
        for (let j = i + 1; j < shapes.length; j++) {
          const s2 = shapes[j];
          const cdx = s.x - s2.x;
          const cdy = s.y - s2.y;
          const cdist = Math.hypot(cdx, cdy);
          if (cdist < 110) {
            const lineAlpha = (1 - cdist / 110) * (darkMode ? 0.12 : 0.08);
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.strokeStyle = darkMode
              ? `rgba(255, 255, 255, ${lineAlpha})`
              : `rgba(0, 0, 0, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Draw shape
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);

        const strokeStyle = darkMode
          ? `rgba(255, 255, 255, ${Math.min(0.9, s.opacity * 1.3)})`
          : `rgba(0, 0, 0, ${Math.min(0.85, s.opacity * 1.1)})`;
        const fillStyle = darkMode
          ? `rgba(255, 255, 255, ${s.opacity * 0.18})`
          : `rgba(0, 0, 0, ${s.opacity * 0.09})`;

        ctx.strokeStyle = strokeStyle;
        ctx.fillStyle = fillStyle;
        ctx.lineWidth = 1.25;

        switch (s.type) {
          case 'radar-ring': {
            // Concentric radar ring with crosshair ticks
            ctx.beginPath();
            ctx.arc(0, 0, s.size, 0, Math.PI * 2);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, s.size * 0.45, 0, Math.PI * 2);
            ctx.stroke();

            // Axis ticks
            ctx.beginPath();
            ctx.moveTo(-s.size * 1.2, 0);
            ctx.lineTo(-s.size * 0.7, 0);
            ctx.moveTo(s.size * 0.7, 0);
            ctx.lineTo(s.size * 1.2, 0);
            ctx.moveTo(0, -s.size * 1.2);
            ctx.lineTo(0, -s.size * 0.7);
            ctx.moveTo(0, s.size * 0.7);
            ctx.lineTo(0, s.size * 1.2);
            ctx.stroke();
            break;
          }

          case 'diamond': {
            ctx.beginPath();
            ctx.moveTo(0, -s.size);
            ctx.lineTo(s.size, 0);
            ctx.lineTo(0, s.size);
            ctx.lineTo(-s.size, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
          }

          case 'cross': {
            const arm = s.size * 0.9;
            ctx.beginPath();
            ctx.moveTo(-arm, 0);
            ctx.lineTo(arm, 0);
            ctx.moveTo(0, -arm);
            ctx.lineTo(0, arm);
            ctx.lineWidth = 1.5;
            ctx.stroke();
            break;
          }

          case 'circle': {
            ctx.beginPath();
            ctx.arc(0, 0, s.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            break;
          }

          case 'dot': {
            ctx.beginPath();
            ctx.arc(0, 0, Math.max(2, s.size * 0.35), 0, Math.PI * 2);
            ctx.fillStyle = darkMode
              ? `rgba(255, 255, 255, ${s.opacity * 1.2})`
              : `rgba(0, 0, 0, ${s.opacity * 0.9})`;
            ctx.fill();
            break;
          }

          case 'square': {
            const half = s.size * 0.75;
            ctx.strokeRect(-half, -half, half * 2, half * 2);
            ctx.fillRect(-half, -half, half * 2, half * 2);
            break;
          }
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10 w-full h-full"
      style={{ willChange: 'transform' }}
    />
  );
};
