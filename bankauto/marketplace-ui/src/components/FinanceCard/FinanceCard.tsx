import React from 'react';
import cx from 'classnames';
import { Box, Icon, Link, Typography } from '@material-ui/core';
import { Props } from './FinanceCard.types';
import { useStyles } from './FinanceCard.styles';

const FinanceCard = ({
  className,
  title,
  subTitle,
  icon,
  link,
  transparent = false,
  direction = 'row',
  isOpenOnNewPage = false,
}: Props) => {
  const styles = useStyles({ direction, link, transparent });
  const card = (
    <>
      <Icon className={styles.icon}>{icon}</Icon>
      <Box>
        {title && (
          <Typography variant="body1" className={styles.title}>
            {title}
          </Typography>
        )}
        {subTitle && (
          <Typography variant="body2" className={styles.subTitle}>
            {subTitle}
          </Typography>
        )}
      </Box>
    </>
  );
  return link ? (
    <Link
      underline="none"
      target={isOpenOnNewPage ? '_blank' : '_self'}
      href={link}
      className={cx(styles.box, className)}
    >
      {card}
    </Link>
  ) : (
    <Box className={cx(styles.box, className)}>{card}</Box>
  );
};

export { FinanceCard };
