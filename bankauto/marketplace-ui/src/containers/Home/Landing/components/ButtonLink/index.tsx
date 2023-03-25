import React from 'react';
import { Button, Typography } from '@marketplace/ui-kit';
import { Link } from 'components';
import { useStyles } from './ButtonLink.style';

export const ButtonLink = (props: {
  classname?: string;
  text: string;
  link: string;
  variant: 'text' | 'outlined' | 'contained';
}) => {
  const { button } = useStyles();

  const { classname, variant, text, link } = props;
  return (
    <div className={classname}>
      <Link href={link} target={'_blank'}>
        <Button variant={variant} color="primary" size="large" fullWidth className={button}>
          <Typography variant="h5" component="span">
            {text}
          </Typography>
        </Button>
      </Link>
    </div>
  );
};
