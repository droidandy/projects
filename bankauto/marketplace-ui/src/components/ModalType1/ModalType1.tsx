import React, { FC, ReactNode } from 'react';

import { BackdropModal, Icon, IconButton, Paper, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { ReactComponent as IconClose } from '@marketplace/ui-kit/icons/icon-close.svg';

import { useStyles } from './ModalType1.styles';

interface Props {
  title: string;
  show: boolean;
  setShow: (show: boolean) => void;
  children: ReactNode | ReactNode[];
}

const ModalType1: FC<Props> = ({ title, show, setShow, children }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();

  return (
    <BackdropModal opened={show} handleOpened={setShow} onClose={() => setShow(false)}>
      {({ handleClose }) => (
        <Paper className={s.root}>
          <Paper className={s.title}>
            <IconButton aria-label="close" onClick={handleClose} className={s.cross}>
              <Icon viewBox="0 0 16 16" component={IconClose} className={s.crossIcon} />
            </IconButton>
            <Typography className={s.titleText} component="h4" variant={isMobile ? 'h1' : 'h4'}>
              {title}
            </Typography>
          </Paper>
          <div className={s.content}>{children}</div>
        </Paper>
      )}
    </BackdropModal>
  );
};

export { ModalType1 };
