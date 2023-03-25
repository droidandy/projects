import React, { FC, memo, useMemo, useState } from 'react';
import { HomeTab } from 'types/Home';
import { useHomeState } from 'store/home';
import { IS_STOCK, IS_INSTALLMENT_SPECIAL_PROGRAM, IS_CASHBACK_PROMO } from 'constants/specialConstants';
import { HeroTitleWithButton, HeroTitle, HeroWrapper } from './components';
import { MAP_TAB_INDEX, SECTIONS } from './constants';
import { useHeroTitle } from './hooks';

export const HeroNew: FC = memo(() => {
  const { activeTab } = useHomeState();
  const [activeTabIndex] = useState(MAP_TAB_INDEX[activeTab || 'buy']);

  const { title, subtitle, name, id, ...rest } = SECTIONS[activeTabIndex];
  const prepareTitle = useHeroTitle(title, activeTab);
  const titleJsx = useMemo(() => {
    const HeroTitleComponent =
      (IS_INSTALLMENT_SPECIAL_PROGRAM && activeTab === HomeTab.INSTALLMENT) ||
      ((IS_STOCK || IS_CASHBACK_PROMO) && !activeTabIndex)
        ? HeroTitleWithButton
        : HeroTitle;
    return (
      <HeroTitleComponent
        title={prepareTitle}
        subtitle={subtitle}
        styles={activeTab === HomeTab.INSTALLMENT ? { whiteSpace: 'pre-wrap' } : {}}
        btnText={activeTab === HomeTab.INSTALLMENT ? 'Посмотреть' : 'Подробнее'}
        href={
          activeTab === HomeTab.INSTALLMENT
            ? '/installment/vehicles/new/?brand=82&model=1523&installmentMonths=24'
            : '/promo'
        }
      />
    );
  }, [activeTab, activeTabIndex, prepareTitle, subtitle]);

  return <HeroWrapper title={titleJsx} alt={prepareTitle} activeTab={activeTabIndex} {...rest} />;
});
