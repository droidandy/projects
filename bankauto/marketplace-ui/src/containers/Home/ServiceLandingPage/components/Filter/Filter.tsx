import React from 'react';
import { Grid } from '@marketplace/ui-kit';
import { CoreInput } from 'components/Input/Input';
import { useStyles } from './Filter.styles';
import { BaseButton, Item } from '../Button';

type FilterProps = {
  limit?: number;
  data?: any;
  onChange: any;
  placeholder?: string;
  label?: string;
};

export const Filter = React.memo(
  ({ limit = 41, data = [], onChange, placeholder = 'Марка автомобиля', label = 'Все марки' }: FilterProps) => {
    const s = useStyles();
    const [isAll, setAll] = React.useState(false);
    const [filter, setFilter] = React.useState('');
    const items = (isAll || filter ? data : data.slice(0, limit)).filter((i: any) =>
      (i.name || '').toLowerCase().includes(filter.toLowerCase()),
    );
    const showAll = !(isAll || filter);

    return (
      <>
        <Grid container direction="column" spacing={1} wrap="nowrap">
          <Grid item>
            <CoreInput
              className={s.control}
              name="filter"
              area="filter"
              placeholder={placeholder}
              variant="outlined"
              value={filter}
              handleChange={(e) => {
                setFilter(e.target.value);
              }}
            />
          </Grid>
        </Grid>
        <Grid className={s.items} container>
          {items.map((data: any) => (
            <Grid item xs={6} sm={4} md={3}>
              <Item
                label={data.name || data}
                startIcon={data.image ? <img className={s.icon} src={data.image} alt={data.name} /> : undefined}
                onClick={() => onChange(data)}
              />
            </Grid>
          ))}
          {showAll && (
            <Grid item xs={6} sm={4} md={3}>
              <BaseButton label={label} onClick={() => setAll(true)} />
            </Grid>
          )}
        </Grid>
      </>
    );
  },
);
