import React, { FC } from 'react';
import { BackdropModal, Paper, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { Button } from '@material-ui/core';
import { useStyles } from './CardInfoModal.style';
import { Table } from './Table';

interface Props {
  closeModal: () => void;
}

const CardInfoModal: FC<Props> = ({ closeModal }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  return (
    <BackdropModal opened onClose={closeModal} handleOpened={() => {}}>
      {({ handleClose }) => (
        <Paper className={s.paper}>
          {isMobile ? <></> : <img src="/images/deposit-card.png" alt="card" className={s.image} />}
          <Typography className={s.title} variant="h5" color="primary">
            Карта «АвтоДрайв» оформляется бесплатно к вашему вкладу <br />
            Совершайте покупки по карте <br />и получайте надбавку к базовой ставке по вкладу:
          </Typography>
          <Table />
          <Typography className={s.desc} variant="body1">
            Получите повышенную доходность по вкладу с остатком на счете в первый календарный день расчетного периода не
            более 1 000 000 рублей.
          </Typography>
          <Button color="primary" variant="contained" className={s.button} onClick={handleClose}>
            Закрыть
          </Button>
        </Paper>
      )}
    </BackdropModal>
  );
};

export { CardInfoModal };
