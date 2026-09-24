import { useEffect, useRef } from 'react';

export default function SolarCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    let rays = [];
    let mouse = { x: 0, y: 0 };

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const createParticles = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      particles = [];
      for (let i = 0; i < 60; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -Math.random() * 0.5 - 0.1,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          hue: Math.random() > 0.5 ? 48 : 142, // gold or green
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.01,
        });
      }
      // Sun rays from top-right
      rays = [];
      for (let i = 0; i < 8; i++) {
        rays.push({
          angle: (Math.PI / 6) + (i * Math.PI / 16),
          width: Math.random() * 80 + 40,
          opacity: Math.random() * 0.04 + 0.02,
          speed: Math.random() * 0.001 + 0.0005,
          offset: Math.random() * Math.PI * 2,
        });
      }
    };

    const drawRays = (time) => {
      const w = canvas.offsetWidth;
      const sunX = w * 0.85;
      const sunY = -50;

      rays.forEach(ray => {
        const pulse = Math.sin(time * ray.speed + ray.offset) * 0.02;
        const angle = ray.angle + pulse;
        const len = Math.max(w, canvas.offsetHeight) * 1.5;

        ctx.save();
        ctx.translate(sunX, sunY);
        ctx.rotate(angle);

        const grad = ctx.createLinearGradient(0, 0, len, 0);
        grad.addColorStop(0, `rgba(255, 200, 50, ${ray.opacity + pulse})`);
        grad.addColorStop(0.5, `rgba(255, 180, 30, ${ray.opacity * 0.3})`);
        grad.addColorStop(1, 'rgba(255, 180, 30, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, -ray.width / 2);
        ctx.lineTo(len, -ray.width * 2);
        ctx.lineTo(len, ray.width * 2);
        ctx.lineTo(0, ray.width / 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });
    };

    const drawParticles = (time) => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        // Parallax with mouse
        const mx = (mouse.x - w / 2) * 0.01;
        const my = (mouse.y - h / 2) * 0.01;

        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const pulseFactor = Math.sin(p.pulse) * 0.3 + 0.7;
        const size = p.size * pulseFactor;
        const opacity = p.opacity * pulseFactor;

        // Glow
        const gradient = ctx.createRadialGradient(
          p.x + mx, p.y + my, 0,
          p.x + mx, p.y + my, size * 4
        );
        gradient.addColorStop(0, `hsla(${p.hue}, 90%, 65%, ${opacity})`);
        gradient.addColorStop(0.5, `hsla(${p.hue}, 90%, 65%, ${opacity * 0.3})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 90%, 65%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x + mx, p.y + my, size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `hsla(${p.hue}, 100%, 80%, ${opacity})`;
        ctx.beginPath();
        ctx.arc(p.x + mx, p.y + my, size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawConnections = () => {
      const maxDist = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.08;
            ctx.strokeStyle = `rgba(234, 179, 8, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    let time = 0;
    const animate = () => {
      time++;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      drawRays(time);
      drawConnections();
      drawParticles(time);

      animationId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    resize();
    createParticles();
    animate();

    window.addEventListener('resize', () => { resize(); createParticles(); });
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="solar-canvas"
      aria-hidden="true"
    />
  );
}
