import React, { SVGProps, ElementType, ReactNode } from 'react';
import { TypographyProps } from '@material-ui/core/Typography';

type Classes = {
  container?: string;
  actionsContainer?: string;
  buttonGroup?: string;
  iconContainer?: string;
  icon?: string;
  spinnerContainer?: string;
};

export interface DescriptionTypographyProps extends TypographyProps {
  component?: ElementType;
}

export interface HeaderTypographyProps extends TypographyProps {
  component?: ElementType;
}

export interface Props {
  header?: string;
  headerTypographyProps?: HeaderTypographyProps;
  description?: string;
  descriptionTypographyProps?: DescriptionTypographyProps;
  icon?: ElementType;
  iconHeight?: number;
  iconWidth?: number;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  isLoading?: boolean;
  classNames?: Classes;
}
