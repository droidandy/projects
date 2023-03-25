import React, { FC, SyntheticEvent } from 'react';
import { Typography, useBreakpoints } from '@marketplace/ui-kit';

export interface AdditionalSubtitleProps {
  value: string;
  onClick?: (e: SyntheticEvent) => void;
}

interface Props {
  subtitle: AdditionalSubtitleProps;
}

export const AdditionalSubtitle: FC<Props> = ({ subtitle: { value, onClick } }) => {
  const { isMobile } = useBreakpoints();

  const handleClick = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.(e);
  };

  return (
    <Typography onClick={handleClick} variant={isMobile ? 'subtitle2' : 'subtitle1'} color="primary">
      {value}
    </Typography>
  );
};
