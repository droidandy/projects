import React, { CSSProperties } from 'react';
import { Button } from '@marketplace/ui-kit';
import { ReactComponent as ArrowLeft } from 'icons/arrowSliderButtonLeft.svg';
import { ReactComponent as ArrowRight } from 'icons/arrowSliderButtonRight.svg';
import { useStyles } from './SwiperNavButton.styles';

type NavButtonProps = {
  direction: 'next' | 'prev';
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
};

export const NavButton = ({ direction, onClick, disabled, className, style }: NavButtonProps) => {
  const { root, icon, iconWrapper } = useStyles();
  const Icon = direction === 'next' ? ArrowRight : ArrowLeft;

  return (
    <Button
      className={`${root} ${className}`}
      disabled={disabled}
      onClick={onClick}
      variant="outlined"
      style={{ ...style }}
    >
      <div className={iconWrapper}>
        <Icon className={icon} />
      </div>
    </Button>
  );
};
