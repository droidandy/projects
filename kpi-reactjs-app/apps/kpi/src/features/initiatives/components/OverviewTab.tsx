import * as React from 'react';
import styled from 'styled-components';
import { PerformanceHistory } from './PerformanceHistory';
import { getInitiativesState } from '../interface';
import { Card } from 'src/components/Card';
import { getTrans, formatDate } from 'src/common/utils';
import { useLanguage } from 'src/hooks/useLanguage';
import { useTranslation } from 'react-i18next';
import { getGlobalState } from 'src/features/global/interface';
import { ItemsTable } from './ItemsTable';
import { InitiativeItemType } from 'src/types-next';
import { RelatedItemsView } from 'src/features/relatedItems/components/RelatedItemsView';

interface OverviewTabProps {
  className?: string;
}

const Row = styled.div`
  display: flex;
  margin: 0 -10px;
  margin-bottom: 20px;
`;

const SmallColumn = styled.div`
  width: 232px;
  margin: 0 10px;
  flex-shrink: 0;
`;

const BigColumn = styled.div`
  margin: 0 10px;
  flex-grow: 1;
  width: calc(100% - 232px);
`;

const Label = styled.div`
  margin-top: 15px;
  h2 {
    margin: 5px 0;
  }
`;

const DateRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
`;

const _OverviewTab = (props: OverviewTabProps) => {
  const { className } = props;
  const { initiative, items } = getInitiativesState.useState();
  const lang = useLanguage();
  const { t } = useTranslation();
  const { lookups } = getGlobalState.useState();
  const currency = React.useMemo(
    () => lookups.find(x => x.id === initiative!.currencyId),
    [initiative]
  )!;
  const totalSpent = React.useMemo(
    () => items.reduce((sum, item) => sum + item.budgetSpent, 0),
    [items]
  );
  const currencySymbol = getTrans(lang, currency);
  const fullDate = initiative!.typeId === InitiativeItemType.Initiative;

  return (
    <div className={className}>
      <Row>
        <SmallColumn>
          <Card>
            {getTrans(lang, initiative!.description)}
            <Label>
              {t('Budget')}
              <h2>
                {currencySymbol} {initiative!.budget}
              </h2>
            </Label>
            <Label>
              {t('Spent')}
              <h2>
                {currencySymbol} {totalSpent}
              </h2>
            </Label>
            <div style={{ marginTop: 20 }}>
              {fullDate ? (
                <>
                  <DateRow>
                    <span>{t('Start Date')}:</span>
                    <span>{formatDate(initiative!.startDate, false)}</span>
                  </DateRow>
                  <DateRow>
                    <span>{t('End Date')}:</span>
                    <span>{formatDate(initiative!.endDate, false)}</span>
                  </DateRow>
                </>
              ) : (
                <DateRow>
                  <span>{t('Due Date')}:</span>
                  <span>{formatDate(initiative!.endDate, false)}</span>
                </DateRow>
              )}
            </div>
          </Card>
        </SmallColumn>
        <BigColumn>
          <PerformanceHistory />
        </BigColumn>
      </Row>
      <Row>
        <BigColumn>
          <ItemsTable currencySymbol={currencySymbol} />
        </BigColumn>
        <SmallColumn>
          <RelatedItemsView />
        </SmallColumn>
      </Row>
    </div>
  );
};

export const OverviewTab = styled(_OverviewTab)`
  display: block;
`;
