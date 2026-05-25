import { BrickTemplate, LegoModel } from './types';

// Helper to generate unique ID for a brick
function makeId(model: string, anchor: string, row: number, col: number): string {
  return `${model}-${anchor}-r${row}-c${col}`;
}

// ----------------------------------------------------
// 1. CLASSIC ROYAL CASTLE
// ----------------------------------------------------
function buildClassicCastle(): BrickTemplate[] {
  const bricks: BrickTemplate[] = [];

  // ==========================================
  // 1. LEFT TOWER (Anchor: left)
  // ==========================================
  bricks.push({ id: makeId('c', 'l', 0, 0), type: 'rect', gridX: 0, gridY: 0, gridW: 8, gridH: 1, color: 'red', anchor: 'left' });
  bricks.push({ id: makeId('c', 'l', 1, 0), type: 'rect', gridX: 0, gridY: 1, gridW: 8, gridH: 1, color: 'red', anchor: 'left' });

  bricks.push({ id: makeId('c', 'l', 2, 0), type: 'rect', gridX: 0, gridY: 2, gridW: 1, gridH: 2, color: 'red', anchor: 'left' });
  bricks.push({ id: makeId('c', 'l', 2, 7), type: 'rect', gridX: 7, gridY: 2, gridW: 1, gridH: 2, color: 'red', anchor: 'left' });

  bricks.push({ id: makeId('c', 'l', 2, 1), type: 'rect', gridX: 1, gridY: 2, gridW: 1, gridH: 1, color: 'dark-gray', anchor: 'left' });
  bricks.push({ id: makeId('c', 'l', 2, 6), type: 'rect', gridX: 6, gridY: 2, gridW: 1, gridH: 1, color: 'dark-gray', anchor: 'left' });

  bricks.push({ id: makeId('c', 'l', 2, 2), type: 'rect', gridX: 2, gridY: 2, gridW: 4, gridH: 1, color: 'dark-gray', anchor: 'left' });

  bricks.push({ id: makeId('c', 'l', 3, 1), type: 'arch', gridX: 1, gridY: 3, gridW: 6, gridH: 1, color: 'red', anchor: 'left' });

  bricks.push({ id: makeId('c', 'l', 4, 0), type: 'rect', gridX: 0, gridY: 4, gridW: 8, gridH: 1, color: 'gray', anchor: 'left' });

  bricks.push({ id: makeId('c', 'l', 5, 0), type: 'parapet', gridX: 0, gridY: 5, gridW: 2, gridH: 1, color: 'dark-gray', anchor: 'left' });
  bricks.push({ id: makeId('c', 'l', 5, 2), type: 'rect', gridX: 2, gridY: 5, gridW: 4, gridH: 1, color: 'dark-gray', anchor: 'left' });
  bricks.push({ id: makeId('c', 'l', 5, 6), type: 'parapet', gridX: 6, gridY: 5, gridW: 2, gridH: 1, color: 'dark-gray', anchor: 'left' });

  bricks.push({ id: makeId('c', 'l', 6, 2), type: 'parapet', gridX: 2, gridY: 6, gridW: 1, gridH: 1, color: 'dark-gray', anchor: 'left' });
  bricks.push({ id: makeId('c', 'l', 6, 3), type: 'rect', gridX: 3, gridY: 6, gridW: 2, gridH: 1, color: 'red', anchor: 'left' });
  bricks.push({ id: makeId('c', 'l', 6, 5), type: 'parapet', gridX: 5, gridY: 6, gridW: 1, gridH: 1, color: 'dark-gray', anchor: 'left' });

  bricks.push({ id: makeId('c', 'l', 7, 3), type: 'flag', gridX: 3, gridY: 7, gridW: 2, gridH: 1, color: 'red', anchor: 'left' });


  // ==========================================
  // 2. RIGHT TOWER (Anchor: right - Blue Symmetry)
  // ==========================================
  bricks.push({ id: makeId('c', 'r', 0, 0), type: 'rect', gridX: 0, gridY: 0, gridW: 8, gridH: 1, color: 'blue', anchor: 'right' });
  bricks.push({ id: makeId('c', 'r', 1, 0), type: 'rect', gridX: 0, gridY: 1, gridW: 8, gridH: 1, color: 'blue', anchor: 'right' });

  bricks.push({ id: makeId('c', 'r', 2, 0), type: 'rect', gridX: 0, gridY: 2, gridW: 1, gridH: 2, color: 'blue', anchor: 'right' });
  bricks.push({ id: makeId('c', 'r', 2, 7), type: 'rect', gridX: 7, gridY: 2, gridW: 1, gridH: 2, color: 'blue', anchor: 'right' });

  bricks.push({ id: makeId('c', 'r', 2, 1), type: 'rect', gridX: 1, gridY: 2, gridW: 1, gridH: 1, color: 'dark-gray', anchor: 'right' });
  bricks.push({ id: makeId('c', 'r', 2, 6), type: 'rect', gridX: 6, gridY: 2, gridW: 1, gridH: 1, color: 'dark-gray', anchor: 'right' });

  bricks.push({ id: makeId('c', 'r', 2, 2), type: 'rect', gridX: 2, gridY: 2, gridW: 4, gridH: 1, color: 'dark-gray', anchor: 'right' });

  bricks.push({ id: makeId('c', 'r', 3, 1), type: 'arch', gridX: 1, gridY: 3, gridW: 6, gridH: 1, color: 'blue', anchor: 'right' });

  bricks.push({ id: makeId('c', 'r', 4, 0), type: 'rect', gridX: 0, gridY: 4, gridW: 8, gridH: 1, color: 'gray', anchor: 'right' });

  bricks.push({ id: makeId('c', 'r', 5, 0), type: 'parapet', gridX: 0, gridY: 5, gridW: 2, gridH: 1, color: 'dark-gray', anchor: 'right' });
  bricks.push({ id: makeId('c', 'r', 5, 2), type: 'rect', gridX: 2, gridY: 5, gridW: 4, gridH: 1, color: 'dark-gray', anchor: 'right' });
  bricks.push({ id: makeId('c', 'r', 5, 6), type: 'parapet', gridX: 6, gridY: 5, gridW: 2, gridH: 1, color: 'dark-gray', anchor: 'right' });

  bricks.push({ id: makeId('c', 'r', 6, 2), type: 'parapet', gridX: 2, gridY: 6, gridW: 1, gridH: 1, color: 'dark-gray', anchor: 'right' });
  bricks.push({ id: makeId('c', 'r', 6, 3), type: 'rect', gridX: 3, gridY: 6, gridW: 2, gridH: 1, color: 'blue', anchor: 'right' });
  bricks.push({ id: makeId('c', 'r', 6, 5), type: 'parapet', gridX: 5, gridY: 6, gridW: 1, gridH: 1, color: 'dark-gray', anchor: 'right' });

  bricks.push({ id: makeId('c', 'r', 7, 3), type: 'flag', gridX: 3, gridY: 7, gridW: 2, gridH: 1, color: 'blue', anchor: 'right' });


  // ==========================================
  // 3. UNIFIED MASSIVE CENTER & KEEP (Anchor: center)
  // ==========================================
  bricks.push({ id: makeId('c', 'c', 0, -8), type: 'rect', gridX: -8, gridY: 0, gridW: 4, gridH: 1, color: 'gray', anchor: 'center' });
  bricks.push({ id: makeId('c', 'c', 0, -4), type: 'rect', gridX: -4, gridY: 0, gridW: 8, gridH: 1, color: 'gray', anchor: 'center' });
  bricks.push({ id: makeId('c', 'c', 0, 4), type: 'rect', gridX: 4, gridY: 0, gridW: 4, gridH: 1, color: 'gray', anchor: 'center' });

  bricks.push({ id: makeId('c', 'c', 1, -8), type: 'rect', gridX: -8, gridY: 1, gridW: 4, gridH: 1, color: '#ffe527', anchor: 'center' });
  bricks.push({ id: makeId('c', 'c', 1, 4), type: 'rect', gridX: 4, gridY: 1, gridW: 4, gridH: 1, color: '#ffe527', anchor: 'center' });

  bricks.push({ id: makeId('c', 'c', 1, -4), type: 'rect', gridX: -4, gridY: 1, gridW: 1, gridH: 3, color: 'dark-gray', anchor: 'center' });
  bricks.push({ id: makeId('c', 'c', 1, 3), type: 'rect', gridX: 3, gridY: 1, gridW: 1, gridH: 3, color: 'dark-gray', anchor: 'center' });

  bricks.push({ id: makeId('c', 'c', 1, -3), type: 'arch', gridX: -3, gridY: 1, gridW: 6, gridH: 3, color: 'dark-gray', anchor: 'center' });

  bricks.push({ id: makeId('c', 'c', 2, -8), type: 'rect', gridX: -8, gridY: 2, gridW: 4, gridH: 1, color: '#ffe527', anchor: 'center' });
  bricks.push({ id: makeId('c', 'c', 2, 4), type: 'rect', gridX: 4, gridY: 2, gridW: 4, gridH: 1, color: '#ffe527', anchor: 'center' });

  bricks.push({ id: makeId('c', 'c', 3, -8), type: 'rect', gridX: -8, gridY: 3, gridW: 4, gridH: 1, color: '#ffe527', anchor: 'center' });
  bricks.push({ id: makeId('c', 'c', 3, 4), type: 'rect', gridX: 4, gridY: 3, gridW: 4, gridH: 1, color: '#ffe527', anchor: 'center' });

  bricks.push({ id: makeId('c', 'c', 4, -8), type: 'rect', gridX: -8, gridY: 4, gridW: 4, gridH: 1, color: 'gray', anchor: 'center' });
  bricks.push({ id: makeId('c', 'c', 4, 4), type: 'rect', gridX: 4, gridY: 4, gridW: 4, gridH: 1, color: 'gray', anchor: 'center' });

  bricks.push({ id: makeId('c', 'c', 4, -4), type: 'rect', gridX: -4, gridY: 4, gridW: 8, gridH: 1, color: 'green', anchor: 'center' });

  bricks.push({ id: makeId('c', 'c', 5, -8), type: 'parapet', gridX: -8, gridY: 5, gridW: 1, gridH: 1, color: 'dark-gray', anchor: 'center' });
  bricks.push({ id: makeId('c', 'c', 5, -5), type: 'parapet', gridX: -5, gridY: 5, gridW: 1, gridH: 1, color: 'dark-gray', anchor: 'center' });
  bricks.push({ id: makeId('c', 'c', 5, 4), type: 'parapet', gridX: 4, gridY: 5, gridW: 1, gridH: 1, color: 'dark-gray', anchor: 'center' });
  bricks.push({ id: makeId('c', 'c', 5, 7), type: 'parapet', gridX: 7, gridY: 5, gridW: 1, gridH: 1, color: 'dark-gray', anchor: 'center' });

  bricks.push({ id: makeId('c', 'c', 5, -4), type: 'rect', gridX: -4, gridY: 5, gridW: 8, gridH: 1, color: 'green', anchor: 'center' });

  bricks.push({ id: makeId('c', 'c', 6, -4), type: 'rect', gridX: -4, gridY: 6, gridW: 8, gridH: 1, color: 'gray', anchor: 'center' });

  bricks.push({ id: makeId('c', 'c', 7, -4), type: 'rect', gridX: -4, gridY: 7, gridW: 3, gridH: 1, color: 'gray', anchor: 'center' });
  bricks.push({ id: makeId('c', 'c', 7, -1), type: 'rect', gridX: -1, gridY: 7, gridW: 2, gridH: 1, color: 'dark-gray', anchor: 'center' });
  bricks.push({ id: makeId('c', 'c', 7, 1), type: 'rect', gridX: 1, gridY: 7, gridW: 3, gridH: 1, color: 'gray', anchor: 'center' });

  bricks.push({ id: makeId('c', 'c', 8, -4), type: 'rect', gridX: -4, gridY: 8, gridW: 8, gridH: 1, color: 'gray', anchor: 'center' });

  bricks.push({ id: makeId('c', 'c', 9, -4), type: 'rect', gridX: -4, gridY: 9, gridW: 1, gridH: 2, color: 'gray', anchor: 'center' });
  bricks.push({ id: makeId('c', 'c', 9, 3), type: 'rect', gridX: 3, gridY: 9, gridW: 1, gridH: 2, color: 'gray', anchor: 'center' });

  bricks.push({ id: makeId('c', 'c', 9, -2), type: 'rect', gridX: -2, gridY: 9, gridW: 4, gridH: 1, color: 'dark-gray', anchor: 'center' });
  bricks.push({ id: makeId('c', 'c', 10, -3), type: 'arch', gridX: -3, gridY: 10, gridW: 6, gridH: 1, color: 'gray', anchor: 'center' });

  bricks.push({ id: makeId('c', 'c', 11, -4), type: 'rect', gridX: -4, gridY: 11, gridW: 8, gridH: 1, color: 'gray', anchor: 'center' });

  bricks.push({ id: makeId('c', 'c', 12, -4), type: 'rect', gridX: -4, gridY: 12, gridW: 8, gridH: 1, color: 'dark-gray', anchor: 'center' });

  bricks.push({ id: makeId('c', 'c', 13, -4), type: 'parapet', gridX: -4, gridY: 13, gridW: 1, gridH: 1, color: 'dark-gray', anchor: 'center' });
  bricks.push({ id: makeId('c', 'c', 13, -2), type: 'parapet', gridX: -2, gridY: 13, gridW: 1, gridH: 1, color: 'dark-gray', anchor: 'center' });
  bricks.push({ id: makeId('c', 'c', 13, 1), type: 'parapet', gridX: 1, gridY: 13, gridW: 1, gridH: 1, color: 'dark-gray', anchor: 'center' });
  bricks.push({ id: makeId('c', 'c', 13, 3), type: 'parapet', gridX: 3, gridY: 13, gridW: 1, gridH: 1, color: 'dark-gray', anchor: 'center' });

  bricks.push({ id: makeId('c', 'c', 13, -1), type: 'rect', gridX: -1, gridY: 13, gridW: 2, gridH: 1, color: 'dark-gray', anchor: 'center' });

  return bricks;
}

// ----------------------------------------------------
// 2. TECH CONNECTIONS BRIDGE
// ----------------------------------------------------
function buildTechBridge(): BrickTemplate[] {
  const bricks: BrickTemplate[] = [];

  // Left Abutment (Anchor: left)
  bricks.push({ id: makeId('b', 'l', 0, 0), type: 'rect', gridX: 0, gridY: 0, gridW: 6, gridH: 1, color: 'dark-gray', anchor: 'left' });
  bricks.push({ id: makeId('b', 'l', 1, 0), type: 'rect', gridX: 0, gridY: 1, gridW: 2, gridH: 2, color: 'blue', anchor: 'left' });
  bricks.push({ id: makeId('b', 'l', 1, 4), type: 'rect', gridX: 4, gridY: 1, gridW: 2, gridH: 2, color: 'blue', anchor: 'left' });
  bricks.push({ id: makeId('b', 'l', 3, 1), type: 'arch', gridX: 1, gridY: 3, gridW: 4, gridH: 1, color: 'red', anchor: 'left' });
  bricks.push({ id: makeId('b', 'l', 3, 0), type: 'rect', gridX: 0, gridY: 3, gridW: 1, gridH: 1, color: '#ffe527', anchor: 'left' });
  bricks.push({ id: makeId('b', 'l', 3, 5), type: 'rect', gridX: 5, gridY: 3, gridW: 1, gridH: 1, color: '#ffe527', anchor: 'left' });
  bricks.push({ id: makeId('b', 'l', 4, 0), type: 'rect', gridX: 0, gridY: 4, gridW: 6, gridH: 1, color: 'green', anchor: 'left' });


  // Right Abutment (Anchor: right, symmetrical)
  bricks.push({ id: makeId('b', 'r', 0, 0), type: 'rect', gridX: 0, gridY: 0, gridW: 6, gridH: 1, color: 'dark-gray', anchor: 'right' });
  bricks.push({ id: makeId('b', 'r', 1, 0), type: 'rect', gridX: 0, gridY: 1, gridW: 2, gridH: 2, color: 'blue', anchor: 'right' });
  bricks.push({ id: makeId('b', 'r', 1, 4), type: 'rect', gridX: 4, gridY: 1, gridW: 2, gridH: 2, color: 'blue', anchor: 'right' });
  bricks.push({ id: makeId('b', 'r', 3, 1), type: 'arch', gridX: 1, gridY: 3, gridW: 4, gridH: 1, color: 'red', anchor: 'right' });
  bricks.push({ id: makeId('b', 'r', 3, 0), type: 'rect', gridX: 0, gridY: 3, gridW: 1, gridH: 1, color: '#ffe527', anchor: 'right' });
  bricks.push({ id: makeId('b', 'r', 3, 5), type: 'rect', gridX: 5, gridY: 3, gridW: 1, gridH: 1, color: '#ffe527', anchor: 'right' });
  bricks.push({ id: makeId('b', 'r', 4, 0), type: 'rect', gridX: 0, gridY: 4, gridW: 6, gridH: 1, color: 'green', anchor: 'right' });


  // CENTER SPANNING BRIDGES (Anchor: center)
  bricks.push({ id: makeId('b', 'c', 0, -8), type: 'rect', gridX: -8, gridY: 0, gridW: 2, gridH: 2, color: 'gray', anchor: 'center' });
  bricks.push({ id: makeId('b', 'c', 0, 6), type: 'rect', gridX: 6, gridY: 0, gridW: 2, gridH: 2, color: 'gray', anchor: 'center' });

  bricks.push({ id: makeId('b', 'c', 2, -7), type: 'arch', gridX: -7, gridY: 2, gridW: 4, gridH: 2, color: '#ffe527', anchor: 'center' });
  bricks.push({ id: makeId('b', 'c', 2, -3), type: 'arch', gridX: -3, gridY: 2, gridW: 6, gridH: 2, color: 'red', anchor: 'center' });
  bricks.push({ id: makeId('b', 'c', 2, 3), type: 'arch', gridX: 3, gridY: 2, gridW: 4, gridH: 2, color: '#ffe527', anchor: 'center' });

  bricks.push({ id: makeId('b', 'c', 4, -8), type: 'rect', gridX: -8, gridY: 4, gridW: 3, gridH: 1, color: '#ffe527', anchor: 'center' });
  bricks.push({ id: makeId('b', 'c', 4, -5), type: 'rect', gridX: -5, gridY: 4, gridW: 5, gridH: 1, color: 'blue', anchor: 'center' });
  bricks.push({ id: makeId('b', 'c', 4, 0), type: 'rect', gridX: 0, gridY: 4, gridW: 5, gridH: 1, color: 'blue', anchor: 'center' });
  bricks.push({ id: makeId('b', 'c', 4, 5), type: 'rect', gridX: 5, gridY: 4, gridW: 3, gridH: 1, color: '#ffe527', anchor: 'center' });

  bricks.push({ id: makeId('b', 'c', 5, -8), type: 'rect', gridX: -8, gridY: 5, gridW: 4, gridH: 1, color: 'green', anchor: 'center' });
  bricks.push({ id: makeId('b', 'c', 5, -4), type: 'rect', gridX: -4, gridY: 5, gridW: 8, gridH: 1, color: '#ffe527', anchor: 'center' });
  bricks.push({ id: makeId('b', 'c', 5, 4), type: 'rect', gridX: 4, gridY: 5, gridW: 4, gridH: 1, color: 'green', anchor: 'center' });

  bricks.push({ id: makeId('b', 'c', 6, -8), type: 'parapet', gridX: -8, gridY: 6, gridW: 1, gridH: 1, color: 'red', anchor: 'center' });
  bricks.push({ id: makeId('b', 'c', 6, -4), type: 'parapet', gridX: -4, gridY: 6, gridW: 1, gridH: 1, color: 'gray', anchor: 'center' });
  bricks.push({ id: makeId('b', 'c', 6, 0), type: 'flag', gridX: 0, gridY: 6, gridW: 2, gridH: 3, color: 'cyan', anchor: 'center' });
  bricks.push({ id: makeId('b', 'c', 6, 3), type: 'parapet', gridX: 3, gridY: 6, gridW: 1, gridH: 1, color: 'gray', anchor: 'center' });
  bricks.push({ id: makeId('b', 'c', 6, 7), type: 'parapet', gridX: 7, gridY: 6, gridW: 1, gridH: 1, color: 'red', anchor: 'center' });

  return bricks;
}

// ----------------------------------------------------
// 3. RETRO SPACE BASE & ROCKET
// ----------------------------------------------------
function buildRetroSpaceBase(): BrickTemplate[] {
  const bricks: BrickTemplate[] = [];

  // Left Launch Support Tower (Anchor: left)
  bricks.push({ id: makeId('s', 'l', 0, 0), type: 'rect', gridX: 0, gridY: 0, gridW: 6, gridH: 1, color: 'gray', anchor: 'left' });
  bricks.push({ id: makeId('s', 'l', 1, 1), type: 'rect', gridX: 1, gridY: 1, gridW: 4, gridH: 2, color: 'white', anchor: 'left' });
  bricks.push({ id: makeId('s', 'l', 3, 2), type: 'rect', gridX: 2, gridY: 3, gridW: 2, gridH: 3, color: '#ffe527', anchor: 'left' });
  bricks.push({ id: makeId('s', 'l', 6, 1), type: 'slope-left', gridX: 1, gridY: 6, gridW: 2, gridH: 1, color: 'cyan', anchor: 'left' });
  bricks.push({ id: makeId('s', 'l', 6, 3), type: 'slope-right', gridX: 3, gridY: 6, gridW: 2, gridH: 1, color: 'cyan', anchor: 'left' });
  bricks.push({ id: makeId('s', 'l', 7, 2), type: 'flag', gridX: 2, gridY: 7, gridW: 2, gridH: 2, color: 'blue', anchor: 'left' });

  // Right Telemetry Tower (Anchor: right, symmetrical support)
  bricks.push({ id: makeId('s', 'r', 0, 0), type: 'rect', gridX: 0, gridY: 0, gridW: 6, gridH: 1, color: 'gray', anchor: 'right' });
  bricks.push({ id: makeId('s', 'r', 1, 1), type: 'rect', gridX: 1, gridY: 1, gridW: 4, gridH: 2, color: 'white', anchor: 'right' });
  bricks.push({ id: makeId('s', 'r', 3, 2), type: 'rect', gridX: 2, gridY: 3, gridW: 2, gridH: 3, color: '#ffe527', anchor: 'right' });
  bricks.push({ id: makeId('s', 'r', 6, 1), type: 'slope-left', gridX: 1, gridY: 6, gridW: 2, gridH: 1, color: 'cyan', anchor: 'right' });
  bricks.push({ id: makeId('s', 'r', 6, 3), type: 'slope-right', gridX: 3, gridY: 6, gridW: 2, gridH: 1, color: 'cyan', anchor: 'right' });
  bricks.push({ id: makeId('s', 'r', 7, 2), type: 'flag', gridX: 2, gridY: 7, gridW: 2, gridH: 2, color: 'red', anchor: 'right' });

  // Center Launchpad & Micro Rocket (Anchor: center)
  bricks.push({ id: makeId('s', 'c', 0, -5), type: 'rect', gridX: -5, gridY: 0, gridW: 10, gridH: 1, color: 'dark-gray', anchor: 'center' });

  bricks.push({ id: makeId('s', 'c', 1, -4), type: 'arch', gridX: -4, gridY: 1, gridW: 4, gridH: 1, color: 'blue', anchor: 'center' });
  bricks.push({ id: makeId('s', 'c', 1, 0), type: 'arch', gridX: 0, gridY: 1, gridW: 4, gridH: 1, color: 'blue', anchor: 'center' });

  bricks.push({ id: makeId('s', 'c', 2, -3), type: 'slope-left', gridX: -3, gridY: 2, gridW: 2, gridH: 1, color: 'red', anchor: 'center' });
  bricks.push({ id: makeId('s', 'c', 2, -1), type: 'rect', gridX: -1, gridY: 2, gridW: 2, gridH: 1, color: 'gray', anchor: 'center' });
  bricks.push({ id: makeId('s', 'c', 2, 1), type: 'slope-right', gridX: 1, gridY: 2, gridW: 2, gridH: 1, color: 'red', anchor: 'center' });

  bricks.push({ id: makeId('s', 'c', 3, -1), type: 'rect', gridX: -1, gridY: 3, gridW: 2, gridH: 2, color: 'white', anchor: 'center' });
  bricks.push({ id: makeId('s', 'c', 3, -2), type: 'rect', gridX: -2, gridY: 3, gridW: 1, gridH: 1, color: '#ffe527', anchor: 'center' });
  bricks.push({ id: makeId('s', 'c', 3, 1), type: 'rect', gridX: 1, gridY: 3, gridW: 1, gridH: 1, color: '#ffe527', anchor: 'center' });

  bricks.push({ id: makeId('s', 'c', 5, -1), type: 'rect', gridX: -1, gridY: 5, gridW: 2, gridH: 1, color: '#ffe527', anchor: 'center' });

  bricks.push({ id: makeId('s', 'c', 6, -1), type: 'rect', gridX: -1, gridY: 6, gridW: 2, gridH: 1, color: 'cyan', anchor: 'center' });

  bricks.push({ id: makeId('s', 'c', 7, -1), type: 'slope-left', gridX: -1, gridY: 7, gridW: 1, gridH: 1, color: 'red', anchor: 'center' });
  bricks.push({ id: makeId('s', 'c', 7, 0), type: 'slope-right', gridX: 0, gridY: 7, gridW: 1, gridH: 1, color: 'red', anchor: 'center' });

  bricks.push({ id: makeId('s', 'c', 8, -1), type: 'flag', gridX: -1, gridY: 8, gridW: 2, gridH: 1, color: '#ffe527', anchor: 'center' });

  return bricks;
}

// ----------------------------------------------------
// MODEL REGISTRY
// ----------------------------------------------------
export const LEGO_MODELS: LegoModel[] = [
  {
    id: 'castle',
    name: 'Classic Royal Castle',
    description: 'A stately medieval fortress featuring twin outer towers, windows, and a central gatehouse with flags.',
    iconName: 'Castle',
    themeColor: 'from-amber-500 to-red-600',
    bricks: buildClassicCastle()
  },
  {
    id: 'bridge',
    name: 'Connective Arched Bridge',
    description: 'An elegant spanning aqueduct and modern highway showing how blocks form seamless connections.',
    iconName: 'CableCar',
    themeColor: 'from-blue-500 to-green-600',
    bricks: buildTechBridge()
  },
  {
    id: 'space',
    name: 'Retro Space Base',
    description: 'A classic NASA spaceship launching pad flanking twin telemetric telemetry tracking dishes.',
    iconName: 'Rocket',
    themeColor: 'from-indigo-500 to-cyan-500',
    bricks: buildRetroSpaceBase()
  }
];
