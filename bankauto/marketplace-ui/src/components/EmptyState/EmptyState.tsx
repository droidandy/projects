import React, { ElementType, FC } from 'react';
import cx from 'classnames';
import { ContainerWrapper, CircularProgress, Icon, Typography } from '@marketplace/ui-kit';
import { useStyles } from './EmptyState.styles';
import { Props } from './types';

export const EmptyState: FC<Props> = ({
  header,
  headerTypographyProps,
  description,
  descriptionTypographyProps,
  isLoading,
  icon,
  iconHeight = 32,
  iconWidth = 32,
  primaryAction,
  secondaryAction,
  classNames,
}: Props) => {
  const s = useStyles();

  const actionsContainer =
    primaryAction || secondaryAction || isLoading ? (
      <div className={cx(s.actionsContainer, classNames?.actionsContainer)}>
        <div className={cx(s.buttonGroup, classNames?.buttonGroup)}>
          {primaryAction}
          {secondaryAction}
        </div>
        {isLoading && (
          <div className={cx(s.spinnerContainer, classNames?.spinnerContainer)}>
            <CircularProgress />
          </div>
        )}
      </div>
    ) : null;

  return (
    <div className={cx(s.container, classNames?.container)}>
      {icon && (
        <div className={cx(s.iconContainer, classNames?.iconContainer)}>
          <Icon component={icon} viewBox={`0 0 ${iconWidth} ${iconHeight}`} className={s.icon} />
        </div>
      )}
      {header && (
        <Typography variant="h3" component="div" align="center" {...headerTypographyProps}>
          {header}
        </Typography>
      )}
      {description && (
        <Typography variant="subtitle1" component="p" align="center" {...descriptionTypographyProps}>
          {description}
        </Typography>
      )}
      {actionsContainer}
    </div>
  );
};

export default EmptyState;
