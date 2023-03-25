import React, { FC } from 'react';

import { Typography } from '@material-ui/core';
import { Box, Button, useBreakpoints, PageBackgroundWrapper, ContainerWrapper } from '@marketplace/ui-kit';
import Modal, { Props as ModalProps } from '@marketplace/ui-kit/components/Modal';
import { ComponentProps } from '@marketplace/ui-kit/types';

import { ReactComponent as IconClose } from 'icons/iconClose.svg';
import { ReactComponent as IconCloseMobile } from 'icons/iconCloseMobile.svg';

import { noop } from 'helpers/noop';
import { useModalAddress } from 'hooks/useModalAddress';

import { useStyles } from './ModalContainer.styles';

export interface Props extends Omit<ModalProps, 'children'>, ComponentProps {
  title: string;
  subtitle?: string | string[];
  align?: 'left' | 'right' | 'inherit' | 'center' | 'justify';
  narrow?: boolean;
  onClose?: () => void;
}

const ModalContainer: FC<Props> = ({
  title,
  subtitle,
  children,
  align = 'inherit',
  narrow = false,
  onClose,
  ...modalProps
}) => {
  const s = useStyles({ align, narrow });
  const { isMobile } = useBreakpoints();

  useModalAddress({
    opened: modalProps.open,
    onClose: onClose ?? noop,
  });

  return (
    <Modal {...modalProps}>
      <Box bgcolor="background.paper" className={s.root}>
        <PageBackgroundWrapper
          childOne={
            <ContainerWrapper className={s.header}>
              <div className={s.headerInner}>
                <Button onClick={onClose} className={s.close}>
                  {isMobile ? <IconCloseMobile /> : <IconClose />}
                </Button>
                <Typography variant="h3" className={s.title}>
                  {title}
                </Typography>
                <Typography
                  align={align}
                  variant={isMobile ? 'body2' : 'h5'}
                  color="textSecondary"
                  className={s.subtitle}
                >
                  {subtitle}
                </Typography>
              </div>
            </ContainerWrapper>
          }
          childTwo={<ContainerWrapper>{children}</ContainerWrapper>}
          colorOne="primary.main"
          colorTwo="transparent"
          negativeTop="3.5"
        />
      </Box>
    </Modal>
  );
};

export default ModalContainer;
