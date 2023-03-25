import { Application } from '@marketplace/ui-kit/types';
import { NectarinEventsMap, pushNectarinAnalytics } from '../nectarin';
import { pushAnalyticsEvent } from '../pushAnalyticsEvent';
import { pushCriteoAnalyticsEvent } from '../pushCriteoAnalyticsEvent';
import { pushToDataLayerRuTarget } from '../ruTarget';

export const fireBookingAnalytics = (application: Application & { withCredit?: boolean; withTradeIn?: boolean }) => {
  const { customerUuid, uuid, withTradeIn, withCredit } = application;
  const status = application.vehicle?.status;
  if (status === 'booked') {
    pushAnalyticsEvent({
      event: 'emersionEvent_booking',
      user_id: customerUuid,
      userAuth: 1,
      eventCategory: 'Бронь',
      eventAction: 'Подтверждение',
      eventLabel: uuid,
    });
    pushCriteoAnalyticsEvent({
      rtrgAction: 'init_checkout',
      rtrgData: {
        products: [
          {
            id: application.vehicle?.vehicleId,
            price: application.vehicle?.price,
          },
        ],
      },
    });
    pushToDataLayerRuTarget({ event: 'thankYou', conv_id: 'booking_button' });
    switch (true) {
      case withCredit && withTradeIn:
        pushNectarinAnalytics(NectarinEventsMap.bankauto_media_5_3);
        break;
      case withCredit:
        pushNectarinAnalytics(NectarinEventsMap.bankauto_media_5_2);
        break;
      case withTradeIn:
        pushNectarinAnalytics(NectarinEventsMap.bankauto_media_5_1);
        break;
      case !(withCredit || withTradeIn):
        pushNectarinAnalytics(NectarinEventsMap.bankauto_media_5_4);
        break;

      default:
        break;
    }
  }
};

export const fireInstallmentBookingAnalytics = (application: Application) => {
  const { customerUuid } = application;
  const status = application.vehicle?.status;
  if (status === 'booked') {
    pushAnalyticsEvent({
      event: 'installment_reserve',
      user_id: customerUuid,
      userAuth: 1,
      eventCategory: 'Бронирование',
      eventAction: 'Рассрочка',
      eventLabel: customerUuid, // по ТЗ требуется user_id, не uuid
    });
    pushCriteoAnalyticsEvent({
      rtrgAction: 'init_checkout',
      rtrgData: {
        products: [
          {
            id: application.vehicle?.vehicleId,
            price: application.vehicle?.price,
          },
        ],
      },
    });

    pushNectarinAnalytics(NectarinEventsMap.bankauto_media_7);
  }
};

export const fireSendToDealerAnalytics = (application: {
  uuid: string;
  userId: string;
  vehicleId: number;
  price: number;
}) => {
  const { userId, uuid, vehicleId, price } = application;
  pushAnalyticsEvent({
    event: 'emersionEvent_deal_req',
    user_id: userId,
    userAuth: 1,
    eventCategory: 'Заявка в дилерский центр',
    eventAction: 'Успешная отправка',
    eventLabel: uuid,
  });
  pushCriteoAnalyticsEvent({
    rtrgAction: 'transaction',
    rtrgData: {
      transaction_id: uuid,
      products: [
        {
          id: vehicleId,
          price,
        },
      ],
    },
  });
  pushToDataLayerRuTarget({ event: 'thankYou', conv_id: 'booking_sendform' });
};

const checkIsApplicationSentToDealer = (applicationStatus: string) => {
  switch (applicationStatus) {
    case 'frozen':
    case 'meeting':
    case 'delivery':
      return true;
    default:
      return false;
  }
};

export const fireBookingCancelAnalytics = ({
  uuid,
  userId,
  applicationStatus,
}: {
  uuid: string;
  userId: string;
  applicationStatus: string;
}) => {
  const isSentToDealer = checkIsApplicationSentToDealer(applicationStatus);
  pushAnalyticsEvent({
    event: isSentToDealer ? 'emersionEvent_unbooking_req' : 'emersionEvent_unbooking',
    user_id: userId,
    userAuth: 1,
    eventCategory: isSentToDealer ? 'Отмена заявки' : 'Отмена брони',
    eventAction: 'Подтверждение',
    eventLabel: uuid,
  });
};

export const fireExpressApplicationAnalytics = ({
  userId,
  withCredit,
  withTradeIn,
}: {
  userId?: string;
  withCredit?: boolean;
  withTradeIn?: boolean;
}) => {
  pushAnalyticsEvent({
    event: 'GetBestOffer_FormSent',
    user_id: userId || null,
    userAuth: userId ? 1 : 0,
  });

  switch (true) {
    case withCredit && withTradeIn:
      pushNectarinAnalytics(NectarinEventsMap.bankauto_media_6_3);
      break;
    case withCredit:
      pushNectarinAnalytics(NectarinEventsMap.bankauto_media_6_2);
      break;
    case withTradeIn:
      pushNectarinAnalytics(NectarinEventsMap.bankauto_media_6_1);
      break;
    case !(withCredit || withTradeIn):
      pushNectarinAnalytics(NectarinEventsMap.bankauto_media_6_4);
      break;

    default:
      break;
  }
};
