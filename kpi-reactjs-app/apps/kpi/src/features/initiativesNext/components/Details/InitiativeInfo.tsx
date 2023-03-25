import * as React from 'react';
import styled from 'styled-components';
import { getInitiativesState, InitiativesActions } from '../../interface';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { Portlet } from 'src/components/Portlet';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/Button';
import { StatusWidget } from 'src/components/StatusWidget';
import { Badge } from 'src/components/Badge';
import { useLookupMap } from 'src/hooks/useLookupMap';
import { formatDate } from 'src/common/utils';
import { ActivityActions } from '../ActivityModal';
import { useActions } from 'typeless';
import { RiskManagementActions } from '../RiskManagementModal';

const Title = styled.div`
  font-size: 1.3rem;
  color: #48465b;
  font-weight: 600;
  margin: 0.8rem 0 0.7rem 0;
`;

const Desc = styled.div`
  color: #595d6e;
  font-weight: 400;
  padding-right: 2rem;
  flex-grow: 1;
  margin-bottom: 0.5rem;
`;

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const Buttons = styled.div`
  ${Button} + ${Button} {
    margin-left: 10px;
  }
`;

const Bottom = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  border-top: 1px solid #ebedf2;
  margin-top: 2rem;
`;

export function InitiativeInfo() {
  const { show: showActivity } = useActions(ActivityActions);
  const { show: showRisk } = useActions(RiskManagementActions);
  const { edit } = useActions(InitiativesActions);
  const initiativesState = getInitiativesState.useState();
  const { items, activities } = initiativesState;
  const initiative = initiativesState.initiative!;
  const lookupMap = useLookupMap();
  const { t } = useTranslation();

  const getCurrency = () => {
    const currency = lookupMap[initiative.currencyId];
    return <DisplayTransString value={currency} />;
  };

  const getBudget = () => {
    const currency = lookupMap[initiative.currencyId];
    if (!currency || initiative.budget == null) {
      return '-';
    }
    return (
      <>
        {initiative.budget} {getCurrency()}
      </>
    );
  };

  const totalSpent = React.useMemo(
    () => items.reduce((sum, item) => sum + item.budgetSpent, 0),
    [items]
  );

  return (
    <Portlet padding>
      <Head>
        <Title>
          <DisplayTransString value={initiative.name} />
        </Title>
        <Buttons>
          <Button small onClick={() => showRisk(null)}>
            {t('Add Risk')}
          </Button>
          <Button small onClick={() => showActivity(null)}>
            {t('Add Activity')}
          </Button>
          <Button small onClick={edit} styling="secondary">
            {t('Edit')}
          </Button>
        </Buttons>
      </Head>
      <Desc>
        <DisplayTransString value={initiative.description} />
      </Desc>
      <Bottom>
        <StatusWidget
          title={t('Status')}
          description={
            <Badge size="large" type="error">
              {t('Late')}
            </Badge>
          }
        />
        <StatusWidget title={t('Budget')} description={getBudget()} />
        <StatusWidget
          title={t('Spent')}
          description={
            <>
              {totalSpent} {getCurrency()}
            </>
          }
        />
        <StatusWidget title={t('Activities')} description={activities.length} />
        <StatusWidget
          title={t('Start Date')}
          description={formatDate(initiative.startDate)}
        />
        <StatusWidget
          title={t('End Date')}
          description={formatDate(initiative.endDate)}
        />
      </Bottom>
    </Portlet>
  );
}
