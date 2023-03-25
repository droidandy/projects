import * as React from 'react';
import { Button, ButtonProps } from '../Button/Button';
import { useNavigation } from '../../../hooks/navigation';
import { NavigationParams } from 'react-navigation';

export interface ButtonLinkProps extends ButtonProps {
  link: string;
  linkParams?: NavigationParams;
}

export const ButtonLink: React.FC<ButtonLinkProps> = (props: ButtonLinkProps) => {
  const navigation = useNavigation();
  const { link, linkParams, ...rest } = props;
  return <Button {...rest} onPress={(): boolean => navigation.navigate(link, linkParams)} />;
};
