import { NectarinEventsMap, pushNectarinAnalytics } from '../nectarin';

export const analyticsAuthFormReSendSms = () => {
  pushNectarinAnalytics(NectarinEventsMap.bankauto_media_2_1);
};
