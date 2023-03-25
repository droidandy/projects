import React, { memo, FC } from 'react';

import { ContainerWrapper, Grid, useBreakpoints, ItemsCarousel } from '@marketplace/ui-kit';
import isEqual from 'lodash/isEqual';
import cx from 'classnames';
import { CustomerFlowOptions } from 'types/CustomerFlowOptions';
import { CUSTOMER_FLOW_MAP, CustomerFlowName } from 'constants/customerFlowOptions';

import { ReactIdSwiperCustomProps, ReactIdSwiperProps } from 'react-id-swiper/lib/types';
import { breakpoints as breakpointsTheme } from 'theme/breakpoints';
import { StaticCustomerFlowHow } from '../StaticCustomerFlowHow';
import { StaticCustomerFlowItem } from '../StaticCustomerFlowItem';
import { StaticCustomerFlowMobileItem } from '../StaticCustomerFlowMobileItem';

import { useStyles } from './StaticCustomerFlow.styles';

interface Props {
  customerFlow: CustomerFlowOptions[];
  breakpoints?: { [key: string]: number };
  isShortOptionsList?: boolean;
  sectionHow?: { [key: string]: string };
  shadow?: boolean;
  containerWithoutPadding?: boolean;
  grayInMobile?: boolean;
  customSwiperParams?: ReactIdSwiperProps | ReactIdSwiperCustomProps;
}

const StaticCustomerFlowRoot: FC<Props> = ({
  customerFlow,
  breakpoints,
  isShortOptionsList,
  sectionHow,
  shadow = true,
  containerWithoutPadding = false,
  grayInMobile = false,
  customSwiperParams,
}: Props) => {
  const classes = useStyles();
  const { isMobile } = useBreakpoints();
  const optionsLength = customerFlow.length - 1;

  return (
    <>
      {sectionHow ? <StaticCustomerFlowHow sectionHow={sectionHow} /> : <></>}
      <ContainerWrapper
        className={cx(classes.container, {
          [classes.containerWithoutPadding]: containerWithoutPadding,
          [classes.withSubTitle]: Boolean(customerFlow[0].subtitle),
        })}
      >
        {isMobile ? (
          <ItemsCarousel customSwiperParams={customSwiperParams}>
            {customerFlow.map((customer) => (
              <StaticCustomerFlowMobileItem key={customer.id} item={customer} grayInMobile={grayInMobile} />
            ))}
          </ItemsCarousel>
        ) : (
          <Grid
            container
            className={cx(classes.flowRoot, isShortOptionsList && classes.shortList, { [classes.shadow]: shadow })}
          >
            {customerFlow.map((customer, index) => (
              <Grid
                container
                item
                {...breakpoints}
                spacing={2}
                justify="center"
                key={customer.id}
                style={{ position: 'relative' }}
                className={classes.flowItemRoot}
              >
                <StaticCustomerFlowItem
                  key={customer.id}
                  item={customer}
                  isLastItem={isEqual(index, optionsLength)}
                  isShortOptionsList={isShortOptionsList}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </ContainerWrapper>
    </>
  );
};

const StaticCustomerFlow = memo(StaticCustomerFlowRoot);

const PurchaseFlow: FC = () => {
  const { options, breakpoints, isShortOptionsList, sectionHow } =
    CUSTOMER_FLOW_MAP[CustomerFlowName.PURCHASE_FLOW_OPTIONS];
  return (
    <StaticCustomerFlow
      customerFlow={options}
      breakpoints={breakpoints}
      isShortOptionsList={isShortOptionsList}
      sectionHow={sectionHow}
    />
  );
};

const CreditFlow: FC = () => {
  const { options, breakpoints, isShortOptionsList, sectionHow } =
    CUSTOMER_FLOW_MAP[CustomerFlowName.CREDIT_FLOW_OPTIONS];
  return (
    <StaticCustomerFlow
      customerFlow={options}
      breakpoints={breakpoints}
      isShortOptionsList={isShortOptionsList}
      sectionHow={sectionHow}
    />
  );
};

const InsuranceFlow: FC = () => {
  const { options, breakpoints, isShortOptionsList, sectionHow } =
    CUSTOMER_FLOW_MAP[CustomerFlowName.INSURANCE_FLOW_OPTIONS];
  return (
    <StaticCustomerFlow
      customerFlow={options}
      breakpoints={breakpoints}
      isShortOptionsList={isShortOptionsList}
      sectionHow={sectionHow}
    />
  );
};

const SellFlow: FC = () => {
  const { options, breakpoints, isShortOptionsList, sectionHow } =
    CUSTOMER_FLOW_MAP[CustomerFlowName.SELL_FLOW_OPTIONS];
  return (
    <StaticCustomerFlow
      customerFlow={options}
      breakpoints={breakpoints}
      isShortOptionsList={isShortOptionsList}
      sectionHow={sectionHow}
    />
  );
};

const GuideInfoFlow: FC<{ flowName: CustomerFlowName }> = ({ flowName }) => {
  const { options: customerFlow, breakpoints, isShortOptionsList } = CUSTOMER_FLOW_MAP[flowName];
  const customSwiperParams: ReactIdSwiperProps = {
    loop: false,
    pagination: false,
    breakpoints: {
      [breakpointsTheme.values.xs]: {
        slidesPerView: 1.1,
        centeredSlides: false,
      },
      [breakpointsTheme.values.sm]: {
        slidesPerView: 1.1,
        centeredSlides: false,
      },
    },
  };
  return (
    <StaticCustomerFlow
      customerFlow={customerFlow}
      breakpoints={breakpoints}
      isShortOptionsList={isShortOptionsList}
      shadow={false}
      containerWithoutPadding
      grayInMobile
      customSwiperParams={customSwiperParams}
    />
  );
};

export { StaticCustomerFlow, PurchaseFlow, CreditFlow, InsuranceFlow, SellFlow, GuideInfoFlow };
