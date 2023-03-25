import { APPLICATION_CREDIT_STATUS } from '@marketplace/ui-kit/types';
import { Color } from 'constants/Color';
import { MainSubtitleColor } from 'components/Collapse';

type Statuses = {
  circleColor: Exclude<Color, Color.RED>;
  statusText: string;
  statusTextColor: MainSubtitleColor;
  tooltipText: string;
};

const defaultProps: Statuses = {
  circleColor: Color.GRAY,
  statusText: 'Заполнение заявки',
  statusTextColor: Color.GRAY,
  tooltipText: 'Чтобы изменить сумму или срок кредита, нужно завести новую заявку',
};

const getStatuses = (creditStatus: APPLICATION_CREDIT_STATUS): Statuses => {
  switch (creditStatus) {
    case APPLICATION_CREDIT_STATUS.DRAFT:
      return defaultProps;
    case APPLICATION_CREDIT_STATUS.CALCULATED:
      return {
        ...defaultProps,
        circleColor: Color.YELLOW,
        statusText: 'В обработке',
        statusTextColor: Color.GRAY,
        tooltipText: '',
      };
    case APPLICATION_CREDIT_STATUS.APPROVED:
      return {
        ...defaultProps,
        circleColor: Color.GREEN,
        statusText: 'Одобрен',
        statusTextColor: Color.GREEN,
        tooltipText: '',
      };
    case APPLICATION_CREDIT_STATUS.REFUSE:
      return {
        ...defaultProps,
        statusText: 'Заявка отклонена',
        tooltipText: '',
      };
    case APPLICATION_CREDIT_STATUS.SUCCESS:
      return {
        ...defaultProps,
        circleColor: Color.GREEN,
        statusText: 'Выдан',
        statusTextColor: Color.GREEN,
        tooltipText: '',
      };
    case APPLICATION_CREDIT_STATUS.EXPIRED:
      return {
        ...defaultProps,
        statusText: 'Заявка просрочена',
        tooltipText: '',
      };
    default:
      return defaultProps;
  }
};

export { getStatuses };
