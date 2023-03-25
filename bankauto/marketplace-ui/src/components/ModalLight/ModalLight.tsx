import React, { FC, useCallback } from 'react';
import cx from 'classnames';
import { Backdrop, Fade } from '@material-ui/core';
import { useBreakpoints, Paper, Modal, IconButton, Icon } from '@marketplace/ui-kit';
import { ReactComponent as IconClose } from '@marketplace/ui-kit/icons/icon-close.svg';
import { useStyles } from './ModalLight.styles';

type ModalLightClasses = {
  root?: string;
  iconButton?: string;
  iconClose?: string;
  content?: string;
};

interface Props {
  isOpen: boolean;
  handleOpened: (val: boolean) => void;
  onClose: () => void;
  classes?: ModalLightClasses;
  showCloseIcon?: boolean;
  disableEscapeKeyDown?: boolean;
  closable?: boolean;
}

export const ModalLight: FC<Props> = ({
  isOpen,
  handleOpened,
  onClose,
  closable = true,
  showCloseIcon = closable,
  disableEscapeKeyDown = !closable,
  children,
  classes = {},
}) => {
  const { isMobile } = useBreakpoints();
  const s = useStyles({ isMobile });

  const handleClose = useCallback(() => {
    if (!closable) {
      return false;
    }

    handleOpened(false);

    if (onClose) {
      onClose();
    }
    return true;
  }, [handleOpened, onClose]);

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      className={s.root}
      disableEscapeKeyDown={disableEscapeKeyDown}
    >
      <Fade in={isOpen}>
        <Paper className={cx(classes.root, s.modal)}>
          {showCloseIcon && (
            <div className={cx(classes.iconButton, s.iconCloseWrapper)}>
              <IconButton
                aria-label="close"
                onClick={() => {
                  handleClose();
                }}
              >
                <Icon
                  viewBox="0 0 16 16"
                  width="14"
                  height="14"
                  className={cx(classes.iconClose, s.iconClose)}
                  component={IconClose}
                />
              </IconButton>
            </div>
          )}
          <div className={cx(classes.content, s.content)}>{children}</div>
        </Paper>
      </Fade>
    </Modal>
  );
};
