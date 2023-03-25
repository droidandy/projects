import { useBreakpoints } from '@marketplace/ui-kit';
import React, { FC, useMemo } from 'react';
import { useStyles } from './PolicyItem.styles';
import { Insurance } from '@marketplace/ui-kit/types';
import { format, parse } from 'date-fns';
import { capitalizeInputValueWC } from 'helpers';
import { PolicyItemDesktop, PolicyItemMobile } from './components';

const chips = [{ text: 'Оплачено', bgcolor: 'success.main' }];

interface Props {
  item: Insurance;
}

const PolicyItem: FC<Props> = ({ item }) => {
  const { isMobile } = useBreakpoints();
  const policy = item.policies[0];

  const period = useMemo(() => {
    const start = format(parse(policy.startDate, 'yyyy-MM-dd', new Date()), 'dd.MM.yyyy');
    const finish = format(parse(policy.finishDate, 'yyyy-MM-dd', new Date()), 'dd.MM.yyyy');
    return `с ${start} по ${finish}`;
  }, []);

  const fullName = useMemo(() => {
    const name = capitalizeInputValueWC(item.owner.name);
    const surname = capitalizeInputValueWC(item.owner.surname);
    const patronymic = capitalizeInputValueWC(item.owner.patronymic);
    return `${name} ${patronymic} ${surname}`;
  }, []);

  const s = useStyles();
  return (
    <div className={s.wrapper}>
      {isMobile ? (
        <PolicyItemMobile item={item} chips={chips} fullName={fullName} period={period} />
      ) : (
        <PolicyItemDesktop item={item} chips={chips} fullName={fullName} period={period} />
      )}
    </div>
  );
};

export { PolicyItem };
