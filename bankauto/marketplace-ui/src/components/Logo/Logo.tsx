import React, { FC, memo } from 'react';
import { ReactComponent as BankAutoLogoWhite } from '@marketplace/ui-kit/icons/bankautologowhite';
import { ReactComponent as BankAutoLogo } from '@marketplace/ui-kit/icons/bankautologo';
import { useStyles } from './Logo.styles';

type Colors = 'primary' | 'white';

export interface Props {
  color?: Colors;
  size?: 'small' | 'normal' | 'large';
}

const IconTypes: Record<Colors, FC<React.SVGProps<SVGSVGElement>>> = {
  white: BankAutoLogoWhite,
  primary: BankAutoLogo,
};

const LogoRoot: FC<Props> = ({ color = 'primary', size = 'normal' }: Props) => {
  const classes = useStyles();
  const Icon = IconTypes[color];
  return <Icon className={classes[size]} />;
};

const Logo = memo(LogoRoot);

export default Logo;
