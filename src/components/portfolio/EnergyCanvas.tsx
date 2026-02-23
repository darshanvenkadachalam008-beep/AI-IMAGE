import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

interface Trail {
  points: { x: number; y: number; alpha: number }[];
  hue: number;
  speed: number;
  angle: number;
  x: number;
  y: number;
}

const EnergyCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];
    const trails: Trail[] = [];
    const sigils: { x: number; y: number; radius: number; rotation: number; speed: number; hue: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    // Init sigils
    for (let i = 0; i < 3; i++) {
      sigils.push({
        x: Math.random() * W(),
        y: Math.random() * H(),
        radius: 40 + Math.random() * 60,
        rotation: Math.random() * Math.PI * 2,
        speed: (0.002 + Math.random() * 0.004) * (Math.random() > 0.5 ? 1 : -1),
        hue: [15, 210, 280][i],
      });
    }

    // Init trails
    const spawnTrail = () => {
      const side = Math.random();
      const hue = Math.random() > 0.5 ? 15 + Math.random() * 20 : 200 + Math.random() * 20;
      trails.push({
        points: [],
        hue,
        speed: 3 + Math.random() * 4,
        angle: side > 0.5 ? Math.PI + (Math.random() - 0.5) * 0.5 : (Math.random() - 0.5) * 0.5,
        x: side > 0.5 ? W() + 10 : -10,
        y: H() * 0.2 + Math.random() * H() * 0.6,
      });
    };

    const spawnParticles = (x: number, y: number, hue: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1.5;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 40 + Math.random() * 40,
          size: 1 + Math.random() * 2,
          hue,
        });
      }
    };

    let frame = 0;
    const draw = () => {
      const w = W();
      const h = H();
      ctx.clearRect(0, 0, w, h);

      frame++;
      if (frame % 90 === 0 && trails.length < 5) spawnTrail();

      // Draw sigils
      sigils.forEach((s) => {
        s.rotation += s.speed;
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.strokeStyle = `hsla(${s.hue}, 80%, 55%, 0.08)`;
        ctx.lineWidth = 1;
        // Outer ring
        ctx.beginPath();
        ctx.arc(0, 0, s.radius, 0, Math.PI * 2);
        ctx.stroke();
        // Inner rune marks
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * s.radius * 0.6, Math.sin(a) * s.radius * 0.6);
          ctx.lineTo(Math.cos(a) * s.radius * 0.85, Math.sin(a) * s.radius * 0.85);
          ctx.stroke();
        }
        // Inner circle
        ctx.beginPath();
        ctx.arc(0, 0, s.radius * 0.4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      // Update & draw trails
      for (let t = trails.length - 1; t >= 0; t--) {
        const trail = trails[t];
        trail.x += Math.cos(trail.angle) * trail.speed;
        trail.y += Math.sin(trail.angle) * trail.speed * 0.3;
        trail.points.push({ x: trail.x, y: trail.y, alpha: 1 });

        // Age points
        trail.points.forEach((p) => (p.alpha -= 0.02));
        trail.points = trail.points.filter((p) => p.alpha > 0);

        // Draw trail
        if (trail.points.length > 1) {
          for (let i = 1; i < trail.points.length; i++) {
            const p = trail.points[i];
            const prev = trail.points[i - 1];
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `hsla(${trail.hue}, 90%, 60%, ${p.alpha * 0.5})`;
            ctx.lineWidth = 2 * p.alpha;
            ctx.stroke();
          }
          // Head glow
          const head = trail.points[trail.points.length - 1];
          ctx.beginPath();
          ctx.arc(head.x, head.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${trail.hue}, 90%, 70%, ${head.alpha * 0.8})`;
          ctx.fill();
        }

        // Emit particles from trail head
        if (frame % 5 === 0) spawnParticles(trail.x, trail.y, trail.hue, 2);

        // Remove off-screen trails
        if (trail.x < -50 || trail.x > w + 50 || trail.points.length === 0) {
          trails.splice(t, 1);
        }
      }

      // Update & draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.01; // gravity
        p.life -= 1 / p.maxLife;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 85%, 60%, ${p.life * 0.6})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
};

export default EnergyCanvas;
