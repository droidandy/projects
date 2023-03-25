import { useMemo } from 'react';
import { APPLICATION_CREDIT_STATUS, APPLICATION_SIMPLE_CREDIT_STEP } from '@marketplace/ui-kit/types';

export const useCreditChipsData = (status: APPLICATION_CREDIT_STATUS, lastSentStep?: APPLICATION_SIMPLE_CREDIT_STEP) =>
  useMemo(() => {
    switch (status) {
      case APPLICATION_CREDIT_STATUS.CREATED:
      case APPLICATION_CREDIT_STATUS.DRAFT: {
        return [{ text: 'Заполнение заявки', bgcolor: 'primary.main' }];
      }
      case APPLICATION_CREDIT_STATUS.FROZEN:
        if (lastSentStep !== APPLICATION_SIMPLE_CREDIT_STEP.EMPLOYMENT) {
          return [{ text: 'Заполнение заявки', bgcolor: 'primary.main' }];
        }
        return [{ text: 'В обработке', bgcolor: 'warning.main' }];
      case APPLICATION_CREDIT_STATUS.CALCULATED: {
        return [{ text: 'В обработке', bgcolor: 'warning.main' }];
      }
      case APPLICATION_CREDIT_STATUS.APPROVED: {
        return [{ text: 'Одобрен', bgcolor: 'success.main' }];
      }
      case APPLICATION_CREDIT_STATUS.REFUSE: {
        return [{ text: 'Отказ банка', bgcolor: 'primary.main' }];
      }
      case APPLICATION_CREDIT_STATUS.CANCEL: {
        return [{ text: 'Заявка отменена', bgcolor: 'primary.main' }];
      }
      case APPLICATION_CREDIT_STATUS.SUCCESS: {
        return [{ text: 'Выдан', bgcolor: 'success.main' }];
      }
      case APPLICATION_CREDIT_STATUS.EXPIRED: {
        return [{ text: 'Заявка просрочена', bgcolor: 'primary.main' }];
      }
      default: {
        return [{ text: 'Отказ банка', bgcolor: 'primary.main' }];
      }
    }
  }, [status, lastSentStep]);
