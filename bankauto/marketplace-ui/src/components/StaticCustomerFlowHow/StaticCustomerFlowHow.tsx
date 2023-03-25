import React, { FC, memo } from 'react';

import { Button, ContainerWrapper, Icon, Typography, useToggle, Modal } from '@marketplace/ui-kit';

import { ReactComponent as YouTubeIcon } from 'icons/youtubeIcon.svg';

import { useStyles } from './StaticCustomerFlowHow.styles';

interface Props {
  sectionHow?: { [key: string]: string };
}

const StaticCustomerFlowHowRoot: FC<Props> = ({ sectionHow }) => {
  const classes = useStyles();
  const [modal, modalActions] = useToggle();
  return (
    <>
      <ContainerWrapper className={classes.root}>
        <Button
          classes={{ label: classes.buttonLabel }}
          className={classes.howWrapper}
          onClick={modalActions.handleOpen}
        >
          <Icon className={classes.youtubeIcon} component={YouTubeIcon} viewBox="0 0 70 50" />
          <Typography variant="h3" className={classes.howToBuy}>
            {sectionHow?.text}
          </Typography>
        </Button>
      </ContainerWrapper>
      <Modal onClose={modalActions.handleClose} disablePortal open={modal}>
        <iframe
          className={classes.iframeVideo}
          width="560"
          height="315"
          title={sectionHow?.text}
          src="https://www.youtube.com/embed/__INEPKfxRc"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </Modal>
    </>
  );
};

const StaticCustomerFlowHow = memo(StaticCustomerFlowHowRoot);

export { StaticCustomerFlowHow };
