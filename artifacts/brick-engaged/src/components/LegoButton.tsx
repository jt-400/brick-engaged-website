import React from 'react';
import darkBrickSrc from '@assets/lego-brick-dark.webp';
import yellowBrickSrc from '@assets/lego-brick-yellow.webp';
import greenBrickSrc from '@assets/lego-brick-green.webp';

interface LegoButtonProps {
  children: React.ReactNode;
  variant?: 'orange' | 'charcoal' | 'white' | 'green';
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  'data-testid'?: string;
  'aria-label'?: string;
  size?: 'sm' | 'md';
}

const TEXT_COLORS: Record<string, string> = {
  orange:   '#1E293B', // dark text on yellow brick
  charcoal: '#ffffff', // white text on dark brick
  white:    '#1E293B', // dark navy text on white block
  green:    '#ffffff', // white text on green brick
};

/**
 * A button shaped like a LEGO brick.
 *
 * Resting state (carries discoverability on touch):
 *   - cursor: pointer
 *   - drop-shadow underneath ("floating" feel)
 *   - 3px upward lift so a seam is visible
 *   - uppercase label for button affordance
 *
 * Hover / focus-visible (keyboard parity):
 *   - bigger lift + slight tilt
 *   - stronger drop-shadow
 *   - 200ms ease-out transition
 *
 * Active (press feedback):
 *   - pushed back down to flush
 *   - shorter shadow
 *
 * Variants:
 *   - orange   → yellow brick PNG, dark text
 *   - charcoal → dark navy brick PNG, white text
 *   - green    → green brick PNG, white text
 *   - white    → pure CSS white block + brick-style depth shadow
 *
 * Reduced motion: CSS rule in index.css strips transitions globally;
 * the resting raised+shadow state still communicates the affordance.
 */
export function LegoButton({
  children,
  variant = 'orange',
  className = '',
  size = 'md',
  type = 'button',
  disabled,
  ...props
}: LegoButtonProps) {
  const textColor = TEXT_COLORS[variant] ?? '#1E293B';
  const isSmall = size === 'sm';
  const h = isSmall ? 50 : 66;

  // Shared interactive class (rest, hover, focus-visible, active)
  const baseClass = [
    'inline-flex items-center justify-center',
    'font-black uppercase cursor-pointer select-none whitespace-nowrap touch-manipulation',
    'transition-[transform,filter,box-shadow] duration-200 ease-out',
    'will-change-transform',
    // Resting raised position so a seam is visible
    '-translate-y-[3px]',
    // Hover: bigger lift + tilt
    'hover:-translate-y-[8px] hover:rotate-[-2.5deg]',
    // Focus-visible parity for keyboard users
    'focus-visible:-translate-y-[8px] focus-visible:rotate-[-2.5deg]',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-lego-orange focus-visible:outline-offset-4',
    // Active: press-in
    'active:translate-y-0 active:rotate-0 active:scale-[0.985]',
    disabled ? 'opacity-50 pointer-events-none' : '',
    className,
  ].join(' ');

  // White variant: CSS block with stacked box-shadow (no PNG)
  if (variant === 'white') {
    return (
      <button
        type={type}
        disabled={disabled}
        className={[
          baseClass,
          // Rest: brick depth shadow
          'shadow-[0_4px_0_rgba(0,0,0,0.18),0_8px_18px_rgba(0,0,0,0.18)]',
          // Hover: lifted
          'hover:shadow-[0_6px_0_rgba(0,0,0,0.18),0_14px_24px_rgba(0,0,0,0.22)]',
          'focus-visible:shadow-[0_6px_0_rgba(0,0,0,0.18),0_14px_24px_rgba(0,0,0,0.22)]',
          // Active: collapsed
          'active:shadow-[0_2px_0_rgba(0,0,0,0.18),0_4px_10px_rgba(0,0,0,0.18)]',
        ].join(' ')}
        style={{
          backgroundColor: '#ffffff',
          color: textColor,
          height: `${h}px`,
          minWidth: isSmall ? '110px' : '148px',
          padding: isSmall ? '0 18px' : '0 26px',
          fontSize: isSmall ? '11px' : '13px',
          letterSpacing: '0.08em',
          border: 'none',
          borderRadius: '6px',
        }}
        {...props}
      >
        {children}
      </button>
    );
  }

  // Brick PNG variants
  const brickSrc =
    variant === 'orange' ? yellowBrickSrc :
    variant === 'green'  ? greenBrickSrc  :
    darkBrickSrc;
  const studPad = Math.round(h * 0.29);

  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        baseClass,
        // Drop-shadow follows the brick silhouette (alpha-channel aware)
        'drop-shadow-[0_8px_16px_rgba(0,0,0,0.38)]',
        'hover:drop-shadow-[0_14px_22px_rgba(0,0,0,0.42)]',
        'focus-visible:drop-shadow-[0_14px_22px_rgba(0,0,0,0.42)]',
        'active:drop-shadow-[0_4px_8px_rgba(0,0,0,0.28)]',
      ].join(' ')}
      style={{
        backgroundImage: `url(${brickSrc})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'transparent',
        border: 'none',
        color: textColor,
        height: `${h}px`,
        minWidth: isSmall ? '110px' : '148px',
        paddingTop: `${studPad}px`,
        paddingBottom: 0,
        paddingLeft: isSmall ? '18px' : '26px',
        paddingRight: isSmall ? '18px' : '26px',
        fontSize: isSmall ? '11px' : '13px',
        letterSpacing: '0.08em',
        // Subtle text shadow lifts white-on-coloured contrast to AA on bright variants
        textShadow:
          variant === 'green' || variant === 'charcoal'
            ? '0 1px 2px rgba(0,0,0,0.35)'
            : 'none',
      }}
      {...props}
    >
      {children}
    </button>
  );
}
