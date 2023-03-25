import React from 'react';
import { Button, Typography } from '@marketplace/ui-kit';
import { Link } from 'components';
import { MenuItems } from 'constants/menuItems';
import cx from 'classnames';
import { useStyles } from './ButtonLink.style';

export const ButtonLink = (props: { classname?: string }) => {
  const { buttonWrapper } = useStyles();
  const {
    AllVehicles: { href: AllVehiclesHref },
  } = MenuItems;
  const { classname } = props;
  return (
    <div className={cx(buttonWrapper, classname)}>
      <Link href={AllVehiclesHref}>
        <Button variant="contained" color="primary" size="large" fullWidth>
          <Typography variant="h5" component="span">
            Подобрать автомобиль
          </Typography>
        </Button>
      </Link>
    </div>
  );
};
