import React, { FC, memo } from 'react';
import { Typography, Button } from '@marketplace/ui-kit';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'components/Link';
import { ModalLight } from 'components/ModalLight';
import { WarningIcon, SuccessIcon } from 'icons/modalIcons';

type Props = {
  status: 403 | 404;
  isOpen: boolean;
  toggleOpen: () => void;
};

const MODAL_DATA_MAP = {
  403: {
    icon: SuccessIcon,
    title: 'Вы уже заказали осмотр этого автомобиля',
    buttonText: 'К списку заявок на осмотр',
    link: '/profile/inspections/',
  },
  404: {
    icon: WarningIcon,
    title: 'Автомобиль снят с продажи',
    buttonText: 'Выбрать другой автомобиль',
    link: '/car/',
  },
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
      [down('xs')]: {
        margin: '0 auto',
        padding: '2.5rem 1.25rem 1.25rem',
      },
    },
    title: {
      paddingTop: '1.25rem',
      paddingBottom: '2.5rem',
    },
    buttonWrapper: {
      display: 'block',
      width: '100%',
    },
  }),
  { name: 'InfoModal' },
);

export const InfoModal: FC<Props> = memo(({ status, isOpen, toggleOpen }) => {
  const s = useStyles();
  const { icon: Icon, title, buttonText, link } = MODAL_DATA_MAP[status];

  return (
    <ModalLight isOpen={isOpen} handleOpened={toggleOpen} onClose={toggleOpen} classes={{ content: s.content }}>
      <Icon width="5rem" height="5rem" viewBox="0 0 80 80" />

      <Typography variant="h5" component="p" className={s.title}>
        {title}
      </Typography>

      <Link href={link} className={s.buttonWrapper} onClick={toggleOpen}>
        <Button variant="contained" type="submit" size="large" color="primary" fullWidth>
          <Typography variant="h5" component="span">
            {buttonText}
          </Typography>
        </Button>
      </Link>
    </ModalLight>
  );
});
