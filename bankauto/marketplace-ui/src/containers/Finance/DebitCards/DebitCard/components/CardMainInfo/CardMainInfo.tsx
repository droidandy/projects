import React, { FC } from 'react';
import { Box, Button, ContainerWrapper, Paper, useBreakpoints, Grid, Typography } from '@marketplace/ui-kit';
import { ReactComponent as Mastercard } from 'icons/Mastercard.svg';
import { ReactComponent as Mir } from 'icons/Mir.svg';
import { PaymentSystem } from 'store/types';
import { CardWithAnimation } from '../../../../components';
import { useStyles } from './CardMainInfo.styles';

interface Props {
  img: string;
  title: string;
  shortDescription: string;
  tags: string[];
  paymentSystems: PaymentSystem[];
  buttonClickHandler: () => void;
}

const CardMainInfo: FC<Props> = ({ title, shortDescription, tags, img, paymentSystems, buttonClickHandler }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const button = (
    <Box mt={isMobile ? '1.25rem' : '0rem'} width={isMobile ? '100%' : '18.75rem'}>
      <Button variant="contained" color="primary" size="large" fullWidth onClick={buttonClickHandler}>
        <Typography variant="h5" component="span">
          Заказать карту
        </Typography>
      </Button>
    </Box>
  );
  return (
    <ContainerWrapper>
      <Paper elevation={0} variant={isMobile ? 'elevation' : 'outlined'}>
        <Box p={isMobile ? '1.25rem 0' : '3.75rem'}>
          <Grid container>
            <Grid item xs={12} sm={4}>
              <CardWithAnimation imgUrl={img} className={s.img} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box m={isMobile ? '1.25rem 0 0' : '0 0 0 5rem'} display="flex" flexDirection="column" height="100%">
                <Typography className={s.bulletData}>{tags.join(' • ')}</Typography>
                <Typography variant={isMobile ? 'h3' : 'h1'}>{title}</Typography>
                <Typography variant={isMobile ? 'body2' : 'h3'}>{shortDescription}</Typography>
                {!isMobile && (
                  <Box display="flex" flexGrow={1} alignItems="flex-end">
                    {button}
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={2} className={s.paymentIconBlock}>
              <Box display="flex" gridGap="1.25rem">
                {paymentSystems.includes('mastercard') && <Mastercard className={s.paymentIcon} />}
                {paymentSystems.includes('mir') && <Mir className={s.paymentIcon} />}
              </Box>
            </Grid>
          </Grid>
          {isMobile && button}
        </Box>
      </Paper>
    </ContainerWrapper>
  );
};

export { CardMainInfo };
