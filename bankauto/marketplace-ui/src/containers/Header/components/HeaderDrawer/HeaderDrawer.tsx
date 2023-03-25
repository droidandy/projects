import React, { FC, PropsWithChildren, memo, useEffect } from 'react';
import { Drawer, Toolbar } from '@material-ui/core';
import { useStyles } from './HeaderDrawer.styles';

type HeaderMobileDrawerProps = PropsWithChildren<{
  open?: boolean;
}>;

const HeaderDrawerRoot: FC<HeaderMobileDrawerProps> = ({ open, children }) => {
  const classes = useStyles();

  useEffect(() => {
    if (open) {
      document.documentElement.classList.add(classes.disableScroll);
    }
    return () => {
      document.documentElement.classList.remove(classes.disableScroll);
    };
  }, [classes.disableScroll, open]);

  return (
    <Drawer classes={{ paper: classes.drawerPaper }} variant="persistent" anchor="right" open={open}>
      <Toolbar />
      <div className={classes.root}>{children}</div>
    </Drawer>
  );
};

const HeaderDrawer = memo(HeaderDrawerRoot);

export default HeaderDrawer;
