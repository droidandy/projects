import React from 'react';
import { ReportsPageActions, getReportsPageState } from '../interface';
import { useActions } from 'typeless';
import { Filter } from 'src/components/Filter';
import { Input } from 'src/components/FormInput';
import { Select } from 'src/components/Select';
import { getSelectOption } from 'src/common/utils';
import { useTranslation } from 'react-i18next';
import { ReportsPageOptions } from 'src/common/options';

export function ReportsPageFilter() {
  const { t } = useTranslation();
  const { isFilterOpened, filter } = getReportsPageState.useState();
  const { updateFilter, applyFilter, clearFilter, toggleFilter } = useActions(
    ReportsPageActions
  );

  return (
    <Filter
      isFilterOpened={isFilterOpened}
      applyFilter={applyFilter}
      clearFilter={clearFilter}
      toggleFilter={toggleFilter}
      fields={[
        {
          label: 'Name',
          control: (
            <>
              <Input
                placeholder={t('Search')}
                value={filter.name}
                onChange={e => updateFilter('name', e.target.value)}
              />
            </>
          ),
        },
        {
          label: 'Type',
          control: (
            <Select
              placeholder={t('Select Type')}
              options={ReportsPageOptions}
              value={getSelectOption(ReportsPageOptions, true)}
              onChange={value => updateFilter('type', value)}
            />
          ),
        },
      ]}
    />
  );
}
