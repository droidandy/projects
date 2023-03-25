import React, { FC } from 'react';
import { Typography, Divider } from '@marketplace/ui-kit';
import { makeStyles } from '@material-ui/core/styles';
import { ModalLight } from 'components/ModalLight'; //TODO: Заменить в модуле
import { WarningIcon } from '../icons';

type Props = {
  isOpen: boolean;
  toggleOpen: () => void;
};

export const useStyles = makeStyles(
  ({ breakpoints: { down } }) => ({
    content: {
      margin: 0,
      padding: '2.5rem 3.75rem 3.75rem',
      maxWidth: '31.25rem',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      [down('xs')]: {
        margin: '0 auto',
        padding: '2.5rem 1.25rem 1.25rem',
      },
    },
    title: {
      paddingTop: '1.25rem',
      paddingBottom: '1.25rem',
    },
    description: {
      paddingBottom: '1.875rem',
    },
    divider: {
      width: '100%',
      margin: '1.25rem 0',
    },
    phone: {
      paddingTop: '0.625rem',
    },
  }),
  { name: 'CancelModal' },
);

export const CancelModal: FC<Props> = ({ isOpen, toggleOpen }) => {
  const s = useStyles();

  return (
    <ModalLight isOpen={isOpen} handleOpened={toggleOpen} onClose={toggleOpen} classes={{ content: s.content }}>
      <WarningIcon width="5rem" height="5rem" viewBox="0 0 80 80" />

      <Typography variant="h5" component="p" className={s.title}>
        Отмена заявки
      </Typography>

      <Typography className={s.description}>
        Отменить заявку и осуществить возврат средств можно только до начала осмотра.
      </Typography>
      <Typography>Свяжитесь со службой поддержки Expocar</Typography>
      <Divider className={s.divider} />
      <Typography variant="h5" component="p">
        Служба поддержки
      </Typography>

      <a href="tel:+78007004040">
        <Typography variant="h3" component="p" color="textPrimary" className={s.phone}>
          8 800 770-03-11
        </Typography>
      </a>
    </ModalLight>
  );
};
