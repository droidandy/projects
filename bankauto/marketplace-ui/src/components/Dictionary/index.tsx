import React, { FC } from 'react';
import Typography, { TypographyProps } from '@marketplace/ui-kit/components/Typography';

export interface DictionaryProps extends TypographyProps {
  items: string[];
  divider?: string;
}

export const Dictionary: FC<DictionaryProps> = ({ items, divider, className, ...typographyProps }) => {
  return (
    <Typography className={className} {...typographyProps}>
      {items.join(divider || ' • ')}
    </Typography>
  );
};
