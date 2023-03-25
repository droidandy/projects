import React, { FC } from 'react';
import classNames from 'classnames';
import { Typography } from '@marketplace/ui-kit';
import { useStyles } from './AccordionTab.styles';

type Props = {
  isActive: boolean;
  disabled?: boolean;
  className?: string;
  title: string;
  handleClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
};

export const AccordionTab: FC<Props> = ({ isActive, disabled, className, title, handleClick }) => {
  const { tabItem } = useStyles();
  const color = disabled ? 'textSecondary' : isActive ? 'primary' : 'textPrimary';

  return (
    <Typography
      variant="h5"
      component="span"
      color={color}
      className={classNames(tabItem, className, { active: isActive, disabled })}
      onClick={!disabled ? handleClick : () => {}}
      noWrap
    >
      {title}
    </Typography>
  );
};
