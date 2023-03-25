import React, { FC } from 'react';
import { TitleProps, Title } from './Title';
import { useStyles } from '../Contract.styles';

export const FormBlock: FC<Pick<TitleProps, 'title' | 'tooltipText'>> = ({ children, ...rest }) => {
  const { block } = useStyles();
  return (
    <div className={block}>
      <Title {...rest} />
      {children}
    </div>
  );
};

export const FormBlockInner: FC<Pick<TitleProps, 'title' | 'tooltipText'>> = ({ children, ...rest }) => {
  const { blockInner } = useStyles();
  return (
    <div className={blockInner}>
      <Title {...rest} isSubTitle />
      {children}
    </div>
  );
};
