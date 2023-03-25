import React, { FC, useContext } from 'react';
import { Button } from '@material-ui/core';
import { Typography, Icon, IconButton, Toolbar, Grid } from '@marketplace/ui-kit';
import { ReactComponent as IconClose } from '@marketplace/ui-kit/icons/icon-close';
import MobileModalContext from '../MobileModalContext/MobileModalContext';
import { MobileModalContainer } from '../MobileModalContainer/MobileModalContainer';
import { useStyles } from './MobileModalHeader.styles';

interface Props {
  onClose?: (event: React.SyntheticEvent) => void;
  showCloseButton?: boolean;
  showActionButton?: boolean;
  actionButtonLabel?: string;
  onClickActionButton?: () => void;
  className?: string;
}

export const MobileModalHeader: FC<Props> = ({
  onClose,
  showCloseButton = true,
  showActionButton = false,
  actionButtonLabel = '',
  onClickActionButton,
  children,
  className,
}) => {
  const s = useStyles();
  const context = useContext(MobileModalContext);
  const handleClose = (event: React.SyntheticEvent) => {
    if (onClose) {
      onClose(event);
    } else {
      context.onClose(event);
    }
  };
  return (
    <MobileModalContainer className={[s.root, className].join(' ')}>
      <Toolbar disableGutters>
        <Grid container justify="space-between" alignItems="center" className={s.container}>
          <Grid item xs={2}>
            {showActionButton && (
              <Button color="primary" onClick={onClickActionButton}>
                <Typography variant="caption" className={s.actionButtonLabel}>
                  {actionButtonLabel}
                </Typography>
              </Button>
            )}
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h5" className={s.title} align="center">
              {children}
            </Typography>
          </Grid>
          <Grid item xs={2} className={s.rightSlot}>
            {showCloseButton ? (
              <IconButton aria-label="close" onClick={handleClose} classes={{ root: s.iconButton }}>
                <Icon viewBox="0 0 16 16" component={IconClose} className={s.icon} />
              </IconButton>
            ) : null}
          </Grid>
        </Grid>
      </Toolbar>
    </MobileModalContainer>
  );
};
