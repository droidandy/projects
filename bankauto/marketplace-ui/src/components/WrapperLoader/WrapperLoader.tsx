import React, { FC } from 'react';
import { CircularProgress, useBreakpoints } from '@marketplace/ui-kit';
import { StyledProps } from '@marketplace/ui-kit/types';
import cx from 'classnames';
import { useStyles } from './WrapperLoader.styles';

interface Props extends StyledProps {
  loading: boolean;
}

export const WrapperLoader: FC<Props> = ({ children, loading, className }) => {
  const s = useStyles({ loading });
  const { isMobile } = useBreakpoints();
  return (
    <div className={cx(s.root, className)}>
      {loading && (
        <div className={s.loaderWrapper}>
          <CircularProgress className={s.loader} size={isMobile ? '3rem' : '4.5rem'} />
        </div>
      )}
      {children}
    </div>
  );
};
