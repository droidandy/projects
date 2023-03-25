import React, { FC, Ref, HTMLProps } from 'react';
import cx from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

const useContainerStyles = makeStyles(
  ({ palette: { common } }) => ({
    root: {
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '0.5rem',
      backgroundColor: common.white,
    },
    book: {
      height: '17.5rem',
    },
    album: {
      height: '9.75rem',
    },
  }),
  { name: 'BlockContainer' },
);

export interface ContainerProps extends HTMLProps<HTMLDivElement> {
  className?: string;
  orientation?: 'album' | 'book';
  containerRef?: Ref<HTMLDivElement>;
}

export const Container: FC<ContainerProps> = ({
  className,
  orientation = 'album',
  children,
  containerRef,
  ...divProps
}) => {
  const classes = useContainerStyles();
  return (
    <div ref={containerRef} className={cx(classes.root, className, classes[orientation])} {...divProps}>
      {children}
    </div>
  );
};
