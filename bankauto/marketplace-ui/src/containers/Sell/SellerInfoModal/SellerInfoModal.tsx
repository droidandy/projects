import React, { FC } from 'react';
import { Seller } from '@marketplace/ui-kit/types';
import { Grid, Typography, useBreakpoints, Icon, Button, CircularProgress } from '@marketplace/ui-kit';
import { ReactComponent as AccountIcon } from '@marketplace/ui-kit/icons/icon-account';
import { ModalLight } from 'components/ModalLight';
import { ReactComponent as PhoneCallIcon } from 'icons/phoneCall';
import { ReactComponent as LocationIcon } from 'icons/iconLocation.svg';
import { MapSection } from './components';
import { formatPhone } from 'helpers/phone';
import { useStyles } from './SellerInfoModal.styles';

//TODO заменить Contacts на ContactsNew, когда в ките экспорт этого типа добавится
interface Contacts {
  latitude: number;
  longitude: number;
  address: string;
}
interface SellerInfoModalProps {
  city: string;
  isOpen: boolean;
  contacts: Contacts | null;
  sellerInfo: Seller | null;
  buttonDisabled: boolean;
  toggleOpen: () => void;
  creditBookingHandler: () => void;
}

export const SellerInfoModal: FC<SellerInfoModalProps> = ({
  city,
  isOpen,
  contacts,
  sellerInfo,
  buttonDisabled,
  toggleOpen,
  creditBookingHandler,
}) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();

  const sellerPhoneNumber = sellerInfo ? formatPhone(`${sellerInfo.phoneNumber}`) : '';
  const sellerName = sellerInfo?.firstName ? `${sellerInfo.firstName} ${sellerInfo?.lastName || ''}` : '';
  const isAddressSet = contacts && contacts.address !== 'неизвестен';
  const address = isAddressSet ? contacts?.address : city;

  return (
    <ModalLight
      classes={{ root: s.modalRoot, content: s.modalContent }}
      handleOpened={toggleOpen}
      onClose={toggleOpen}
      isOpen={isOpen}
    >
      <div className={s.root}>
        <Typography variant={isMobile ? 'h4' : 'h3'}>Контакты продавца</Typography>

        <div className={s.wrapper}>
          <Grid container style={{ paddingTop: '2rem' }} spacing={isMobile ? 2 : 3}>
            <Grid item container xs={12} sm={6} alignItems="center">
              <Icon component={AccountIcon} />
              <Typography variant="body1" className={s.pl}>
                {sellerName}
              </Typography>
            </Grid>

            <Grid item container xs={12} sm={6} alignItems="center">
              <PhoneCallIcon phoneColor="#222222" />

              <a href={`tel:${sellerPhoneNumber}`} className={s.phoneLink}>
                <Typography variant="body1" className={s.pl} color="primary">
                  {sellerPhoneNumber}
                </Typography>
              </a>
            </Grid>

            <Grid item container xs={12} alignItems="center" style={{ flexWrap: 'nowrap' }}>
              <Icon component={LocationIcon} style={{ fill: 'none' }} />
              <Typography variant="body1" className={s.pl}>
                {address}
              </Typography>
            </Grid>
          </Grid>
        </div>

        {isAddressSet && (
          <div className={s.map}>
            <MapSection longitude={contacts!.longitude} latitude={contacts!.latitude} />
          </div>
        )}

        <div className={s.wrapper}>
          <Button
            className={s.btn}
            type="button"
            onClick={creditBookingHandler}
            variant="contained"
            size="large"
            color="primary"
            disabled={buttonDisabled}
            endIcon={buttonDisabled && <CircularProgress size="1rem" />}
          >
            <Typography variant="h5" component="span">
              Получить одобрение на кредит
            </Typography>
          </Button>
        </div>
      </div>
    </ModalLight>
  );
};
