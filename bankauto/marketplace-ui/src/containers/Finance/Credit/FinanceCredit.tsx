import React, { FC, useMemo, useState } from 'react';
import isNumber from 'lodash/isNumber';
import { useRouter } from 'next/router';
import { useBreakpoints } from '@marketplace/ui-kit';
import { Meta } from 'components';
import { FinanceLayout } from 'layouts';
import { ConditionTree as IConditionTree, ConditionBranchName, CreditRoutes } from './types/Condition';
import { Hero } from '../components';
import { ConditionTree } from './components';
import { ConditionResult } from './containers';
import { useStyles } from './FinanceCredit.styles';
import { PageInfo } from '../types/PageInfo';

const FinanceCredit: FC<{ pageInfo: PageInfo }> = ({ pageInfo }) => {
  const initialConditionTree: IConditionTree = {
    [ConditionBranchName.FIRST_BRANCH]: null,
    [ConditionBranchName.SECOND_BRANCH]: null,
  };
  const [conditionTree, setConditionTree] = useState<IConditionTree>(initialConditionTree);
  const lastCondition =
    conditionTree[
      Object.keys(conditionTree)
        .reverse()
        .find((branchName) => isNumber(conditionTree[branchName as ConditionBranchName])) as ConditionBranchName
    ];
  const { hero } = useStyles();
  const { isMobile } = useBreakpoints();
  const bgImage = useMemo(
    () => (isMobile ? pageInfo.imgMobile : pageInfo.imgDesktop),
    [isMobile, pageInfo.imgMobile, pageInfo.imgDesktop],
  );

  const { query } = useRouter();
  const meta = useMemo(() => {
    const creditSubType = query.creditSubType?.[0];
    if (!creditSubType) {
      return {
        title: 'Подберите нужный вам кредит',
        subTitle: 'Подберите нужный вам кредит - решение за 15 минут! Кредитный калькулятор на bankauto.ru',
      };
    }
    if (CreditRoutes.JUST_MONEY === creditSubType) {
      return {
        title: 'Кредит наличными от 7,9% - калькулятор онлайн, взять кредит на любую мечту на bankauto.ru',
        subTitle:
          'Взять кредит от 7,9% - решение за 15 минут! Прозрачные условия, удобный калькулятор. Зайдите и убедитесь!',
      };
    }
    if (CreditRoutes.AUTHORIZED_DEALER === creditSubType) {
      return {
        title: 'Автокредит на авто 🚗 условия и калькулятор автомобиля в кредит на bankauto.ru',
        subTitle: 'Взять кредит на автомобиль на выгодных условиях! Автокредит на авто на bankauto.ru',
      };
    }
    if (CreditRoutes.C2C === creditSubType) {
      return {
        title: 'Автокредит на покупку у физического лица - калькулятор, выгодное автокредитование физических лиц',
        subTitle:
          'Автокредит на покупку авто у физического лица от 5,9% - решение за 15 минут! Удобный калькулятор. Зайдите и убедитесь!',
      };
    }
    return {
      title: 'Подберите нужный вам кредит',
      subTitle: 'Подберите нужный вам кредит - решение за 15 минут! Кредитный калькулятор на bankauto.ru',
    };
  }, [query]);

  return (
    <>
      <Meta title={meta.title} description={meta.subTitle} />
      <FinanceLayout>
        <Hero
          title={pageInfo.mainText}
          subTitle={pageInfo.additionalText}
          isShowButton={false}
          className={hero}
          bgImage={bgImage}
        />
        <ConditionTree
          conditionTree={conditionTree}
          setConditionTree={setConditionTree}
          lastCondition={lastCondition}
        />
        <ConditionResult lastCondition={lastCondition} />
      </FinanceLayout>
    </>
  );
};

export { FinanceCredit };
