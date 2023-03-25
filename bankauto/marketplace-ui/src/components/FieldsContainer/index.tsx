import React, { FC } from 'react';
import cx from 'classnames';
import { Typography, useBreakpoints } from '@marketplace/ui-kit';
import { useStyles } from './FieldsContainer.styles';

type Classes = Partial<ReturnType<typeof useStyles>>;

export interface FieldsContainerProps {
  id?: string;
  title?: React.ReactNode;
  classes?: Classes;
  style?: React.CSSProperties;
  transparent?: boolean;
}

export const FieldsContainer: FC<FieldsContainerProps> = ({
  id,
  title,
  transparent = false,
  classes,
  style,
  children,
}) => {
  const { isMobile } = useBreakpoints();
  const classesBase = useStyles();
  return (
    <div id={id} className={cx(classesBase.root, classes?.root)} style={style}>
      {title ? (
        <Typography variant={isMobile ? 'h5' : 'h4'} className={cx(classesBase.title, classes?.title)}>
          {title}
        </Typography>
      ) : null}
      <div
        className={cx(
          classesBase.paper,
          classes?.paper,
          transparent && cx(classesBase.paperTransparent, classes?.paperTransparent),
        )}
      >
        {children}
      </div>
    </div>
  );
};
