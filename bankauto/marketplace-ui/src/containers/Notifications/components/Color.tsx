import React, { FC } from 'react';
import { ReactComponent as ColorCheck } from '@marketplace/ui-kit/icons/color-check';
import Icon from '@marketplace/ui-kit/components/Icon';
import { useStyles } from './Color.styles';

export const ColorIcon: FC = () => {
  const { checkboxIcon, checkMark } = useStyles();

  return (
    <div className={`${checkboxIcon}`}>
      <Icon className={checkMark} component={ColorCheck} viewBox="-3 2 13 14" />
    </div>
  );
};
