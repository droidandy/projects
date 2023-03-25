import React, { FC, ReactNode } from 'react';
import { styled } from '@material-ui/core/styles';
import Block, { BlockProps, MessageVariant } from './Block';

enum StateLevel {
  processing,
  default,
  error,
}

export type PreviewVariant = keyof typeof StateLevel;

export const messageDefaults: Record<StateLevel, ReactNode> = {
  [StateLevel.default]: undefined,
  [StateLevel.processing]: 'Загрузка...',
  [StateLevel.error]: 'Файл не соответствует требованиям',
};

export const messageVariants: Record<StateLevel, MessageVariant | undefined> = {
  [StateLevel.default]: undefined,
  [StateLevel.processing]: 'info',
  [StateLevel.error]: 'warning',
};

const PreviewImg = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export interface PreviewProps extends Omit<BlockProps, 'variant' | 'shadow' | 'actions' | 'message'> {
  src: string;
  actions?: React.ReactNode;
  variant?: PreviewVariant;
  message?: React.ReactNode;
}

export const Preview: FC<PreviewProps> = ({ src, actions, variant = 'default', message, ...blockProps }) => {
  const currentState = StateLevel[variant];

  return (
    <Block
      shadow
      actions={actions && currentState > StateLevel.processing ? actions : undefined}
      variant={messageVariants[currentState]}
      message={message || messageDefaults[currentState]}
      {...blockProps}
    >
      <PreviewImg src={src} />
    </Block>
  );
};
