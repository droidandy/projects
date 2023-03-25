import { IS_STOCK, IS_CASHBACK_PROMO } from 'constants/specialConstants';
import { AdsCardPromoProps } from 'containers/Vehicles/components/AdsCard/AdsCardPromo';

export const getPromoCardData = (isMobile: boolean) => {
  let promoData: AdsCardPromoProps | null = null;
  if (IS_STOCK) {
    promoData = {
      title: 'Бак бензина в подарок',
      subtitle: 'При покупке автомобиля на #банкавто',
      imageSrc: isMobile ? '/images/adsFuel/adsImageMobile.png' : '/images/adsFuel/adsBackgroundDesktop.jpg',
      link: '/promo',
      typographyTheme: 'dark',
    };
  }
  if (IS_CASHBACK_PROMO) {
    promoData = {
      title: 'Кешбэк на ОСАГО',
      subtitle: 'При покупке автомобиля на #банкавто',
      imageSrc: isMobile
        ? '/images/cashbackPromo/cashbackPromoMobileImage.jpg'
        : '/images/cashbackPromo/cashbackPromoDesktopImage.jpg',
      link: '/promo',
      typographyTheme: 'light',
    };
  }
  return promoData;
};
