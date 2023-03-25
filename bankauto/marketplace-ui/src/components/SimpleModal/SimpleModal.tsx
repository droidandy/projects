import React, { FC, ReactNode } from 'react';
import { Icon, IconButton, Paper, Typography, Button, Box, Grid } from '@material-ui/core';
import { ReactComponent as IconClose } from '@marketplace/ui-kit/icons/icon-close.svg';
import useBreakpoints from '@marketplace/ui-kit/hooks/useBreakpoints';
import { BackdropModalActions } from '@marketplace/ui-kit/components/BackdropModal';
import { useStyles } from './SimpleModal.styles';

export interface SimpleModalControl {
  title: string;
  color?: 'inherit' | 'primary' | 'secondary' | 'default';
  variant?: 'contained' | 'outlined';
  onClick?: () => void;
}

export interface SimpleModalText {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export interface SimpleModalActions {
  controls?: SimpleModalControl[];
}

export type SimpleModalProps = SimpleModalText & SimpleModalActions & BackdropModalActions;

const SimpleModal: FC<SimpleModalProps> = ({ title, subtitle, children, controls, handleClose }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();

  return (
    <Paper className={s.root}>
      <IconButton aria-label="close" onClick={handleClose} className={s.cross}>
        <Icon viewBox="0 0 16 16" component={IconClose} className={s.crossIcon} />
      </IconButton>
      <Typography variant="h4" component="h4">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="h5" className={s.subtitle} component="h5">
          {subtitle}
        </Typography>
      )}
      <Typography variant="body1" className={s.content}>
        {children}
      </Typography>
      {controls && (
        <Box mt={5}>
          <Grid container direction={isMobile ? 'column' : 'row'} justify="space-between" spacing={isMobile ? 2 : 5}>
            {controls.map((control) => (
              <Grid item key={control.title} xs>
                <Button
                  fullWidth
                  variant={control.variant ?? 'contained'}
                  color={control.color ?? 'primary'}
                  size="large"
                  onClick={control.onClick ?? handleClose}
                >
                  <Typography variant="subtitle1" component="span">
                    {control.title}
                  </Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export { SimpleModal };
