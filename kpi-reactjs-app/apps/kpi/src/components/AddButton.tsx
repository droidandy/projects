import React from 'react';
import { Link } from 'typeless-router';
import { Trans } from 'react-i18next';
import { Button } from './Button';

interface AddButtonProps {
  href?: string;
  onClick?: () => any;
  children: React.ReactNode;
}

export function AddButton(props: AddButtonProps) {
  const { href, children, onClick } = props;
  const button = (
    <Button iconSize="lg" onClick={onClick}>
      <i className="flaticon2-plus" />
      <Trans>{children}</Trans>
    </Button>
  );
  if (!href) {
    return button;
  }
  return <Link href={href}>{button}</Link>;
}
