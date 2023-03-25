import React from 'react';
import cx from 'classnames';
import { Box } from '@material-ui/core';
import { FinanceCard } from 'components';
import { Props as CardProps } from '../FinanceCard/FinanceCard.types';
import { useStyles } from './FinanceCardList.styles';

type Props = {
  list: CardProps[];
} & Pick<CardProps, 'direction' | 'className' | 'transparent'>;

const FinanceCardList = ({ list, className, transparent = false, direction = 'row' }: Props) => {
  const { root, item } = useStyles();
  return (
    <Box className={root}>
      {list.map((props) => (
        <FinanceCard
          {...props}
          direction={direction}
          transparent={transparent}
          className={cx(item, className)}
          key={props.title}
        />
      ))}
    </Box>
  );
};

export { FinanceCardList };
