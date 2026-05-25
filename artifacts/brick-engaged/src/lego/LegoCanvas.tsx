import React, { useRef, useEffect } from 'react';
import { BrickAnimatedState, BrickTemplate, BrickColorOption, LegoModel, Particle, Minifig } from './types';

interface LegoCanvasProps {
  activeModel: LegoModel;
  buildSpeed: number; // multiplier (0.5x - 3x)
  bounceForce: number; // 0.1 - 0.9 (spring tightness)
  gravity: number; // gravity acceleration
  spawnStagger: number; // delay between spawns
  debugGrid: boolean;
  isPlaying: boolean;
  clickToPop: boolean;
  onBrickDocked: (totalDocked: number, totalModelBricks: number) => void;
}

// Map logical color options to hex values
export function getColorHex(color: BrickColorOption, isStud = false): string {
  if (isStud) {
    switch (color) {
      case 'red': return '#C22E2E';
      case 'blue': return '#1D4ED8';
      case 'yellow': return '#D97706';
      case 'green': return '#047857';
      case 'orange': return '#EA580C';
      case 'cyan': return '#0E7490';
      case 'white': return '#E5E7EB';
      case 'gray': return '#9CA3AF';
      case 'dark-gray': return '#374151';
      case 'black': return '#111827';
      default: return '#374151';
    }
  }
  switch (color) {
    case 'red': return '#EF4444';
    case 'blue': return '#3B82F6';
    case 'yellow': return '#F59E0B';
    case 'green': return '#10B981';
    case 'orange': return '#F97316';
    case 'cyan': return '#06B6D4';
    case 'white': return '#F9FAFB';
    case 'gray': return '#D1D5DB';
    case 'dark-gray': return '#4B5563';
    case 'black': return '#1F2937';
    default: return '#1F2937';
  }
}

export function getParticleColors(color: BrickColorOption): string[] {
  const base = getColorHex(color);
  const stud = getColorHex(color, true);
  return [base, stud, '#FFFFFF'];
}

export const LegoCanvas: React.FC<LegoCanvasProps> = ({
  activeModel,
  buildSpeed,
  bounceForce,
  gravity,
  spawnStagger,
  debugGrid,
  isPlaying,
  clickToPop,
  onBrickDocked
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // States managed in refs for high-frequency physics loop
  const bricksRef = useRef<BrickAnimatedState[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const minifigsRef = useRef<Minifig[]>([]);
  const castleCompleteRef = useRef(false);
  const dragRef = useRef<{
    brickIndex: number;
    offsetX: number;
    offsetY: number;
    cursorX: number;
    cursorY: number;
    velX: number;
    velY: number;
    prevX: number;
    prevY: number;
    prevTime: number;
    startX: number;
    startY: number;
  } | null>(null);
  const animTimeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);

  // Configuration helper — castle is exactly 32 grid units wide, scale to fill canvas edge-to-edge
  const getLayoutConfig = (canvasWidth: number) => {
    const unitW = Math.max(10, Math.floor(canvasWidth / 32));
    const unitH = Math.round(unitW * 0.67);
    return { unitW, unitH, padding: 0, margin: 0 };
  };

  // Layout parameters reference for high-performance physics and draws
  const layoutRef = useRef({ unitW: 26, unitH: 18, padding: 0, margin: 0 });

  // Sound/haptic triggers on snap
  const triggerSnapEffects = (brick: BrickAnimatedState, x: number, y: number) => {
    const { unitW: gridUnitWidth, unitH: gridUnitHeight } = layoutRef.current;
    // 1. Spawning dynamic colorful lego particles
    const splashColors = getParticleColors(brick.template.color);
    const w = brick.template.gridW * gridUnitWidth;
    const h = brick.template.gridH * gridUnitHeight;
    const particleCount = 14 + Math.floor(brick.template.gridW * 3);

    for (let i = 0; i < particleCount; i++) {
      const isStud = i % 3 === 0; // every 3rd particle is a round stud
      const size = isStud
        ? Math.random() * 3.5 + 2    // small round studs
        : Math.random() * 7 + 3.5;   // larger brick fragment chips
      particlesRef.current.push({
        id: Math.random().toString(36).substr(2, 9),
        x: x + w * 0.1 + Math.random() * w * 0.8,
        y: y + h - 2 + (Math.random() * 6 - 3),
        vx: (Math.random() - 0.5) * 11,
        vy: -Math.random() * 9 - 3.5, // strong upward burst
        color: splashColors[Math.floor(Math.random() * splashColors.length)],
        size,
        alpha: 1,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.35,
        life: 1
      });
    }

    // 2. Count docked bricks and notify parent
    const dockedCount = bricksRef.current.filter((b) => b.status === 'docked').length;
    onBrickDocked(dockedCount, bricksRef.current.length);
  };

  // Build the logical bricks sequence from the active model
  const initBricks = (width: number, height: number) => {
    const { unitW: gridUnitWidth, unitH: gridUnitHeight } = layoutRef.current;
    // Sort model bricks bottom-to-top (lower gridY first) to enforce physical building hierarchy!
    // Within the same row, mix slightly or start from sides to center for professional symmetry pacing
    const templates = [...activeModel.bricks].sort((a, b) => {
      if (a.gridY !== b.gridY) return a.gridY - b.gridY;
      // symmetric sorting order
      const distA = Math.abs(a.gridX);
      const distB = Math.abs(b.gridX);
      return distB - distA; // broader elements fall first
    });

    const brickStates: BrickAnimatedState[] = templates.map((tmpl, index) => {
      const w = tmpl.gridW * gridUnitWidth;
      const h = tmpl.gridH * gridUnitHeight;

      // Calculate initial target coordinates
      const targets = calculateTargetCoords(tmpl, width, height);

      return {
        id: tmpl.id,
        template: tmpl,
        status: 'waiting',
        currentX: targets.x + (Math.random() - 0.5) * 160,
        currentY: -100 - (Math.random() * 50),
        currentRot: (Math.random() - 0.5) * 0.4,
        vx: (Math.random() - 0.5) * 2,
        vy: 0,
        vRot: (Math.random() - 0.5) * 0.03,
        spawnTime: index * spawnStagger, // stagger delays
        snapProgress: 0,
        targetX: targets.x,
        targetY: targets.y
      };
    });

    bricksRef.current = brickStates;
    particlesRef.current = [];
    animTimeRef.current = 0;

    // reset total count to 0
    onBrickDocked(0, brickStates.length);
  };

  // Layout target coordinate mapper
  const calculateTargetCoords = (tmpl: BrickTemplate, cWidth: number, cHeight: number) => {
    const { unitW: gridUnitWidth, unitH: gridUnitHeight, padding: bottomPadding } = layoutRef.current;
    let x = 0;

    // Center the complete unified design perfectly on the screen
    let baseCenterX = cWidth / 2;

    // Define model-specific offsets to bring the structures perfectly together symmetrically
    let leftOffset = -14;
    let rightOffset = 6;

    if (activeModel.id === 'castle') {
      leftOffset = -16;
      rightOffset = 8;
    } else if (activeModel.id === 'bridge') {
      leftOffset = -14;
      rightOffset = 8;
    } else if (activeModel.id === 'space') {
      leftOffset = -11;
      rightOffset = 5;
    }

    if (tmpl.anchor === 'left') {
      x = baseCenterX + (tmpl.gridX + leftOffset) * gridUnitWidth;
    } else if (tmpl.anchor === 'right') {
      x = baseCenterX + (tmpl.gridX + rightOffset) * gridUnitWidth;
    } else {
      x = baseCenterX + tmpl.gridX * gridUnitWidth;
    }

    const y = cHeight - bottomPadding - (tmpl.gridY + tmpl.gridH) * gridUnitHeight;
    return { x, y };
  };

  // Recalculate targets on window resize
  const handleResize = () => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const rect = containerRef.current.getBoundingClientRect();

    // Update layout config based on container width
    layoutRef.current = getLayoutConfig(rect.width);

    // Set internal resolution with double scale for high-DPI displays (retina)
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    // Apply exact styling dimensions
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Recalculate target position for all bricks on resize
    bricksRef.current = bricksRef.current.map((brick) => {
      const targets = calculateTargetCoords(brick.template, rect.width, rect.height);
      // If docked, snap immediately. If waiting/falling, adjust targets
      if (brick.status === 'docked') {
        return {
          ...brick,
          targetX: targets.x,
          targetY: targets.y,
          currentX: targets.x,
          currentY: targets.y
        };
      }
      return {
        ...brick,
        targetX: targets.x,
        targetY: targets.y
      };
    });
  };

  // Listen to window size changes
  useEffect(() => {
    handleResize();
    const ro = new ResizeObserver(() => handleResize());
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', handleResize);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [activeModel]); // Re-init entire model targets and templates when model matches

  // Initialize model whenever properties change
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      initBricks(width, height);
    }
  }, [activeModel, spawnStagger]);

  // Main animation / physics loop
  useEffect(() => {
    lastTimeRef.current = performance.now();

    const update = (timestamp: number) => {
      if (!canvasRef.current || !canvasRef.current.getContext) return;
      const { unitW: gridUnitWidth, unitH: gridUnitHeight, padding: bottomPadding } = layoutRef.current;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      if (!ctx) return;

      // Calculate time delta (stretching or contracting by speed coefficient)
      let dt = (timestamp - lastTimeRef.current) * buildSpeed;
      if (dt > 100) dt = 16.66; // protect against tab freezing lag
      lastTimeRef.current = timestamp;

      if (isPlaying) {
        animTimeRef.current += dt;
      }

      // PHYSICS UPDATES
      if (isPlaying) {
        bricksRef.current.forEach((brick, idx) => {
          // 0. Dragged brick follows cursor exactly — skip all physics
          if (dragRef.current?.brickIndex === idx) {
            brick.currentX = dragRef.current.cursorX - dragRef.current.offsetX;
            brick.currentY = dragRef.current.cursorY - dragRef.current.offsetY;
            brick.currentRot = 0;
            brick.vx = 0; brick.vy = 0; brick.vRot = 0;
            return;
          }

          // 1. Spawning waiting bricks
          if (brick.status === 'waiting' && animTimeRef.current >= brick.spawnTime) {
            brick.status = 'falling';
            // Start slightly above offscreen, with random tumble
            brick.currentY = -40;
            const targets = calculateTargetCoords(brick.template, width, height);
            brick.currentX = targets.x + (Math.random() - 0.5) * 140;
            brick.currentRot = (Math.random() - 0.5) * 0.45;
            brick.vy = 0.5;
            brick.vx = (Math.random() - 0.5) * 1.5;
            brick.vRot = (Math.random() - 0.5) * 0.02;
          }

          // 2. Falling simulation
          if (brick.status === 'falling') {
            // Apply gravity
            brick.vy += gravity * (dt / 16.66);
            brick.currentX += brick.vx * (dt / 16.66);
            brick.currentY += brick.vy * (dt / 16.66);
            brick.currentRot += brick.vRot * (dt / 16.66);

            // Snapping entry boundary check: 52px away from destination
            const dy = brick.targetY - brick.currentY;
            if (dy <= 52) {
              brick.status = 'snapping';
            }
          }

          // 3. Magnetic spring elastic snap simulation
          if (brick.status === 'snapping') {
            const dx = brick.targetX - brick.currentX;
            const dy = brick.targetY - brick.currentY;
            const dRot = 0 - brick.currentRot;

            // Spring constant settings (bounceForce controls responsiveness)
            const k = 0.18 + (bounceForce * 0.15); // spring strength
            const damping = 0.58 + (bounceForce * 0.05); // damping friction factor

            const ax = dx * k;
            const ay = dy * k;
            const aRot = dRot * k;

            brick.vx = (brick.vx + ax) * damping;
            brick.vy = (brick.vy + ay) * damping;
            brick.vRot = (brick.vRot + aRot) * damping;

            brick.currentX += brick.vx * (dt / 16.66);
            brick.currentY += brick.vy * (dt / 16.66);
            brick.currentRot += brick.vRot * (dt / 16.66);

            // Docking alignment threshold
            const totalDistSq = dx * dx + dy * dy;
            if (totalDistSq < 0.25 && Math.abs(brick.vy) < 0.15 && Math.abs(brick.vRot) < 0.015) {
              brick.status = 'docked';
              brick.currentX = brick.targetX;
              brick.currentY = brick.targetY;
              brick.currentRot = 0;
              brick.vx = 0;
              brick.vy = 0;
              brick.vRot = 0;
              triggerSnapEffects(brick, brick.targetX, brick.targetY);
            }
          }
        });
      }

      // MINIFIG SPAWN + PHYSICS
      if (isPlaying && !castleCompleteRef.current && bricksRef.current.length > 0) {
        const docked = bricksRef.current.filter(b => b.status === 'docked').length;
        if (docked >= bricksRef.current.length) {
          castleCompleteRef.current = true;
          const palette = [
            { body: '#EF4444', pants: '#B91C1C' },
            { body: '#3B82F6', pants: '#1D4ED8' },
            { body: '#F59E0B', pants: '#B45309' },
            { body: '#10B981', pants: '#047857' },
          ];
          minifigsRef.current = palette.map((c, i) => ({
            id: `mf-${i}`,
            x: i < 2 ? -50 - i * 80 : width + 50 + (i - 2) * 80,
            y: height,
            vx: i < 2 ? 1.5 + i * 0.4 : -(1.5 + (i - 2) * 0.4),
            animPhase: i * (Math.PI / 2),
            bodyColor: c.body,
            pantsColor: c.pants,
          }));
        }
      }

      if (isPlaying) {
        minifigsRef.current.forEach(mf => {
          mf.x += mf.vx * (dt / 16.66);
          mf.animPhase += Math.abs(mf.vx) * 0.10 * (dt / 16.66);
          if (mf.x < 24) { mf.x = 24; mf.vx = Math.abs(mf.vx); }
          else if (mf.x > width - 24) { mf.x = width - 24; mf.vx = -Math.abs(mf.vx); }
        });
      }

      // PARTICLES UPDATES
      particlesRef.current.forEach((p) => {
        p.vy += 0.22; // gravity pulling particles down
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.life -= 0.017; // fade away
        if (p.life < 0) p.life = 0;
      });
      // Purge dead particles
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

      // CANVAS RENDERING
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Architectural Snap-Grid Guide (Debug helper)
      if (debugGrid) {
        ctx.strokeStyle = 'rgba(75, 85, 99, 0.08)';
        ctx.lineWidth = 1;

        // Draw bottom ground line limit
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.moveTo(0, height - bottomPadding);
        ctx.lineTo(width, height - bottomPadding);
        ctx.stroke();

        // Draw horizontal snapping guides
        for (let r = 0; r < 14; r++) {
          const y = height - bottomPadding - (r + 1) * gridUnitHeight;
          ctx.beginPath();
          ctx.moveTo(24, y);
          ctx.lineTo(width - 24, y);
          ctx.stroke();
        }

        // Draw side columns
        ctx.fillStyle = 'rgba(75, 85, 99, 0.3)';
        ctx.font = '8px monospace';
        ctx.fillText("GRID SNAPPING OFFSETS", 16, height - 12);
        ctx.fillText(`ACTIVE PIECES: ${bricksRef.current.length} | PARTICLES: ${particlesRef.current.length}`, width - 240, height - 12);
        ctx.setLineDash([]);
      }

      // 2. (no ground baseplate — castle is flush to the canvas bottom)

      // 3. Render LEGO Bricks
      // Group rendering: docked first, falling on top, dragged brick always last (topmost)
      const draggedIdx = dragRef.current?.brickIndex ?? -1;
      const sortedBricks = bricksRef.current
        .map((brick, idx) => ({ brick, idx }))
        .sort((a, b) => {
          if (a.idx === draggedIdx) return 1;
          if (b.idx === draggedIdx) return -1;
          const orderMap: Record<string, number> = { docked: 1, snapping: 2, falling: 3, waiting: 0 };
          return (orderMap[a.brick.status] ?? 0) - (orderMap[b.brick.status] ?? 0);
        });

      sortedBricks.forEach(({ brick, idx }) => {
        if (brick.status === 'waiting') return; // hide not yet spawned pieces
        drawBrick(ctx, brick, idx === draggedIdx);
      });

      // 4. Render Particle Bursts
      particlesRef.current.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.life * p.life; // quadratic fade — stays bright, then drops fast

        if (p.size <= 5.5) {
          // Round stud particles
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
          // Bright highlight on top of stud
          ctx.fillStyle = 'rgba(255,255,255,0.45)';
          ctx.beginPath();
          ctx.arc(-p.size * 0.12, -p.size * 0.15, p.size * 0.22, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Brick chip fragments — flat rectangular with slight 3D shading
          const fw = p.size;
          const fh = p.size * 0.55;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.roundRect(-fw / 2, -fh / 2, fw, fh, 1.5);
          ctx.fill();
          // Top highlight strip
          ctx.fillStyle = 'rgba(255,255,255,0.3)';
          ctx.beginPath();
          ctx.roundRect(-fw / 2 + 1, -fh / 2 + 1, fw * 0.55, 1.5, 0.5);
          ctx.fill();
          // Bottom shadow strip
          ctx.fillStyle = 'rgba(0,0,0,0.18)';
          ctx.fillRect(-fw / 2, fh / 2 - 1.5, fw, 1.5);
        }
        ctx.restore();
      });

      // 5. Render Minifig Characters
      minifigsRef.current.forEach(mf => {
        drawMinifig(ctx, mf.x, mf.y, mf.vx, mf.animPhase, mf.bodyColor, mf.pantsColor, gridUnitHeight);
      });

      ctx.globalAlpha = 1.0; // reset transparency

      // Loop animation frame
      animationFrameIdRef.current = requestAnimationFrame(update);
    };

    animationFrameIdRef.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isPlaying, buildSpeed, bounceForce, gravity]);

  // Vector graphics brick drawing helper
  const drawBrick = (ctx: CanvasRenderingContext2D, brick: BrickAnimatedState, lifted = false) => {
    const { unitW: gridUnitWidth, unitH: gridUnitHeight } = layoutRef.current;
    const tmpl = brick.template;
    const w = tmpl.gridW * gridUnitWidth;
    const h = tmpl.gridH * gridUnitHeight;

    ctx.save();
    // Shift axis to the geometric center of the brick to allow beautiful realistic tumbling rotation
    ctx.translate(brick.currentX + w / 2, brick.currentY + h / 2);
    ctx.rotate(brick.currentRot);

    // Drop shadow when held — gives a satisfying "lifted off the table" feel
    if (lifted) {
      ctx.shadowColor = 'rgba(0,0,0,0.45)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 10;
    }

    const baseColor = getColorHex(tmpl.color);
    const studColor = getColorHex(tmpl.color, true);

    // Subtle flat standard lighting: highlight on top, shadow on bottom to appear rounded 2D
    const highlightColor = 'rgba(255, 255, 255, 0.18)';
    const shadowColor = 'rgba(0, 0, 0, 0.14)';

    // ---- A) Premium Studs ----
    const numStuds = tmpl.gridW;
    const studW = gridUnitWidth * 0.64;
    const studH = 5;

    for (let i = 0; i < numStuds; i++) {
      const studX = -w / 2 + i * gridUnitWidth + (gridUnitWidth - studW) / 2;
      const sy = -h / 2 - studH + 0.5;

      // Stud cylinder — fully rounded top profile
      ctx.fillStyle = studColor;
      ctx.beginPath();
      ctx.roundRect(studX, sy, studW, studH + 1.5, [studW * 0.44, studW * 0.44, 2, 2]);
      ctx.fill();

      // Specular oval highlight on stud top
      ctx.fillStyle = 'rgba(255,255,255,0.38)';
      ctx.beginPath();
      ctx.ellipse(studX + studW * 0.36, sy + 1.6, studW * 0.26, 1.15, 0, 0, Math.PI * 2);
      ctx.fill();

      // Stud bottom rim shadow
      ctx.fillStyle = 'rgba(0,0,0,0.14)';
      ctx.fillRect(studX + 1, sy + studH - 0.5, studW - 2, 1.5);
    }

    // ---- B) Draw Shape Outlines / Path fills ----
    ctx.fillStyle = baseColor;

    if (tmpl.type === 'rect') {
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, 2.5);
      ctx.fill();

    } else if (tmpl.type === 'arch') {
      // Full solid brick body
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, 2.5);
      ctx.fill();

      // Arch opening — dark window/gateway with rounded top corners
      const pillarW = Math.max(3, gridUnitWidth * 0.5);
      const lintelH = Math.max(2, h * 0.18);
      const openW = w - pillarW * 2;
      const openH = h - lintelH;
      const cornerR = Math.min(openW / 2, openH * 0.48);

      ctx.fillStyle = 'rgba(10, 12, 25, 0.78)';
      ctx.beginPath();
      ctx.roundRect(-openW / 2, -h / 2 + lintelH, openW, openH + 1, [cornerR, cornerR, 0, 0]);
      ctx.fill();

    } else if (tmpl.type === 'slope-left') {
      ctx.beginPath();
      ctx.moveTo(-w / 2, h / 2);
      ctx.lineTo(-w / 2, h / 2 - 3); // low left height
      ctx.lineTo(w / 2, -h / 2); // full right height
      ctx.lineTo(w / 2, h / 2);
      ctx.closePath();
      ctx.fill();

    } else if (tmpl.type === 'slope-right') {
      ctx.beginPath();
      ctx.moveTo(-w / 2, -h / 2); // full left height
      ctx.lineTo(w / 2, h / 2 - 3); // low right height
      ctx.lineTo(w / 2, h / 2);
      ctx.lineTo(-w / 2, h / 2);
      ctx.closePath();
      ctx.fill();

    } else if (tmpl.type === 'parapet') {
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, 1.5);
      ctx.fill();

      // Architectural battlement capping plate line
      ctx.fillStyle = shadowColor;
      ctx.fillRect(-w/2, -h/2 + 2, w, 2);

    } else if (tmpl.type === 'flag') {
      // 1. Draw Base mounting blocks
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, 2);
      ctx.fill();

      // 2. Rising metallic flagpole
      const centerPoleX = 0;
      const poleW = 2;
      const poleH = gridUnitHeight * 2.8;
      const poleStartY = -h / 2;

      ctx.fillStyle = '#9CA3AF'; // metallic silver grey
      ctx.fillRect(centerPoleX - poleW / 2, poleStartY - poleH, poleW, poleH);

      // Gold stud bead on top of flagpole
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(centerPoleX, poleStartY - poleH, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // 3. Colored triangular waving flag
      const flagHeight = tmpl.gridW > 2 ? 26 : 15;
      const flagLength = tmpl.gridW > 2 ? 38 : 22;
      const flagTopY = poleStartY - poleH + 1;

      // Animate flag waving dynamically based on active time of day
      const waveOffset = Math.sin((animTimeRef.current / 160) + tmpl.gridX) * (tmpl.gridW > 2 ? 3.5 : 2);

      ctx.fillStyle = baseColor;
      ctx.beginPath();
      ctx.moveTo(centerPoleX + poleW / 2, flagTopY);
      ctx.lineTo(centerPoleX + poleW / 2 + flagLength, flagTopY + flagHeight / 2 + waveOffset);
      ctx.lineTo(centerPoleX + poleW / 2, flagTopY + flagHeight);
      ctx.closePath();
      ctx.fill();
    }

    // ---- C) Premium highlights & shadows ----
    if (tmpl.type !== 'flag') {
      // Side border lights
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.fillRect(-w / 2, -h / 2, 1.5, h);

      // Top gradient highlight — covers top 40% of brick
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.beginPath();
      ctx.roundRect(-w / 2 + 1.5, -h / 2, w - 3, h * 0.4, [2.5, 2.5, 0, 0]);
      ctx.fill();

      // Right border shadow
      ctx.fillStyle = 'rgba(0,0,0,0.16)';
      ctx.fillRect(w / 2 - 1.5, -h / 2, 1.5, h);

      // Bottom shadow strip (more pronounced)
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.fillRect(-w / 2, h / 2 - 3, w, 3);
    }

    ctx.restore();
  };

  const drawMinifig = (
    ctx: CanvasRenderingContext2D,
    x: number,
    bottomY: number,
    vx: number,
    animPhase: number,
    bodyColor: string,
    pantsColor: string,
    unitH: number
  ) => {
    const s = Math.max(6, unitH * 0.52);
    const headW = s * 1.1;
    const headH = s * 0.92;
    const torsoW = s * 1.18;
    const torsoH = s * 1.1;
    const legW = s * 0.46;
    const legH = s * 1.05;
    const armW = s * 0.38;
    const armH = s * 0.86;
    const handR = s * 0.21;

    const swing = Math.sin(animPhase) * 0.42;
    const headBob = Math.abs(Math.sin(animPhase * 2)) * (s * 0.035);

    ctx.save();
    ctx.translate(x, bottomY);
    if (vx < 0) ctx.scale(-1, 1);

    // LEFT LEG
    ctx.save();
    ctx.translate(-legW * 0.55, -legH);
    ctx.rotate(-swing);
    ctx.fillStyle = pantsColor;
    ctx.beginPath();
    ctx.roundRect(-legW / 2, 0, legW, legH, [1.5, 1.5, 3, 3]);
    ctx.fill();
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.roundRect(-legW / 2 - 1, legH - 4, legW + 5, 4, [0, 3, 3, 0]);
    ctx.fill();
    ctx.restore();

    // RIGHT LEG
    ctx.save();
    ctx.translate(legW * 0.55, -legH);
    ctx.rotate(swing);
    ctx.fillStyle = pantsColor;
    ctx.beginPath();
    ctx.roundRect(-legW / 2, 0, legW, legH, [1.5, 1.5, 3, 3]);
    ctx.fill();
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.roundRect(-legW / 2 - 1, legH - 4, legW + 5, 4, [0, 3, 3, 0]);
    ctx.fill();
    ctx.restore();

    // HIP PLATE
    const hipY = -legH - s * 0.2;
    ctx.fillStyle = pantsColor;
    ctx.beginPath();
    ctx.roundRect(-torsoW / 2 * 0.92, hipY, torsoW * 0.92, s * 0.22, [2, 2, 0, 0]);
    ctx.fill();

    // TORSO
    const torsoY = hipY - torsoH;
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.roundRect(-torsoW / 2, torsoY, torsoW, torsoH, 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(-torsoW / 2 + 2, torsoY + s * 0.26, torsoW - 4, 1.5);

    // LEFT ARM
    ctx.save();
    ctx.translate(-torsoW / 2 + armW * 0.1, torsoY + s * 0.22);
    ctx.rotate(swing * 0.7 + 0.18);
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.roundRect(-armW / 2, 0, armW, armH, [2, 2, 4, 4]);
    ctx.fill();
    ctx.fillStyle = '#F8D040';
    ctx.beginPath();
    ctx.arc(0, armH + handR * 0.8, handR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // RIGHT ARM
    ctx.save();
    ctx.translate(torsoW / 2 - armW * 0.1, torsoY + s * 0.22);
    ctx.rotate(-swing * 0.7 - 0.18);
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.roundRect(-armW / 2, 0, armW, armH, [2, 2, 4, 4]);
    ctx.fill();
    ctx.fillStyle = '#F8D040';
    ctx.beginPath();
    ctx.arc(0, armH + handR * 0.8, handR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // NECK
    const neckY = torsoY - s * 0.24;
    ctx.fillStyle = '#F8D040';
    ctx.beginPath();
    ctx.roundRect(-s * 0.21, neckY, s * 0.42, s * 0.28, 1);
    ctx.fill();

    // HEAD
    const headY = neckY - headH - headBob;
    ctx.fillStyle = '#F8D040';
    ctx.beginPath();
    ctx.roundRect(-headW / 2, headY, headW, headH, [3.5, 3.5, 2, 2]);
    ctx.fill();

    // Head stud (LEGO knob on top)
    ctx.fillStyle = '#E8C030';
    ctx.beginPath();
    ctx.roundRect(-s * 0.24, headY - s * 0.22, s * 0.48, s * 0.24, [s * 0.22, s * 0.22, 0, 0]);
    ctx.fill();

    // Face — eyes
    const eyeY = headY + headH * 0.38;
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.arc(-headW * 0.22, eyeY, s * 0.095, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(headW * 0.22, eyeY, s * 0.095, 0, Math.PI * 2);
    ctx.fill();

    // Face — smile
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = Math.max(1, s * 0.076);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, eyeY + s * 0.14, s * 0.21, 0.28, Math.PI - 0.28);
    ctx.stroke();

    // Head sheen
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.beginPath();
    ctx.ellipse(-headW * 0.14, headY + headH * 0.18, headW * 0.18, headH * 0.16, -0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // Hit-test helper — finds the topmost brick under (px, py)
  const brickAtPoint = (px: number, py: number): number => {
    const { unitW, unitH } = layoutRef.current;
    for (let i = bricksRef.current.length - 1; i >= 0; i--) {
      const brick = bricksRef.current[i];
      if (brick.status === 'waiting') continue;
      const w = brick.template.gridW * unitW;
      const h = brick.template.gridH * unitH;
      if (px >= brick.currentX && px <= brick.currentX + w &&
          py >= brick.currentY && py <= brick.currentY + h) {
        return i;
      }
    }
    return -1;
  };

  // Pointer down — grab whichever brick is under the cursor
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const idx = brickAtPoint(cx, cy);
    if (idx === -1) return;

    const brick = bricksRef.current[idx];
    dragRef.current = {
      brickIndex: idx,
      offsetX: cx - brick.currentX,
      offsetY: cy - brick.currentY,
      cursorX: cx, cursorY: cy,
      velX: 0, velY: 0,
      prevX: cx, prevY: cy,
      prevTime: performance.now(),
      startX: cx, startY: cy,
    };

    // Lift out of dock — physics loop will pin it to cursor
    brick.status = 'falling';
    brick.vx = 0; brick.vy = 0; brick.vRot = 0; brick.currentRot = 0;

    canvasRef.current.setPointerCapture(e.pointerId);
    canvasRef.current.style.cursor = 'grabbing';
    e.preventDefault();
  };

  // Pointer move — update cursor position and track velocity for throw
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    if (dragRef.current) {
      const now = performance.now();
      const dt = Math.max(1, now - dragRef.current.prevTime);
      dragRef.current.velX = ((cx - dragRef.current.prevX) / dt) * 16.66;
      dragRef.current.velY = ((cy - dragRef.current.prevY) / dt) * 16.66;
      dragRef.current.prevX = cx;
      dragRef.current.prevY = cy;
      dragRef.current.prevTime = now;
      dragRef.current.cursorX = cx;
      dragRef.current.cursorY = cy;
      canvasRef.current.style.cursor = 'grabbing';
    } else {
      // Show grab cursor when hovering over any brick
      canvasRef.current.style.cursor = brickAtPoint(cx, cy) !== -1 ? 'grab' : 'default';
    }
  };

  // Pointer up — release with throw velocity, or treat tap as pop
  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current || !canvasRef.current) return;
    const drag = dragRef.current;
    const brick = bricksRef.current[drag.brickIndex];

    if (brick) {
      const dx = drag.cursorX - drag.startX;
      const dy = drag.cursorY - drag.startY;
      const wasTap = Math.sqrt(dx * dx + dy * dy) < 5;

      if (wasTap && clickToPop) {
        // Quick tap → pop skyward with confetti
        brick.status = 'falling';
        brick.vy = -5 - Math.random() * 4;
        brick.vx = (Math.random() - 0.5) * 6;
        brick.vRot = (Math.random() - 0.5) * 0.15;
        const splashColors = getParticleColors(brick.template.color);
        for (let i = 0; i < 15; i++) {
          particlesRef.current.push({
            id: Math.random().toString(36).substr(2, 9),
            x: drag.cursorX, y: drag.cursorY,
            vx: (Math.random() - 0.5) * 11,
            vy: (Math.random() - 0.5) * 11 - 2,
            color: splashColors[Math.floor(Math.random() * splashColors.length)],
            size: Math.random() * 6 + 4, alpha: 1,
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.3, life: 1
          });
        }
      } else {
        // Drag → release with throw velocity so it flies and settles
        brick.vx = drag.velX * 0.15;
        brick.vy = drag.velY * 0.15;
        brick.status = 'falling';
      }
      const dockedCount = bricksRef.current.filter(b => b.status === 'docked').length;
      onBrickDocked(dockedCount, bricksRef.current.length);
    }

    dragRef.current = null;
    canvasRef.current.style.cursor = 'grab';
  };

  return (
    <div
      className="absolute inset-0 w-full h-full select-none"
      ref={containerRef}
    >
      <canvas
        className="block w-full h-full"
        style={{ cursor: 'default' }}
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
    </div>
  );
};
