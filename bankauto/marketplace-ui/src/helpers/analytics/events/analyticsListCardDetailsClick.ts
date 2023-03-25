// excludes installment vehicles listings!

import { NectarinEventsMap, pushNectarinAnalytics } from '../nectarin';

export const analyticsListCardDetailsClick = ({ isBankautoDealer }: { isBankautoDealer: boolean }) => {
  pushNectarinAnalytics(isBankautoDealer ? NectarinEventsMap.bankauto_media_4 : NectarinEventsMap.bankauto_media_3);
};
