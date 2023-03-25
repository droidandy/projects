import React, { FC } from 'react';
import { Paper, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { Button } from '@material-ui/core';
import { useStyles } from './SafeDealModal.style';

interface Props {
  handleClose: React.MouseEventHandler<HTMLElement>;
}

const SafeDealModal: FC<Props> = ({ handleClose }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  return (
    <Paper className={s.paper}>
      {isMobile ? <></> : <img src="/images/pts-checked.png" alt="card" className={s.image} />}
      <Typography variant="h5" color="primary" align="center">
        РГС Банк финансирует сделку купли&#8209;продажи авто и обеспечивает ее юридическую чистоту:
      </Typography>
      <Typography className={s.desc} variant="body1">
        Сотрудник Банка сам подготовит договор купли&#8209;продажи, а также акты приема&#8209;передачи авто для обеих
        сторон. Текст договора выверен юристами Банка и не содержит рисков.
      </Typography>
      <Typography className={s.desc} variant="body1">
        После подписания документов кредитные средства переводятся на реквизиты продавца в другой банк или на бесплатную
        карту РГС Банка.
      </Typography>
      <Button color="primary" variant="contained" className={s.button} onClick={handleClose} fullWidth>
        Закрыть
      </Button>
    </Paper>
  );
};

export { SafeDealModal };
