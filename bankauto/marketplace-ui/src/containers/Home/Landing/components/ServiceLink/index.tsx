import React, { FC } from 'react';
import { Button, Divider, Typography } from '@marketplace/ui-kit';
import { Link } from 'components';
import cx from 'classnames';
import { useStyles } from './ServiceLink.styles';

interface ServiceLinkProps {
  className?: string;
  color?: 'primary' | 'secondary' | 'inherit' | 'default';
  text: string;
  href: string;
}

export const ServiceLink: FC<ServiceLinkProps> = ({ className, color, text, href }) => {
  const s = useStyles();
  return (
    <>
      <Divider />
      <Link href={href}>
        <Button variant="text" color={color || 'primary'} fullWidth className={cx(s.mainLink, className)}>
          <Typography variant="h5">{text}</Typography>
        </Button>
      </Link>
      <Divider />
    </>
  );
};
