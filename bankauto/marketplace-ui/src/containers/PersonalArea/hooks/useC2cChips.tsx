import { useMemo } from 'react';
import { APPLICATION_CREDIT_STATUS } from '@marketplace/ui-kit/types';

const useC2cChips = (status: APPLICATION_CREDIT_STATUS) =>
  useMemo(() => {
    switch (status) {
      case APPLICATION_CREDIT_STATUS.CREATED:
        return [{ text: 'Создана', bgcolor: 'primary.main' }];
      case APPLICATION_CREDIT_STATUS.DRAFT:
        return [{ text: 'Заполнение', bgcolor: 'primary.main' }];
      case APPLICATION_CREDIT_STATUS.FROZEN:
      case APPLICATION_CREDIT_STATUS.CALCULATED:
        return [{ text: 'В обработке', bgcolor: 'primary.main' }];
      case APPLICATION_CREDIT_STATUS.APPROVED:
        return [{ text: 'Одобрена', bgcolor: 'success.main' }];
      case APPLICATION_CREDIT_STATUS.REFUSE:
        return [{ text: 'Отклонена', bgcolor: 'primary.main' }];
      case APPLICATION_CREDIT_STATUS.SUCCESS:
        return [{ text: 'Кредит выдан', bgcolor: 'success.main' }];
      case APPLICATION_CREDIT_STATUS.EXPIRED:
        return [{ text: 'Просрочена', bgcolor: 'primary.main' }];
      default:
        return [];
    }
  }, [status]);

export { useC2cChips };
