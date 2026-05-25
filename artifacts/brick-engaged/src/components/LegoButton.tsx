import React from 'react';
import darkBrickSrc from '@assets/lego-brick-dark.png';
import yellowBrickSrc from '@assets/lego-brick-yellow.png';
import greenBrickSrc from '@assets/lego-brick-green.png';

interface LegoButtonProps {
  children: React.ReactNode;
  variant?: 'orange' | 'charcoal' | 'white' | 'green';
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  'data-testid'?: string;
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
 * - orange / charcoal → real brick silhouette PNGs (yellow / dark navy)
 * - white            → pure CSS white block (no brick PNG) with brick-style 3D shadow
 *
 * All variants share the same rise + tilt hover animation.
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

  const baseClass = `inline-flex items-center justify-center font-black tracking-wide cursor-pointer select-none whitespace-nowrap transition-transform duration-200 ease-out hover:-translate-y-1.5 hover:rotate-[-2.5deg] active:translate-y-0 active:rotate-0 active:scale-[0.97] ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`;

  // White variant: pure CSS block with brick-style depth shadow
  if (variant === 'white') {
    return (
      <button
        type={type}
        disabled={disabled}
        className={baseClass}
        style={{
          backgroundColor: '#ffffff',
          color: textColor,
          height: `${h}px`,
          minWidth: isSmall ? '110px' : '148px',
          padding: isSmall ? '0 18px' : '0 26px',
          fontSize: isSmall ? '11px' : '13px',
          letterSpacing: '0.05em',
          border: 'none',
          borderRadius: '6px',
          boxShadow: '0 4px 0 rgba(0,0,0,0.18), 0 6px 14px rgba(0,0,0,0.12)',
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
      className={baseClass}
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
        letterSpacing: '0.05em',
      }}
      {...props}
    >
      {children}
    </button>
  );
}
