import React from 'react';
import { Grid, Typography, PriceFormat } from '@marketplace/ui-kit';

import { useStyles } from '../InsuranceModal.styles';

interface Props {
  price?: number;
}

const CascoText = ({ price }: Props) => {
  const classes = useStyles();

  return (
    <Grid container direction="column" wrap="nowrap" className={classes.insuranceInfo} spacing={2}>
      <Grid item>
        <Typography variant="h5">
          КАСКО – комплексное автомобильное страхование от ущерба, хищения или угона.
        </Typography>
      </Grid>
      {price && (
        <Grid item>
          <Typography variant="h5" component="div" color="primary">
            <PriceFormat value={price} />
            /год
          </Typography>
        </Grid>
      )}
      <Grid item>
        <Typography variant="h5">Базовые опции</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">
          Аварийный комиссар, эвакуатор, полис без франшизы Ремонт у официального дилера
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="h5">Описание</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">
          В этом тарифе полис без франшизы, с ремонтом у официального дилера, совмещен со всеми необходимыми опциями для
          автолюбителя.
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">Аварийный комиссар</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">
          Аварийный комиссар выезжает только на ДТП с двумя и более участниками. На месте ДТП производится осмотр
          повреждений, составляется заявление в страховую компанию. Затем аварийный комиссар собирает справки по ДТП в
          ГИБДД.
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">Эвакуатор</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">
          Услуга эвакуации предоставляется неограниченное количество раз в течение срока действия полиса, в пределах 10
          000 рублей по каждому страховому случаю. Если расходы на эвакуацию будут больше, то вам будет нужно оплатить
          оставшуюся часть. Например, если автомобиль был эвакуирован с отдаленного участка загородного шоссе.
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">Замена стекол без справок</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">
          Стекла, фары, задние фонари и другие стеклянные элементы можно заменить без предоставления справок. Один раз в
          течение срока действия полиса.
        </Typography>
      </Grid>
    </Grid>
  );
};

export { CascoText };
