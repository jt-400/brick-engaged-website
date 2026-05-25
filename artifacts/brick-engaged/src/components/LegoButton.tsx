import React from 'react';
import darkBrickSrc from '@assets/lego-brick-dark.png';
import yellowBrickSrc from '@assets/lego-brick-yellow.png';

interface LegoButtonProps {
  children: React.ReactNode;
  variant?: 'orange' | 'charcoal' | 'white';
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  'data-testid'?: string;
  size?: 'sm' | 'md';
}

// Text colour for each variant
const TEXT_COLORS: Record<string, string> = {
  orange:  '#1E293B', // dark text on yellow brick
  charcoal: '#ffffff', // white text on dark brick
  white:   '#ffffff', // white text on dark brick (fallback)
};

/**
 * A button that uses real LEGO brick silhouette images.
 * Studs sit at the top of the image; text is centred in the body area.
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
  const brickSrc = variant === 'orange' ? yellowBrickSrc : darkBrickSrc;
  const textColor = TEXT_COLORS[variant] ?? '#1E293B';
  const isSmall = size === 'sm';

  // Overall brick height — stud area takes ~28% from top
  const h = isSmall ? 50 : 66;
  const studPad = Math.round(h * 0.29); // push text below studs

  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-black tracking-wide cursor-pointer select-none whitespace-nowrap transition-[transform,filter] duration-75 ease-out hover:brightness-105 hover:scale-[1.015] active:scale-[0.97] ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}
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
