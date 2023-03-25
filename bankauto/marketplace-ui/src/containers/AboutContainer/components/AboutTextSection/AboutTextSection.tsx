import React, { FC, memo } from 'react';
import { ContainerWrapper, Grid, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { useStyles } from './AboutTextSection.styles';

const AboutTextSectionRoot: FC = () => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();

  return (
    <ContainerWrapper className={s.root} bgcolor="background.paper">
      <Grid container spacing={isMobile ? 0 : 4} className={s.gridContent}>
        <Grid item sm={4}>
          <div className={s.accentBlock}>
            <Typography variant="h4">#банкавто — автомобильный маркетплейс, проект ПАО «РГС БАНК».</Typography>
            <Typography variant="h4">Мы помогаем подобрать автомобиль, выгодно купить или продать.</Typography>
          </div>
        </Grid>
        <Grid item sm={8}>
          <div className={s.textBlock}>
            <Typography variant="body1">
              На маркетплейсе легко подобрать, купить или продать автомобиль. Для завершения сделки потребуется всего
              раз приехать к дилеру. У нас можно оформить страховку на свой автомобиль или получить кредит. Или сразу
              найти подходящий автомобиль, оформить кредит и застраховать покупку.
            </Typography>
            <Typography variant="body1">
              Мы помогаем продавцам автомобилей и покупателям найти друг друга, сделать процесс максимально простым и
              удобным для всех сторон. Чтобы это стало возможным, мы привлекаем надежных игроков автомобильного рынка с
              которыми можно быть уверенным в своей покупке.
            </Typography>
          </div>
        </Grid>
      </Grid>
    </ContainerWrapper>
  );
};

const AboutTextSection = memo(AboutTextSectionRoot);
export { AboutTextSection };
