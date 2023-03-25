import React, { FC, useCallback, useMemo, useRef, FormEvent, useState } from 'react';
import { Box, useBreakpoints } from '@marketplace/ui-kit';
import { useRouter } from 'next/router';
import { Meta } from 'components';
import { CustomerFlowName } from 'constants/customerFlowOptions';
import { FinanceLayout } from 'layouts';
import { useLinks } from 'store';
import { useDebitCards } from 'store/finance/debitCards';
import scrollIntoView from 'scroll-into-view';
import { usePageContext } from 'helpers';
import { TabsWrapper } from 'components';
import { Hero, GuideInfo, Documents, KeyConditions as CardKeyConditions } from '../../components';
import { CardFullConditions, CardMainInfo, BreadcrumbsDebitCard, Promo } from './components';
import { DataSubmit } from '../containers';
import { DebitCardMetaMap, DebitCardRoutes } from '../types';
import { CardConditions } from '../components/CardConditions';
import { Tariffs } from './components/Tariffs';
import { useStyles } from './FinanceDebitCard.styles';

const FinanceDebitCard: FC = () => {
  const { isMobile } = useBreakpoints();
  const { items } = useLinks();
  const { canonical, isCanonical } = usePageContext();
  const { query } = useRouter();
  const s = useStyles();

  const { item } = useDebitCards();
  const {
    isPromo,
    title,
    shortDescription,
    tags,
    img,
    paymentSystems,
    keyConditions,
    fullConditions,
    banners,
    tariffs,
  } = item!;

  const guideInfoRef = useRef<HTMLDivElement>(null);

  const scrollToGuideInfo = useCallback(() => {
    if (guideInfoRef?.current) {
      scrollIntoView(guideInfoRef.current);
    }
  }, [guideInfoRef]);

  const meta = useMemo(() => {
    const { debitCardName } = query;
    if (!debitCardName) {
      return {
        title: 'Подберите нужную вам карту',
        subTitle: 'Получите выгодное предложение',
      };
    }
    return DebitCardMetaMap[debitCardName as DebitCardRoutes];
  }, [query]);

  const [activeTab, setActiveTab] = useState(0);
  const bgImage = useMemo(
    () =>
      isMobile
        ? '/images/mobile/heroImageFinanceDebitDoroznayaMobile.jpg'
        : '/images/desktop/heroImageFinanceDebitDoroznaya.jpg',
    [isMobile],
  );

  return (
    <>
      <Meta title={meta.title} description={meta.subTitle} canonical={!isCanonical ? canonical : undefined} />
      <FinanceLayout>
        <Hero
          title="Дорожная карта"
          buttonText="Заказать карту"
          subTitle="Карта с повышенным кешбэком для автомобилистов"
          bgImage={bgImage}
          className={s.hero}
          contentClassName={s.heroContent}
          buttonClickHandler={scrollToGuideInfo}
          isShowButton
        />

        <Box position="relative" mt={isMobile ? '1.25rem' : '-6rem'} mb={isMobile ? '0' : '1rem'}>
          <CardConditions conditions={keyConditions} align="center" />
        </Box>

        <Box className={s.tabsWrapperRoot}>
          <TabsWrapper
            colorScheme="blackRed"
            centered={!isMobile}
            tabs={['О карте', 'Тарифы и условия']}
            value={activeTab}
            handleChange={(event, tabindex) => {
              event.preventDefault();
              setActiveTab(tabindex);
            }}
          />
        </Box>

        {banners && activeTab === 0 && (
          <Box mt={isMobile ? '0' : '1.44rem'}>
            <Promo banners={banners} buttonClickHandler={scrollToGuideInfo} />
          </Box>
        )}

        {activeTab === 1 && tariffs && (
          <Box mt={isMobile ? '0' : '0.5rem'} p={isMobile ? '1.25rem' : '0'}>
            <Tariffs items={tariffs} />
          </Box>
        )}

        {activeTab === 1 && fullConditions && !tariffs && (
          <Box mt={isMobile ? '1.875rem' : '3.75rem'}>
            <CardFullConditions fullConditions={fullConditions} />
          </Box>
        )}

        <Box mt={isMobile ? '1.25rem' : '3.75rem'}>
          <GuideInfo title="Оформить карту очень просто" flowName={CustomerFlowName.DEBIT_CARD_HOW_GET_CARD} />
        </Box>

        <Box mt={isMobile ? '0' : '2.5rem'}>
          <div ref={guideInfoRef}>
            <Box mb={isMobile ? '1.25rem' : '3.75rem'}>
              <DataSubmit
                title="Закажите карту РГС Банка"
                subtitle="Заполните заявку и наши специалисты свяжутся с вами"
              />
            </Box>
          </div>
        </Box>
        {items && <Documents type="cards" data={items} isShowSupport={false} />}
      </FinanceLayout>
    </>
  );
};

export { FinanceDebitCard };
