import React, { FC } from 'react';
import { Container, ContainerProps } from './container';
import { ActionsLayer } from './actions';
import { MessageLayer, MessageLayerProps } from './message';
export type { MessageVariant } from './message';

export type BlockProps = ContainerProps &
  MessageLayerProps & {
    message?: React.ReactNode;
    actions?: React.ReactNode;
  };

const Block: FC<BlockProps> = ({ className, shadow, variant, message, actions, children, ...containerProps }) => {
  return (
    <Container className={className} {...containerProps}>
      {actions ? <ActionsLayer>{actions}</ActionsLayer> : null}
      {message ? (
        <MessageLayer shadow={shadow} variant={variant}>
          {message}
        </MessageLayer>
      ) : null}
      {children}
    </Container>
  );
};

export default Block;
