import React, { FC } from 'react';
import cx from 'classnames';
import { makeStyles, styled } from '@material-ui/core/styles';

export const MessageContainer = styled('div')(
  ({
    theme: {
      palette: { text },
      breakpoints: { down },
      typography: { caption },
    },
  }) => ({
    position: 'absolute',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: '1.25rem',
    ...caption,
    color: text.secondary,
    fontWeight: 700,
    [down('xs')]: {
      padding: '0',
      fontWeight: 600,
    },
  }),
  { name: 'MessageContainer' },
);

export const MessageContent = styled('div')(
  ({
    theme: {
      breakpoints: { down },
    },
  }) => ({
    textAlign: 'center',
    fontWeight: 700,
    [down('xs')]: {
      padding: '0',
      fontWeight: 600,
    },
  }),
  { name: 'MessageContent' },
);

const useLayerStyles = makeStyles(
  ({ palette: { error, common }, breakpoints: { down } }) => ({
    shadow: {
      color: common.white,
      background: 'rgba(0, 0, 0, 0.5)',
      '& $info': {},
    },
    info: {},
    warning: {
      background: error.main,
      color: common.white,
      borderRadius: '0.5rem',
      padding: '0.75rem',
      [down('xs')]: {
        alignSelf: 'flex-end',
        padding: '0.25rem 0.5rem 0.5rem',
        borderRadius: '0 0 0.5rem',
        width: '100%',
      },
    },
  }),
  { name: 'Message' },
);

export type MessageVariant = 'info' | 'warning';

export interface MessageLayerProps {
  shadow?: boolean;
  variant?: MessageVariant;
}

export const MessageLayer: FC<MessageLayerProps> = ({ shadow, variant = 'info', children }) => {
  const classes = useLayerStyles();
  return (
    <MessageContainer className={cx({ [classes.shadow]: shadow })}>
      <MessageContent className={classes[variant]}>{children}</MessageContent>
    </MessageContainer>
  );
};
