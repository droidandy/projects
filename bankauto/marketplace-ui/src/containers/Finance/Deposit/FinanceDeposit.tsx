import React, { FC, useRef, useCallback, useMemo } from 'react';
import scrollIntoView from 'scroll-into-view';
import { Box, useBreakpoints } from '@marketplace/ui-kit';
import { Meta } from 'components';
import { CustomerFlowName } from 'constants/customerFlowOptions';
import { FinanceLayout } from 'layouts';
import { useLinks } from 'store';
import { Hero, GuideInfo, Documents } from '../components';
import { FinanceCards } from './components';
import { ProfitabilityCalculator, DataSubmit } from './containers';
import { useStyles } from './FinanceDeposit.styles';
import { PageInfo } from '../types/PageInfo';

const FinanceDeposit: FC<{ pageInfo: PageInfo }> = ({ pageInfo }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const { items } = useLinks();
  const guideInfoRef = useRef<HTMLDivElement>(null);

  const scrollToGuideInfo = useCallback(() => {
    if (guideInfoRef?.current) {
      scrollIntoView(guideInfoRef.current);
    }
  }, [guideInfoRef]);

  const bgImage = useMemo(
    () => (isMobile ? pageInfo.imgMobile : pageInfo.imgDesktop),
    [isMobile, pageInfo.imgMobile, pageInfo.imgDesktop],
  );

  return (
    <>
      <Meta title={pageInfo.mainText} description={`${pageInfo.mainText} ${pageInfo.additionalText}`} />
      <FinanceLayout>
        <Hero
          className={s.hero}
          contentClassName={s.heroContent}
          title={pageInfo.mainText}
          subTitle={pageInfo.additionalText}
          buttonText={pageInfo.buttonText}
          buttonColor={pageInfo.buttonColor}
          buttonClickHandler={scrollToGuideInfo}
          bgImage={bgImage}
        />
        <FinanceCards items={pageInfo.benefits} />
        <div>
          <ProfitabilityCalculator onSubmit={scrollToGuideInfo} />
        </div>
        <div ref={guideInfoRef}>
          <Box mt="3.75rem">
            <GuideInfo title="Как открыть вклад" flowName={CustomerFlowName.DEPOSIT_FLOW_OPTIONS} />
          </Box>
          <Box mb={isMobile ? '1.25rem' : '3.75rem'} mt={isMobile ? '1.125rem' : '0'}>
            <DataSubmit />
          </Box>
        </div>
        {items && <Documents data={items} type="deposit" />}
      </FinanceLayout>
    </>
  );
};

export { FinanceDeposit };
