import React from 'react';

import { useStyles } from './ContainerWrapper.styles';
import { ComponentProps } from 'types/ComponentProps';
import { TypeBackground } from '@material-ui/core/styles/createPalette';

interface Props extends ComponentProps {
  children?: React.ReactNode;
  background?: keyof TypeBackground;
}

export const ContainerWrapper = ({ children, className, background }: Props): JSX.Element => {
  const { root, containerInner, defaultBackground, paperBackground } = useStyles();

  return (
    <section className={[root, background === 'default' ? defaultBackground : paperBackground, className].join(' ')}>
      <div className={containerInner}>{children}</div>
    </section>
  );
};
