import React, { FC } from 'react';
import cx from 'classnames';
import Drawer from '@material-ui/core/Drawer';
import { Modal } from '@marketplace/ui-kit';
import { useStyles } from './MobileModalRoot.styles';
import MobileModalContext from '../MobileModalContext/MobileModalContext';

export interface MobileModalProps {
  className?: string;
  open: boolean;
  onClose: (event: React.SyntheticEvent) => void;
}

export const MobileModalRoot: FC<MobileModalProps> = ({ onClose, open, children, className }) => {
  const s = useStyles();

  return (
    <Modal open={open} onClose={onClose}>
      <MobileModalContext.Provider value={{ onClose }}>
        <div className={cx(s.root, className)}>{children}</div>
      </MobileModalContext.Provider>
    </Modal>
  );
};

export const MobileModalDrawer: FC<MobileModalProps> = ({ onClose, open, children, className }) => {
  const s = useStyles();
  return (
    <Drawer open={open} onClose={onClose} anchor="right" classes={{ paper: s.drawerPaper }}>
      <MobileModalContext.Provider value={{ onClose }}>
        <div className={cx(s.root, className)}>{children}</div>
      </MobileModalContext.Provider>
    </Drawer>
  );
};
