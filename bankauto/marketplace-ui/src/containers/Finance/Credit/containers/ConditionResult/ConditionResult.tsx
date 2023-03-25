import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ContainerWrapper, useBreakpoints } from '@marketplace/ui-kit';
import { CustomerFlowName } from 'constants/customerFlowOptions';
import { GuideInfo } from 'containers/Finance/components';
import { useLinks } from 'store';
import { Condition } from '../../types/Condition';
import { SimpleCreditWrapper, VehicleCreditWrapper } from '..';

interface Props {
  lastCondition: Condition | null;
}

const ConditionResult: FC<Props> = ({ lastCondition }) => {
  const { isMobile } = useBreakpoints();
  const [calculatorDisabled, setCalculatorDisabled] = useState(false);
  const { items } = useLinks();
  const calculatorStartPosition = useRef<HTMLDivElement | null>(null);
  const disableCalculator = useCallback((isDisabled: boolean = true) => setCalculatorDisabled(isDisabled), []);

  const getGuideInfo = useMemo(() => {
    let flowName = null;
    if (lastCondition === Condition.JUST_MONEY) {
      flowName = CustomerFlowName.FINANCE_STANDALONE_CREDIT;
    }
    if (lastCondition === Condition.AUTHORIZED_DEALER) {
      flowName = CustomerFlowName.FINANCE_STANDALONE_AUTO_CREDIT;
    }
    if (lastCondition === Condition.C2C) {
      flowName = CustomerFlowName.FINANCE_CREDIT_C2C_SAFE_DEAL;
    }
    return flowName && <GuideInfo flowName={flowName} />;
  }, [lastCondition]);

  useEffect(() => {
    calculatorStartPosition.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [lastCondition]);

  return (
    <ContainerWrapper>
      <div ref={calculatorStartPosition} style={{ position: 'relative', top: isMobile ? '-17.5rem' : '-21.5rem' }} />
      {/* Просто деньги */}
      {lastCondition === Condition.JUST_MONEY && (
        <SimpleCreditWrapper
          lastCondition={lastCondition}
          getGuideInfo={getGuideInfo}
          calculatorDisabled={calculatorDisabled}
          disableCalculator={disableCalculator}
          linkItems={items}
        />
      )}

      {/* Покупка автомобиля */}
      {!!lastCondition && lastCondition === Condition.BUYING_CAR && (
        <SimpleCreditWrapper
          lastCondition={lastCondition}
          getGuideInfo={getGuideInfo}
          calculatorDisabled={calculatorDisabled}
          disableCalculator={disableCalculator}
          linkItems={items}
        />
      )}

      {/*/!* У дилера *!/*/}
      {/*{!!lastCondition && lastCondition === Condition.AUTHORIZED_DEALER && (*/}
      {/*  <SimpleCreditWrapper*/}
      {/*    lastCondition={lastCondition}*/}
      {/*    getGuideInfo={getGuideInfo}*/}
      {/*    calculatorDisabled={calculatorDisabled}*/}
      {/*    disableCalculator={disableCalculator}*/}
      {/*    linkItems={items}*/}
      {/*  />*/}
      {/*)}*/}

      {/*/!* У частного лица C2C *!/*/}
      {/*{lastCondition === Condition.C2C && (*/}
      {/*  <VehicleCreditWrapper*/}
      {/*    lastCondition={lastCondition}*/}
      {/*    getGuideInfo={getGuideInfo}*/}
      {/*    calculatorDisabled={calculatorDisabled}*/}
      {/*    disableCalculator={disableCalculator}*/}
      {/*    linkItems={items}*/}
      {/*  />*/}
      {/*)}*/}
    </ContainerWrapper>
  );
};

export { ConditionResult };
