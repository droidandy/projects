import React, { FC, useRef, useCallback, useMemo, useState } from 'react';
import scrollIntoView from 'scroll-into-view';
import { Box, Typography, ContainerWrapper, useBreakpoints } from '@marketplace/ui-kit';
import { enrichWithLeadSourceMeta } from 'helpers/cookies';
import { Meta } from 'components';
import { CustomerFlowName } from 'constants/customerFlowOptions';
import { FinanceLayout } from 'layouts';
import { useLinks } from 'store';
import { messageModalActions } from 'store/message-modal';
import { createSavingsAccount } from 'api/application/createSavingsAccount';
import { useDispatch } from 'react-redux';
import { MessageModalName } from 'types/MessageModal';
import { Hero, GuideInfo, Documents } from '../components';
import { CardBlock, FinanceCards, RateTable, DataSubmit } from './components';
import { useStyles } from './SavingsAccount.styles';
import { CARD_SPENDING, SavingsAccountRate } from './types';
import { PageInfo } from '../types/PageInfo';

const SavingsAccount: FC<{ rates?: SavingsAccountRate[]; pageInfo: PageInfo }> = ({ rates = [], pageInfo }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const { items } = useLinks();
  const guideInfoRef = useRef<HTMLDivElement>(null);
  const [cardSpending, setCardSpending] = useState(CARD_SPENDING.MORE);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const scrollToGuideInfo = useCallback(() => {
    if (guideInfoRef?.current) {
      scrollIntoView(guideInfoRef.current);
    }
  }, [guideInfoRef]);

  const submitForm = useCallback(
    (data) => {
      setLoading(true);
      createSavingsAccount(enrichWithLeadSourceMeta({ ...data, phone: `+7${data.phone}` }, Date.now()))
        .then(() => {
          setLoading(false);
          dispatch(messageModalActions.open(MessageModalName.SAVINGS_ACCOUNT_CREATED));
        })
        .catch(() => {
          setLoading(false);
        });
    },
    [dispatch],
  );

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
        <ContainerWrapper>
          <Box pt={isMobile ? '1.25rem' : '3.75rem'}>
            <Typography align="center" variant={isMobile ? 'h4' : 'h2'}>
              Начисление процентов на ежедневный фактический остаток
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" flexDirection={isMobile ? 'column' : 'row'}>
            <Box
              width={isMobile ? '100%' : '65rem'}
              pt={isMobile ? '2.5rem' : '3.75rem'}
              mr={!isMobile && '2.5rem'}
              mb={isMobile && '1.25rem'}
              flexGrow="1"
            >
              <RateTable rates={rates} cardSpending={cardSpending} setCardSpending={setCardSpending} />
            </Box>
            <Box width={isMobile ? '100%' : '31.25rem'} pt={!isMobile && '3.75rem'} flexGrow="0">
              <CardBlock
                percent={rates.length ? rates[0].higherRate - rates[0].basicRate : 1}
                buttonClickHandler={scrollToGuideInfo}
              />
            </Box>
          </Box>
        </ContainerWrapper>
        <div ref={guideInfoRef}>
          <Box mt={isMobile ? '1.25rem' : '3.75rem'}>
            <GuideInfo title="Как открыть счет" flowName={CustomerFlowName.SAVINGS_ACCOUNT_OPTIONS} />
          </Box>
          <Box mb={isMobile ? '1.25rem' : '3.75rem'} mt={isMobile ? '0' : '2.25rem'}>
            <DataSubmit loading={loading} submitForm={submitForm} />
          </Box>
        </div>
        <Documents data={items} isShowSupport={false} />
      </FinanceLayout>
    </>
  );
};

export { SavingsAccount };
