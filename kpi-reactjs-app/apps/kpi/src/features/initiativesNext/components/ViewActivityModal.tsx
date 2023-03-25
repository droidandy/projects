import { createModule, useActions } from 'typeless';
import { ViewActivitySymbol } from '../symbol';
import React from 'react';
import * as Rx from 'src/rx';
import { useTranslation } from 'react-i18next';
import { formatDate, catchErrorAndShowModal } from 'src/common/utils';
import { SidePanel } from 'src/components/SidePanel';
import { Initiative } from 'src/types-next';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { styled } from 'src/styled';
import { StatusWidget } from 'src/components/StatusWidget';
import { useLookupMap } from 'src/hooks/useLookupMap';
import { Button } from '../../../components/Button';
import { Table, Th, Td } from '../../../components/Table';
import {
  getInitiativeById,
  deleteInitiative,
} from '../../../services/API-next';
import { DetailsSkeleton } from '../../../components/DetailsSkeleton';
import { ActivityActions } from './ActivityModal';
import { Popconfirm } from '../../../components/Popconfirm';
import { AmountActions } from './AmountModal';

const Desc = styled.div`
  color: #595d6e;
  font-weight: 400;
  padding-right: 2rem;
  flex-grow: 1;
  margin-bottom: 0.5rem;
`;

const BottomWrapper = styled.div`
  border-bottom: 1px solid #ebedf2;
  margin-left: -1.25rem;
  margin-right: -1.25rem;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
`;

const Bottom = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  padding-bottom: 20px;
  margin-top: 2rem;
`;

const Title = styled.h5`
  margin: 0;
  line-height: 1.5;
  font-size: 1.3rem;
  color: #464457;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 20px;
  ${Button} + ${Button} {
    margin-left: 15px;
  }
`;

export function ViewActivityModal() {
  handle();
  const { isVisible, activity, isLoading } = getViewActivityState.useState();
  const { close, update, remove } = useActions(ViewActivityActions);
  const { show: showAmount } = useActions(AmountActions);
  const { t } = useTranslation();
  const lookupMap = useLookupMap();

  const getCurrency = () => {
    const currency = lookupMap[activity.currencyId];
    return <DisplayTransString value={currency} />;
  };

  const getBudget = () => {
    const currency = lookupMap[activity.currencyId];
    if (!currency || activity.budget == null) {
      return '-';
    }
    return (
      <>
        {activity.budget} {getCurrency()}
      </>
    );
  };
  const renderDetails = () => {
    if (isLoading) {
      return <DetailsSkeleton />;
    }
    return (
      <>
        <Title>
          <DisplayTransString value={activity.name} />
        </Title>
        <Desc>
          <DisplayTransString value={activity.description} />
        </Desc>
        <BottomWrapper>
          <Bottom>
            <StatusWidget title={t('Budget')} description={getBudget()} />
            <StatusWidget
              title={t('Start Date')}
              description={formatDate(activity.startDate)}
            />
            <StatusWidget
              title={t('End Date')}
              description={formatDate(activity.endDate)}
            />
            <StatusWidget title={t('Assign')} description={'Ahmad'} />
          </Bottom>
        </BottomWrapper>
        <Buttons>
          <div>
            <Button small styling="brand" onClick={showAmount}>
              {t('mark completed')}
            </Button>
            <Button small onClick={update}>
              {t('update')}
            </Button>
          </div>
          <div>
            <Popconfirm onYes={remove} text="Are you sure to delete?">
              <Button small styling="secondary">
                {t('delete')}
              </Button>
            </Popconfirm>
          </div>
        </Buttons>
        <h3>{t('Skills')}</h3>
        {activity.initiativeSkills.length ? (
          <Table>
            <thead>
              <tr>
                <Th>{t('Skill')}</Th>
                <Th>{t('Type')}</Th>
              </tr>
            </thead>
            <tbody>
              {activity.initiativeSkills.map(item => {
                const skill = item.skill;
                return (
                  <tr key={item.id}>
                    <Td>
                      <DisplayTransString value={skill.title} />
                    </Td>
                    <Td>{t(skill.type)}</Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : (
          t('No skills')
        )}
      </>
    );
  };

  return (
    <SidePanel isOpen={isVisible} close={close}>
      {renderDetails()}
    </SidePanel>
  );
}

export const [handle, ViewActivityActions, getViewActivityState] = createModule(
  ViewActivitySymbol
)
  .withActions({
    loaded: (activity: Initiative) => ({
      payload: { activity },
    }),
    show: (id: number) => ({
      payload: { id },
    }),
    update: null,
    remove: null,
    setLoading: (isLoading: boolean) => ({ payload: { isLoading } }),
    close: null,
  })
  .withState<ViewActivityState>();

interface ViewActivityState {
  isVisible: boolean;
  isLoading: boolean;
  activity: Initiative;
}

const initialState: ViewActivityState = {
  isVisible: false,
  isLoading: false,
  activity: {
    startDate: new Date(0).toISOString(),
    endDate: new Date(0).toISOString(),
    initiativeSkills: [] as any[],
  } as Initiative,
};

handle
  .epic()
  .on(ViewActivityActions.show, ({ id }) => {
    return Rx.concatObs(
      Rx.of(ViewActivityActions.setLoading(true)),
      getInitiativeById(id).pipe(
        Rx.mergeMap(activity => [ViewActivityActions.loaded(activity)]),
        catchErrorAndShowModal()
      ),
      Rx.of(ViewActivityActions.setLoading(false))
    );
  })
  .on(ViewActivityActions.remove, () => {
    const { activity } = getViewActivityState();
    return deleteInitiative(activity.id).pipe(
      Rx.mergeMap(() => [
        ActivityActions.activityDeleted(activity),
        ViewActivityActions.close(),
      ]),
      catchErrorAndShowModal()
    );
  })
  .on(ViewActivityActions.update, () => {
    const { activity } = getViewActivityState();

    return [ViewActivityActions.close(), ActivityActions.show(activity)];
  });

handle
  .reducer(initialState)
  .replace(ViewActivityActions.show, () => ({
    ...initialState,
    isVisible: true,
  }))
  .on(ViewActivityActions.loaded, (state, { activity }) => {
    state.activity = activity;
  })
  .on(ViewActivityActions.close, state => {
    state.isVisible = false;
  })
  .on(ViewActivityActions.setLoading, (state, { isLoading }) => {
    state.isLoading = isLoading;
  });
