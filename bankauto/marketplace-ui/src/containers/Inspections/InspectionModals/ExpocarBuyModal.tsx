import React, { FC, memo, useCallback } from 'react';
import { Typography, Button, useBreakpoints, PriceFormat } from '@marketplace/ui-kit';
import { makeStyles } from '@material-ui/core/styles';
import { ReactComponent as IconSuccess } from 'icons/iconSuccess.svg';
import { ModalLight } from 'components/ModalLight';
import { FORM_ACTION, INSPECTIONS_CONTRACT_OFFER, INSPECTION_PRICE } from 'constants/expocar';

type FormProps = {
  toggleOpen: () => void;
  orderId: number;
  phone: string;
  email?: string | null;
};

type Props = FormProps & {
  isOpen: boolean;
};

export const useStyles = makeStyles(
  ({ breakpoints: { down } }) => ({
    content: {
      margin: 0,
      padding: '2.5rem 3.75rem 3.75rem',
      maxWidth: '31.25rem',
      boxSizing: 'border-box',
      [down('xs')]: {
        margin: '0 auto',
        padding: '3.75rem 1.25rem 1.25rem',
      },
    },
    title: {
      whiteSpace: 'pre-wrap',
    },
    contentBlock: {
      paddingTop: '0.625rem',
    },
    infoItem: {
      display: 'flex',
      flexFlow: 'row nowrap',
      paddingTop: '1.25rem',
      '&:firs-of-type': {
        paddingTop: '1.875rem',
      },
      '&:last-of-type': {
        paddingBottom: '1.875rem',
      },
    },
    icon: {
      flexShrink: 0,
    },
    infoItemText: {
      paddingLeft: '0.625rem',
    },
    button: {
      padding: '0.5rem 1.375rem',
      marginBottom: '1.25rem',
      [down('xs')]: {
        margin: '0 -0.625rem',
        marginTop: '3.75rem',
      },
    },
    text: {
      fontWeight: 600,
    },
  }),
  { name: 'ExpocarBuyModal' },
);

const INFO_DATA = [
  'В течение 1 дня с момента оплаты с вами свяжется эксперт и обговорит детали.',
  'Эксперт проверит кузов, техническое состояние и юридическую чистоту',
  'В течение 2 дней вы получите комплексный отчет о состоянии автомобиля по 124 пунктам на почту, WhatsApp или Telegram.',
];

export const InfoItem: FC<{ text: string }> = ({ text }) => {
  const { isMobile } = useBreakpoints();
  const s = useStyles();

  return (
    <div className={s.infoItem}>
      <IconSuccess width="1.25rem" height="1.25rem" viewBox="0 0 20 20" className={s.icon} />
      <Typography variant={isMobile ? 'body2' : 'body1'} component="span" className={s.infoItemText}>
        {text}
      </Typography>
    </div>
  );
};

const infoDataJsx = INFO_DATA.map((item) => <InfoItem text={item} />);

export const PayForm: FC<FormProps> = ({ toggleOpen, orderId, phone, email }) => {
  const s = useStyles();

  const handleSubmit = useCallback(() => {
    toggleOpen();
  }, [toggleOpen]);

  return (
    <form method="POST" action={FORM_ACTION} onSubmit={handleSubmit}>
      <input type="text" name="sum" value={INSPECTION_PRICE} hidden />
      <input type="text" name="client_phone" value={phone} hidden />
      {email && <input type="text" name="client_email" value={email} hidden />}
      <input type="text" name="orderid" value={orderId} hidden />
      <input type="text" name="service_name" value="Оплата выездной оценки автомобиля" hidden />
      <Button variant="contained" type="submit" size="large" color="primary" className={s.button} fullWidth>
        <Typography variant="h5" component="div">
          Перейти к оплате
          <Typography variant="caption" component="div">
            за <PriceFormat value={INSPECTION_PRICE} />
          </Typography>
        </Typography>
      </Button>
    </form>
  );
};

export const ExpocarBuyModal: FC<Props> = memo(({ isOpen, toggleOpen, ...rest }) => {
  const { isMobile } = useBreakpoints();
  const s = useStyles();

  const form = <PayForm {...rest} toggleOpen={toggleOpen} />;

  return (
    <ModalLight isOpen={isOpen} handleOpened={toggleOpen} onClose={toggleOpen} classes={{ content: s.content }}>
      <Typography variant={isMobile ? 'h4' : 'h3'} component="p" className={s.title}>
        {'Выездная диагностика \nэтого автомобиля'}
      </Typography>

      {infoDataJsx}

      {!isMobile && form}

      <Typography variant="caption" className={s.text} component="p">
        Совершая платёж, вы соглашаетесь с условиями{' '}
        <a href={INSPECTIONS_CONTRACT_OFFER} rel="noreferrer" target="_blank">
          <Typography variant="caption" color="primary" component="span">
            оферты
          </Typography>
        </a>
      </Typography>
      <Typography variant="caption" className={[s.contentBlock, s.text].join(' ')} component="p">
        {`Услуга оказывается ООО "ЭКСПОКАР" ОГРН 1207700181732 107078,\n
          г. Москва, ул. Каланчевская, д.29, стр.2, офис 602.
          Время работы 9:00-20:00 ежедневно`}
      </Typography>

      {isMobile && form}
    </ModalLight>
  );
});
