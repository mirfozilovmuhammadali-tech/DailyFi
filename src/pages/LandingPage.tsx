import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Globe, Cpu, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const heroCanvasRef = useRef<HTMLCanvasElement>(null);
  const flowCanvasRef = useRef<HTMLCanvasElement>(null);
  const macroCanvasRef = useRef<HTMLCanvasElement>(null);

  // Mouse tracking state for Hero tilt reaction
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringHero, setIsHoveringHero] = useState(false);

  // Scroll tracking for animations
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.9]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 1. HERO SECTION 3D INTERACTIVE GOLDEN COIN CANVAS ENGINE
  useEffect(() => {
    const canvas = heroCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = 500;
    let height = canvas.height = 500;

    // 3D Coin geometry
    const vertices: number[][] = [];
    const numPoints = 24;
    const radius = 120;
    const thickness = 20;

    // Generate Front and Back circular faces
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      // Front face
      vertices.push([Math.cos(angle) * radius, Math.sin(angle) * radius, -thickness]);
      // Back face
      vertices.push([Math.cos(angle) * radius, Math.sin(angle) * radius, thickness]);
    }

    // Monogram "D" inside the coin
    const monogram: number[][] = [
      [-40, -50, 0],
      [-40, 50, 0],
      [10, 50, 0],
      [35, 25, 0],
      [35, -25, 0],
      [10, -50, 0]
    ];

    let angleX = 0.4;
    let angleY = 0.5;
    let angleZ = 0.2;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smoothly interpolate rotation towards mouse position
      const targetAngleX = isHoveringHero ? mousePos.y * 1.2 : 0.4;
      const targetAngleY = isHoveringHero ? mousePos.x * 1.2 : 0.5;

      angleX += (targetAngleX - angleX) * 0.05 + 0.005; // Slow idle spin + mouse tilt
      angleY += (targetAngleY - angleY) * 0.05 + 0.01;
      angleZ += 0.003;

      // Project vertices
      const projected: number[][] = [];
      const fov = 400;

      const projectPoint = (x: number, y: number, z: number) => {
        // Rotate Z
        let x1 = x * Math.cos(angleZ) - y * Math.sin(angleZ);
        let y1 = x * Math.sin(angleZ) + y * Math.cos(angleZ);
        let z1 = z;

        // Rotate X
        let y2 = y1 * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = y1 * Math.sin(angleX) + z1 * Math.cos(angleX);
        let x2 = x1;

        // Rotate Y
        let x3 = x2 * Math.cos(angleY) - z2 * Math.sin(angleY);
        let z3 = x2 * Math.sin(angleY) + z2 * Math.cos(angleY);

        const scale = fov / (fov + z3);
        const px = x3 * scale + width / 2;
        const py = y2 * scale + height / 2;
        return [px, py, z3];
      };

      // Draw Monogram "D" inside
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#00f5ff';
      ctx.shadowColor = '#00f5ff';
      ctx.shadowBlur = 15;

      const projectedMono = monogram.map(pt => projectPoint(pt[0], pt[1], pt[2]));
      ctx.moveTo(projectedMono[0][0], projectedMono[0][1]);
      for (let i = 1; i < projectedMono.length; i++) {
        ctx.lineTo(projectedMono[i][0], projectedMono[i][1]);
      }
      ctx.closePath();
      ctx.stroke();

      // Clear shadow for wireframe body
      ctx.shadowBlur = 0;

      // Map coin vertices
      vertices.forEach(pt => {
        // Rotate & Project
        // Rotate Z
        let x1 = pt[0] * Math.cos(angleZ) - pt[1] * Math.sin(angleZ);
        let y1 = pt[0] * Math.sin(angleZ) + pt[1] * Math.cos(angleZ);
        let z1 = pt[2];

        // Rotate X
        let y2 = y1 * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = y1 * Math.sin(angleX) + z1 * Math.cos(angleX);
        let x2 = x1;

        // Rotate Y
        let x3 = x2 * Math.cos(angleY) - z2 * Math.sin(angleY);
        let z3 = x2 * Math.sin(angleY) + z2 * Math.cos(angleY);

        const scale = fov / (fov + z3);
        const px = x3 * scale + width / 2;
        const py = y2 * scale + height / 2;
        projected.push([px, py, z3]);
      });

      // Draw wireframe segments
      ctx.lineWidth = 1.5;
      
      for (let i = 0; i < numPoints; i++) {
        const next = (i + 1) % numPoints;
        const frontIdx = i * 2;
        const backIdx = i * 2 + 1;
        const nextFrontIdx = next * 2;
        const nextBackIdx = next * 2 + 1;

        // Depth cue coloring
        const avgZ = (projected[frontIdx][2] + projected[backIdx][2]) / 2;
        const alpha = Math.max(0.1, 1 - (avgZ + 150) / 300);
        ctx.strokeStyle = `rgba(255, 215, 0, ${alpha})`;

        // Connect Front Face Edge
        ctx.beginPath();
        ctx.moveTo(projected[frontIdx][0], projected[frontIdx][1]);
        ctx.lineTo(projected[nextFrontIdx][0], projected[nextFrontIdx][1]);
        ctx.stroke();

        // Connect Back Face Edge
        ctx.beginPath();
        ctx.moveTo(projected[backIdx][0], projected[backIdx][1]);
        ctx.lineTo(projected[nextBackIdx][0], projected[nextBackIdx][1]);
        ctx.stroke();

        // Connect Front to Back Face (thickness)
        ctx.beginPath();
        ctx.moveTo(projected[frontIdx][0], projected[frontIdx][1]);
        ctx.lineTo(projected[backIdx][0], projected[backIdx][1]);
        ctx.stroke();
      }

      // Draw vertex glowing dots
      projected.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt[0], pt[1], 3, 0, Math.PI * 2);
        ctx.fillStyle = '#00C076'; // Emerald glowing node points
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Resize handler
    const resizeObserver = new ResizeObserver(() => {
      if (canvas.parentElement) {
        width = canvas.width = Math.min(500, canvas.parentElement.clientWidth);
        height = canvas.height = Math.min(500, canvas.parentElement.clientHeight || 500);
      }
    });
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [mousePos, isHoveringHero]);

  // 2. MARKET FLOWS 3D LIQUIDITY PARTICLE WAVES CANVAS ENGINE
  useEffect(() => {
    const canvas = flowCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = 600;

    // Generate liquidity particles
    const particles: Array<{
      x: number;
      y: number;
      speedY: number;
      amplitude: number;
      frequency: number;
      phase: number;
      size: number;
      color: string;
    }> = [];

    const numParticles = 80;
    const colors = ['rgba(0, 245, 255, 0.4)', 'rgba(0, 192, 118, 0.4)', 'rgba(255, 215, 0, 0.3)'];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height + height, // Start off bottom
        speedY: Math.random() * 1.5 + 0.5,
        amplitude: Math.random() * 40 + 10,
        frequency: Math.random() * 0.005 + 0.002,
        phase: Math.random() * Math.PI * 2,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw beautiful liquidity sine waves in background
      ctx.lineWidth = 1;
      const drawSineWave = (offsetY: number, amplitude: number, freq: number, phase: number, color: string) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        for (let x = 0; x < width; x += 5) {
          const y = offsetY + Math.sin(x * freq + phase) * amplitude;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      };

      const time = Date.now() * 0.002;
      drawSineWave(height * 0.5, 40, 0.003, time, 'rgba(0, 245, 255, 0.1)');
      drawSineWave(height * 0.55, 25, 0.005, -time * 0.8, 'rgba(0, 192, 118, 0.08)');
      drawSineWave(height * 0.45, 30, 0.002, time * 1.2, 'rgba(255, 215, 0, 0.06)');

      // Draw and update rising liquidity particles
      particles.forEach(p => {
        p.y -= p.speedY;
        p.phase += 0.01;
        const waveX = p.x + Math.sin(p.y * p.frequency + p.phase) * p.amplitude;

        // Reset particle if it leaves top boundary
        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(waveX, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 3. MACRO DESK 3D DYNAMIC GRID LINES & EXPANDING BARS ENGINE
  useEffect(() => {
    const canvas = macroCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = 500;
    let height = canvas.height = 400;

    // Isometric Grid configuration
    const cols = 8;
    const rows = 8;
    const gridSpacing = 40;

    let barsProgress = 0;

    // Static bar chart values (DXY, Yields, M2, Gold indicators)
    const barHeights = [120, 180, 80, 240, 140, 200, 90, 160];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Animate bar growth
      if (barsProgress < 1) {
        barsProgress += 0.015;
      }

      // Draw isometric grid lines
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.05)';
      ctx.lineWidth = 1;

      const isoProject = (x: number, y: number, z: number) => {
        // Simple isometric projection mapping
        const isoX = (x - y) * Math.cos(Math.PI / 6);
        const isoY = (x + y) * Math.sin(Math.PI / 6) - z;
        return [isoX + width / 2, isoY + height / 2 + 50];
      };

      // Draw Grid on Z = 0
      for (let r = 0; r <= rows; r++) {
        const p1 = isoProject(-cols * gridSpacing / 2, (r - rows / 2) * gridSpacing, 0);
        const p2 = isoProject(cols * gridSpacing / 2, (r - rows / 2) * gridSpacing, 0);
        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.stroke();
      }

      for (let c = 0; c <= cols; c++) {
        const p1 = isoProject((c - cols / 2) * gridSpacing, -rows * gridSpacing / 2, 0);
        const p2 = isoProject((c - cols / 2) * gridSpacing, rows * gridSpacing / 2, 0);
        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.stroke();
      }

      // Draw 3D glowing columns rising from the matrix grid
      barHeights.forEach((h, index) => {
        const c = index - cols / 2 + 0.5;
        const r = 0; // Center row
        const currentH = h * Math.min(1, barsProgress);

        const xPos = c * gridSpacing;
        const yPos = r * gridSpacing;

        // Column vertices
        const bottomFront = isoProject(xPos, yPos, 0);
        const topFront = isoProject(xPos, yPos, currentH);
        const topBack = isoProject(xPos - 15, yPos - 15, currentH);
        const topRight = isoProject(xPos + 15, yPos - 15, currentH);

        // Draw glowing laser edges
        ctx.strokeStyle = index % 2 === 0 ? 'rgba(0, 245, 255, 0.8)' : 'rgba(255, 215, 0, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bottomFront[0], bottomFront[1]);
        ctx.lineTo(topFront[0], topFront[1]);
        ctx.stroke();

        // Connect 3D top face wireframe
        ctx.beginPath();
        ctx.moveTo(topFront[0], topFront[1]);
        ctx.lineTo(topBack[0], topBack[1]);
        ctx.lineTo(topRight[0], topRight[1]);
        ctx.closePath();
        ctx.fillStyle = index % 2 === 0 ? 'rgba(0, 245, 255, 0.15)' : 'rgba(255, 215, 0, 0.15)';
        ctx.fill();
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="bg-[#05060B] min-h-screen text-gray-200 overflow-x-hidden relative selection:bg-cyan selection:text-black"
    >
      {/* Cinematic grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
      
      {/* Left-top micro ambient laser line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan/40 to-transparent"></div>

      {/* Floating ultra-premium transparent glass nav bar */}
      <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-md border-b border-white/5 bg-black/20">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-gold via-gold-dark to-gold-light rounded-lg rotate-45 shadow-[0_0_15px_rgba(234,179,8,0.25)]"></div>
            <span className="relative z-10 text-black font-heading font-black text-lg">D</span>
          </div>
          <span className="font-heading font-bold text-xl tracking-[0.2em] text-white">DAILY<span className="text-gold">FI</span></span>
        </div>
        <button 
          onClick={() => navigate('/overview')}
          className="px-5 py-2 rounded-full border border-cyan/20 bg-cyan/5 text-cyan text-xs font-black uppercase tracking-widest hover:bg-cyan/15 hover:shadow-[0_0_15px_rgba(0,245,255,0.3)] transition-all active:scale-95 flex items-center gap-2"
        >
          Enter Terminal <ArrowRight size={12} />
        </button>
      </header>

      {/* SECTION 1: HERO VIEWPORT (Above the fold) */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="min-h-[90vh] flex flex-col lg:flex-row items-center justify-center px-6 md:px-12 max-w-7xl mx-auto gap-8 relative py-12"
      >
        {/* Texts and Action CTA */}
        <div className="flex-1 space-y-8 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/5 border border-gold/20 text-xs font-bold text-gold tracking-widest uppercase">
            <Cpu size={12} className="animate-spin text-gold" />
            <span>QUANTUM FINANCIAL SYSTEMS</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black tracking-tight text-white leading-tight uppercase">
            DAILYFI: THE ELITE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-gold to-cyan bg-[size:200%] animate-pulse">MACRO TERMINAL</span>
          </h1>

          <p className="text-gray-400 max-w-xl text-base md:text-lg leading-relaxed font-medium">
            Bridging institutional liquidity metrics, real-time macro indicators, and live simulation deployment. Welcome to next-generation algorithmic risk management.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            {/* Enter Live Desk with laser glowing border */}
            <button 
              onClick={() => navigate('/overview')}
              className="relative px-8 py-4 rounded-xl bg-black border border-cyan text-cyan font-black text-sm uppercase tracking-widest overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,245,255,0.45)] hover:scale-105 group active:scale-95"
            >
              <span className="absolute inset-0 w-full h-full bg-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              Enter Live Desk
            </button>

            <a 
              href="#market-flows"
              className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* 3D Golden Coin Sphere Centerpiece */}
        <div 
          onMouseEnter={() => setIsHoveringHero(true)}
          onMouseLeave={() => setIsHoveringHero(false)}
          className="flex-1 w-full max-w-[450px] aspect-square flex items-center justify-center relative cursor-grab active:cursor-grabbing"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan/5 via-transparent to-gold/5 rounded-full blur-[80px] -z-10 animate-pulse"></div>
          <canvas ref={heroCanvasRef} className="w-full h-full max-w-[450px] max-h-[450px]" />
        </div>
      </motion.section>

      {/* SECTION 2: MARKET FLOWS (Scroll-driven dynamic wave background) */}
      <section id="market-flows" className="min-h-screen relative flex items-center py-24 px-6 md:px-12">
        <div className="absolute inset-0 pointer-events-none">
          <canvas ref={flowCanvasRef} className="w-full h-full object-cover opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-cyan/10 border border-cyan/20 text-[10px] font-black text-cyan tracking-widest uppercase">
              <Zap size={10} />
              <span>Exchange Matrix</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-tight">
              Real-Time <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-bullish">Exchange Data Flows</span>
            </h2>

            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              Monitor real-time liquidity pools, token spreads, and order book volumes dynamically mapped over historical correlation indices.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Aggregate Volatility</div>
                <div className="text-xl font-mono font-bold text-white mt-1">1.84%</div>
              </div>
              <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Global Order Book Depth</div>
                <div className="text-xl font-mono font-bold text-white mt-1">$4.2B</div>
              </div>
            </div>
          </div>

          {/* Premium Glassmorphic Cards */}
          <div className="space-y-6">
            <div className="glass-card-laser p-6 bg-black/60 border-white/5">
              <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-4">
                <span className="text-xs font-black text-white uppercase tracking-widest">BTC / USD Spot</span>
                <span className="text-xs font-bold text-bullish">+2.41%</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-mono font-black text-white">$67,392.50</span>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Spread: $0.12</span>
              </div>
            </div>

            <div className="glass-card-laser p-6 bg-black/60 border-white/5">
              <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-4">
                <span className="text-xs font-black text-white uppercase tracking-widest">ETH / USD Spot</span>
                <span className="text-xs font-bold text-bullish">+1.85%</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-mono font-black text-white">$3,584.10</span>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Spread: $0.04</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: MACRO ECONOMIC DESK */}
      <section className="min-h-screen relative flex items-center py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Animated Matrix Grid/Barchart Canvas container */}
          <div className="w-full flex justify-center items-center">
            <div className="relative w-full max-w-[450px] aspect-square flex items-center justify-center">
              <div className="absolute inset-0 bg-cyan/5 rounded-full blur-[80px]"></div>
              <canvas ref={macroCanvasRef} className="w-full h-full max-w-[450px] max-h-[400px]" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-gold/10 border border-gold/20 text-[10px] font-black text-gold tracking-widest uppercase">
              <Globe size={10} className="text-gold" />
              <span>Macro Desk</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-tight">
              Sovereign Yields <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-light">DXY & M2 Liquidity</span>
            </h2>

            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              Track global credit markets, DXY strength indicators, and Federal Reserve balance sheet expansion rates connected in real-time.
            </p>

            <div className="glass-card-laser p-6 bg-black/40 border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-300">10-Year Treasury Yield (US10Y)</span>
                <span className="font-mono text-xs text-white font-bold">4.25%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gold w-[42.5%] rounded-full"></div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-gray-300">DXY Index Strength</span>
                <span className="font-mono text-xs text-white font-bold">103.50</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-cyan w-[78%] rounded-full"></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 px-6 backdrop-blur-md bg-black/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-gold rounded rotate-45"></div>
              <span className="relative z-10 text-black font-heading font-black text-sm">D</span>
            </div>
            <span className="font-heading font-bold text-sm tracking-[0.2em] text-white">DAILYFI</span>
          </div>

          <p className="text-gray-600 text-xs font-medium">
            &copy; 2026 DAILYFI. Institutional Algorithmic Terminal. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-xs font-black text-gray-500 uppercase tracking-widest">
            <span className="flex items-center gap-1.5 text-bullish">
              <ShieldCheck size={14} /> Certified Secure
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
