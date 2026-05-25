export type BrickType =
  | 'rect'
  | 'arch'
  | 'slope-left'
  | 'slope-right'
  | 'flag'
  | 'cone'
  | 'parapet'
  | 'stud-only'; // special smooth finishing plate

export type BrickColorOption = 'red' | 'blue' | 'yellow' | 'green' | 'gray' | 'dark-gray' | 'white' | 'orange' | 'cyan' | 'black';

export type BrickAnchor = 'left' | 'right' | 'center';

export interface BrickTemplate {
  id: string;
  type: BrickType;
  gridX: number; // offset column from anchor
  gridY: number; // grid row (bottom-up, 0 is the floor plate)
  gridW: number; // width in grid units
  gridH: number; // height in grid units
  color: BrickColorOption;
  anchor: BrickAnchor;
  spanCenter?: boolean; // if true, gridX is relative to center. If false, it's relative to side-anchored positions
}

export type BrickStatus = 'waiting' | 'falling' | 'snapping' | 'docked';

export interface BrickAnimatedState {
  id: string;
  template: BrickTemplate;
  status: BrickStatus;

  // Physics/Animation positions
  currentX: number; // pixel X
  currentY: number; // pixel Y
  currentRot: number; // radians

  // Velocities
  vx: number;
  vy: number;
  vRot: number; // angular velocity

  // Control state
  spawnTime: number; // delay in milliseconds before spawning
  snapProgress: number; // 0 to 1 for perfect interpolation when lock-snapping

  // Targets (dynamically calculated on resize)
  targetX: number; // destination pixel X
  targetY: number; // destination pixel Y
}

export interface LegoModel {
  id: string;
  name: string;
  description: string;
  iconName: string;
  themeColor: string;
  bricks: BrickTemplate[];
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  rotation: number;
  vRot: number;
  life: number; // 0 to 1 decay
}

export interface Minifig {
  id: string;
  x: number;
  y: number;
  vx: number;
  animPhase: number;
  bodyColor: string;
  pantsColor: string;
}
