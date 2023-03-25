import { Condition, ConditionData } from '../types/Condition';
import { ReactComponent as IconJustMoney } from '../icons/IconJustMoney.svg';
import { ReactComponent as IconJustMoneyActive } from '../icons/IconJustMoneyActive.svg';
import { ReactComponent as IconAuthorizedDealer } from '../icons/IconAuthorizedDealer.svg';
import { ReactComponent as IconAuthorizedDealerActive } from '../icons/IconAuthorizedDealerActive.svg';
import { ReactComponent as IconCar } from '../icons/IconCar.svg';
import { ReactComponent as IconCarActive } from '../icons/IconCarActive.svg';
import { ReactComponent as IconC2C } from '../icons/IconC2C.svg';
import { ReactComponent as IconC2CActive } from '../icons/IconC2CActive.svg';

export const conditionsData: Record<Condition, ConditionData> = {
  [Condition.BUYING_CAR]: {
    name: 'Покупка автомобиля',
    type: Condition.BUYING_CAR,
    Icon: IconCar,
    IconActive: IconCarActive,
  },
  [Condition.JUST_MONEY]: {
    name: 'Просто деньги',
    type: Condition.JUST_MONEY,
    Icon: IconJustMoney,
    IconActive: IconJustMoneyActive,
  },
  [Condition.AUTHORIZED_DEALER]: {
    name: 'У дилера',
    type: Condition.AUTHORIZED_DEALER,
    Icon: IconAuthorizedDealer,
    IconActive: IconAuthorizedDealerActive,
  },
  [Condition.C2C]: {
    name: 'У частного лица',
    type: Condition.C2C,
    Icon: IconC2C,
    IconActive: IconC2CActive,
  },
};

export const CONDITION_ANALYTICS_MAP: Record<number, string> = {
  [Condition.JUST_MONEY]: 'money',
  [Condition.AUTHORIZED_DEALER]: 'oldautodealer',
  [Condition.C2C]: 'oldautochastnik',
};
