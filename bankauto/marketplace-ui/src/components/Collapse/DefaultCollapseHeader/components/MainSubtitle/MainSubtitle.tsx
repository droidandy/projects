import React, { FC, SyntheticEvent } from 'react';
import { Box, Grid, Typography, useBreakpoints } from '@marketplace/ui-kit';

import { Color } from 'constants/Color';

import { useStyles } from './MainSubtitle.styles';

export type MainSubtitleColor = Exclude<Color, Color.YELLOW>;
export type MainHelperTextColor = Exclude<Color, Color.YELLOW>;

export interface MainSubtitleProps {
  value: React.ReactNode;
  color?: MainSubtitleColor;
  onClick?: (e: SyntheticEvent) => void;
  helperText?: React.ReactNode;
  helperTextColor?: MainHelperTextColor;
  onHelperClick?: (e: SyntheticEvent) => void;
}

interface Props {
  subtitle: MainSubtitleProps;
}

const notRequired = 'Необязательно'; // the only value of helperText when subtitle direction is row

export const MainSubtitle: FC<Props> = ({ subtitle }) => {
  const { isMobile } = useBreakpoints();
  const { color, value, helperText, helperTextColor = Color.GRAY, onClick, onHelperClick } = subtitle;
  const s = useStyles({ color, helperTextColor });

  const handleClick = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.(e);
  };

  const handleHelperClick = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onHelperClick?.(e);
  };

  const isEqualToNotRequired = helperText === notRequired;

  return (
    <Grid container direction={isMobile && !isEqualToNotRequired ? 'column' : 'row'}>
      <Grid item>
        {/* eslint-disable-next-line no-nested-ternary */}
        <Box pr={isMobile ? (isEqualToNotRequired ? 1.25 : 0) : 1.25}>
          <Typography className={s.value} variant={isMobile ? 'subtitle2' : 'subtitle1'} onClick={handleClick}>
            {value}
          </Typography>
        </Box>
      </Grid>

      {helperText && (
        <Grid item>
          <Typography
            className={s.helperText}
            variant={isMobile ? 'subtitle2' : 'subtitle1'}
            onClick={handleHelperClick}
          >
            {helperText}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};
