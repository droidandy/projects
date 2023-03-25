import { PUBLICATION_CANCEL_REASON } from '@marketplace/ui-kit/types';

export const cancelReasons = [
  { label: 'Продал автомобиль на #банкавто', value: PUBLICATION_CANCEL_REASON.C2C_BANKAUTO },
  { label: 'Продал в другом месте', value: PUBLICATION_CANCEL_REASON.C2C_ANOTHER_PLACE },
  { label: 'Передумал продавать', value: PUBLICATION_CANCEL_REASON.C2C_ABORT_SELL },
];
