import React, { FC } from 'react';
import Divider from '@marketplace/ui-kit/components/Divider';
import { DividerProps } from '@material-ui/core/Divider';
import cx from 'classnames';
import { useStyles } from './SectionDIvider.styles';

const SectionDivider: FC<DividerProps> = ({ ...props }) => {
  const { className } = props;
  const s = useStyles();
  return <Divider {...props} className={cx(className, s.divider)} />;
};
export { SectionDivider };
