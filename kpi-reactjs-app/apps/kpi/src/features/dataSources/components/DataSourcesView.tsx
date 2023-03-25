import React from 'react';
import { RouteCard } from '../../../components/RouteCard';
import { RouteCardWrapper } from '../../../components/RouteCardWrapper';
import { useLanguage } from 'src/hooks/useLanguage';
import { getGlobalState } from 'src/features/global/interface';
import { BalancedScorecardItemType } from 'src/types-next';

export const DataSourcesView = () => {
  const lang = useLanguage();
  const { lookups } = getGlobalState();

  return (
    <div>
      <RouteCardWrapper>
        {lookups
          .filter(x => x.category === 'BalancedScorecardItemType')
          .map(item => (
            <RouteCard
              key={item.id}
              text={item[lang as 'en' | 'ar']}
              url={`/settings/strategy-items/${
                BalancedScorecardItemType[item.id]
              }`}
            />
          ))}
      </RouteCardWrapper>
    </div>
  );
};
