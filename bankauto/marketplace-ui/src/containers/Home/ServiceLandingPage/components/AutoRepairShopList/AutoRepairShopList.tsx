import React, { FC } from 'react';
import { Divider } from '@material-ui/core';
import { CoreInput } from 'components/Input/Input';
import { AutoRepairShop as AutoRepairShopType } from '../AutoRepairShop/types';
import { AutoRepairShop } from '../AutoRepairShop/AutoRepairShop';
import { useStyles } from './AutoRepairShopList.styles';

interface Props {
  items?: AutoRepairShopType[];
  onPress?: (serviceId: number) => void;
  disabled?: boolean;
  isLoading: boolean;
}

export const AutoRepairShopList: FC<Props> = ({ isLoading, items = [], disabled, onPress }) => {
  const s = useStyles();
  const [filter, setFilter] = React.useState('');
  const data = items.filter((i: any) => (i.name || '').toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className={s.root}>
      <CoreInput
        className={s.fx}
        name="filter"
        area="filter"
        placeholder="Поиск по названию"
        variant="outlined"
        value={filter}
        handleChange={(e) => {
          setFilter(e.target.value);
        }}
      />
      {!isLoading && data.length === 0 && <p className={s.label}>Поиск не дал результатов</p>}
      {data.map((autoRepairShop, idx) => (
        <div key={autoRepairShop.id} className={s.item}>
          <div className={s.container}>
            <AutoRepairShop onPress={onPress} item={autoRepairShop} disabled={disabled} />
          </div>
          {idx !== data.length - 1 && <Divider />}
        </div>
      ))}
    </div>
  );
};
