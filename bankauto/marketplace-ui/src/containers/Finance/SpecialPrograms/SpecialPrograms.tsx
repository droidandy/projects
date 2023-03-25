import React, { FC, useRef, useCallback, useEffect } from 'react';
import { Box, ContainerWrapper, useBreakpoints } from '@marketplace/ui-kit';
import scrollIntoView from 'scroll-into-view';
import { useRouter } from 'next/router';
import { useLinks } from 'store';
import { useSpecialProgram } from 'store/finance/specialProgram';
import { Meta } from 'components';
import { KeyConditionType } from 'containers/Finance/types/KeyConditionType';
import { FinanceLayout } from 'layouts';
import { Hero, Documents, KeyConditions } from '../components';
import { DataSubmit } from './containers';
import { VehiclesBySpecialProgram } from './components';
import { useStyles } from './SpecialPrograms.styles';

const SpecialPrograms: FC = () => {
  const s = useStyles();
  const router = useRouter();
  const { data, error, initial, vehicles, loading, fetchSpecialProgram, fetchVehiclesBySpecialProgram } =
    useSpecialProgram();
  const { id, name, title, description, subTitle, advantages, imgDesktop, imgMobile, link } = data;
  const { isMobile } = useBreakpoints();
  const { items } = useLinks();
  const guideInfoRef = useRef<HTMLDivElement>(null);
  const slug = router.query.slug?.[0];

  const scrollToGuideInfo = useCallback(() => {
    if (guideInfoRef?.current) {
      scrollIntoView(guideInfoRef.current);
    }
  }, [guideInfoRef]);

  useEffect(() => {
    if (!initial && slug) {
      fetchSpecialProgram(slug);
    }
  }, [fetchSpecialProgram, initial, slug]);

  useEffect(() => {
    if (id) {
      fetchVehiclesBySpecialProgram(id);
    }
  }, [fetchVehiclesBySpecialProgram, id]);

  if ((!initial && !data) || !slug || error?.message) {
    router.push('/404');
  }

  return (
    <>
      <Meta title={title} description={description} />
      <FinanceLayout>
        <Hero
          className={s.hero}
          contentClassName={s.heroContent}
          title={name}
          subTitle={subTitle}
          buttonText="Оставить заявку"
          buttonClickHandler={scrollToGuideInfo}
          bgImage={isMobile ? imgMobile[500] : imgDesktop[1580]}
        />
        <Box my={isMobile ? '1.25rem' : '3.75rem'}>
          <KeyConditions keyConditions={advantages as unknown as KeyConditionType[]} align="center" />
        </Box>
        <ContainerWrapper>
          <VehiclesBySpecialProgram items={vehicles} loading={loading} catalogLink={link} />
        </ContainerWrapper>
        <div ref={guideInfoRef}>
          <Box mb={isMobile ? '1.25rem' : '3.75rem'} mt={isMobile ? '1.125rem' : '0'}>
            <DataSubmit slug={slug} />
          </Box>
        </div>
        {items && <Documents data={items} headerMarginBottomDesktop="3.75rem" />}
      </FinanceLayout>
    </>
  );
};

export { SpecialPrograms };
