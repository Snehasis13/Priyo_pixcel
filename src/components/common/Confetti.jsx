import React, { useEffect, useRef } from 'react';

const Confetti = ({ isActive }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!isActive) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 150;
        const colors = ['#EA7704', '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1'];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                w: Math.random() * 10 + 5,
                h: Math.random() * 10 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                dx: Math.random() * 4 - 2,
                dy: Math.random() * 4 + 2,
                tilt: Math.random() * 10,
                tiltAngleIncremental: Math.random() * 0.07 + 0.05,
                tiltAngle: 0
            });
        }

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let activeParticles = 0;

            particles.forEach((p) => {
                p.tiltAngle += p.tiltAngleIncremental;
                p.y += (Math.cos(p.tiltAngle) + 1 + p.dy) / 2;
                p.x += Math.sin(p.tiltAngle) * 2;
                p.tilt = Math.sin(p.tiltAngle) * 15;

                if (p.y < canvas.height) {
                    activeParticles++;
                    ctx.beginPath();
                    ctx.lineWidth = p.w;
                    ctx.strokeStyle = p.color;
                    ctx.moveTo(p.x + p.tilt + p.w / 2, p.y);
                    ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.h);
                    ctx.stroke();
                }
            });

            if (activeParticles > 0) {
                animationFrameId = requestAnimationFrame(render);
            }
        };

        render();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, [isActive]);

    if (!isActive) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[100]"
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default Confetti;
