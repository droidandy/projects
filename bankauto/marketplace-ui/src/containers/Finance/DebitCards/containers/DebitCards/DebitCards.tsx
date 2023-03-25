import React, { FC } from 'react';
import { ContainerWrapper, useBreakpoints } from '@marketplace/ui-kit';
import { Grid } from '@material-ui/core';
import { useStyles } from './DebitCards.styles';
import { DebitCardFilter } from '../../components';
import { DebitCardList } from '../../components/DebitCardList';
import { useFilteredItems } from '../../hooks/useFilteredItems';

const DebitCards: FC = () => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();

  const { filteredItems } = useFilteredItems();

  return (
    <>
      <ContainerWrapper className={s.root}>
        <Grid container justify="center">
          <Grid item xs={isMobile ? 12 : 10}>
            <DebitCardFilter cardNumber={filteredItems?.length} />
          </Grid>
        </Grid>
      </ContainerWrapper>
      <ContainerWrapper>
        <Grid container justify="center">
          <Grid item xs={isMobile ? 12 : 10}>
            <DebitCardList debitCardList={filteredItems} />
          </Grid>
        </Grid>
      </ContainerWrapper>
    </>
  );
};

export { DebitCards };
