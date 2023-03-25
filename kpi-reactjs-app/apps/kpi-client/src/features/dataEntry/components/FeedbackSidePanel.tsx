import * as R from 'remeda';
import { FeedbackSymbol } from '../symbol';
import { createModule, useActions } from 'typeless';
import React from 'react';
import * as Rx from 'src/rx';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { SidePanel } from 'src/components/SidePanel';
import { OrganizationUnitUser, UserKpiReport, UnitReport } from 'shared/types';
import { searchOrganizationUnitUser } from 'shared/API';
import { catchErrorAndShowModal } from 'src/common/utils';
import Skeleton from 'react-skeleton-loader';
import { Accordion } from 'src/components/Accordion';
import { DisplayTransString } from 'src/components/DisplayTransString';

const Padding = styled.div`
  padding: 0 30px;
`;

const SkeletonWrapper = styled.div`
  padding: 30px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 18px;
  line-height: 23px;
  color: #244159;
  margin-top: 30px;
`;

const Desc = styled.div`
  color: #a7abc3;
  font-weight: 600;
  margin-top: 15px;
  font-size: 14px;
`;

const Phase = styled.div`
  margin-top: 40px;
  color: #244159;
  font-weight: bold;
  font-size: 14px;
`;

function getUnitReportStatusText(unit: UnitReport) {
  if (unit.status !== 'Active' || !unit.currentPhase) {
    return unit.status;
  }
  switch (unit.currentPhase.phase) {
    case 'Submission':
    case 'PendingSubmissionFixes':
      return 'Submission';
    case 'Review':
      return 'Unit Manager Review (Level 1)';
    case 'Excellence':
      return 'Excellence Manager (Level 2)';
    case 'DGMApproval':
      return 'Deputy General Manager (Level 3)';
    case 'GMApproval':
      return 'Top Management (General Manager) :Level 4';
  }
  return `Unknown: ${unit.currentPhase.phase}`;
}

const Sep = styled.div`
  height: 2px;
  background: #e7ebf0;
  margin: 15px 0;
`;

const Label = styled.div`
  color: #244159;
  font-weight: bold;
  margin-bottom: 18px;
  font-size: 14px;
`;

const ReviewerName = styled.div`
  font-size: 14px;
  line-height: 18px;
  color: #244159;
  margin: 16px 0 10px;
`;

export function FeedbackSidePanel() {
  handle();
  const { t } = useTranslation();
  const {
    isVisible,
    isLoaded,
    unitReport,
    users,
  } = getFeedbackState.useState();
  const { close } = useActions(FeedbackActions);
  const userCommentMap: any = React.useMemo(() => {
    if (!unitReport) {
      return {};
    }
    return {};
    // return R.groupBy(unitReport.unitReport.comments, x => x.addedByUserId);
  }, [unitReport]);
  const roleMap = React.useMemo(() => {
    return R.groupBy(users, x => x.role);
  }, [users]);

  const sections = [
    {
      title: 'Unit Manager: Level 1',
      type: 'Review',
    },
    {
      title: 'Excellence Manager :Level 2',
      type: 'Excellence',
    },
    {
      title: 'Deputy Unit Manager :Level 3',
      type: 'DGMApproval',
    },
    {
      title: 'Top Management (General Manager) :Level 4',
      type: 'GMApproval',
    },
  ];

  const renderDetails = () => {
    if (!unitReport) {
      return null;
    }
    return (
      <>
        {!isLoaded ? (
          <SkeletonWrapper>
            <Skeleton height={'13px'} count={10} width="80%" />
          </SkeletonWrapper>
        ) : (
          <>
            <Padding>
              <Title>
                <DisplayTransString value={unitReport.unit.name} />
              </Title>
              <Desc>
                <DisplayTransString value={unitReport.unit.description} />
              </Desc>
              <Phase>
                <span>{t('CURRENT PHASE')}: </span>
                {getUnitReportStatusText(unitReport.unitReporting)}
              </Phase>
            </Padding>
            <Sep />
            <Padding>
              <Label>{t('Reviewers')}</Label>
            </Padding>
            {sections.map(({ title, type }) => {
              const items = (roleMap[type] || [])
                .map(user => ({
                  user,
                  comments: userCommentMap[user.orgUserId] || [],
                }))
                .filter(x => x.comments.length > 0);
              if (!items.length) {
                return;
              }
              return (
                <Accordion key={type} title={t(title, { nsSeparator: '____' })}>
                  <Padding>
                    <ReviewerName>{t('Reviewer Name')}</ReviewerName>
                    {/* {items.map(item => (
                      <React.Fragment key={item.user.id}>
                        {item.comments.map(comment => (
                          <FeedbackComment
                            key={comment.id}
                            unitUser={item.user}
                            comment={comment}
                          />
                        ))}
                      </React.Fragment>
                    ))} */}
                  </Padding>
                </Accordion>
              );
            })}
          </>
        )}
      </>
    );
  };

  return (
    <SidePanel isOpen={isVisible} close={close} size="large">
      {renderDetails()}
    </SidePanel>
  );
}

export const [handle, FeedbackActions, getFeedbackState] = createModule(
  FeedbackSymbol
)
  .withActions({
    show: (unitReport: UserKpiReport) => ({ payload: { unitReport } }),
    loaded: (users: OrganizationUnitUser[]) => ({ payload: { users } }),
    close: null,
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
  })
  .withState<FeedbackState>();

handle.epic().on(FeedbackActions.show, ({ unitReport }) => {
  return searchOrganizationUnitUser({
    unitId: unitReport.unit.id,
    pageSize: 1000,
  }).pipe(
    Rx.map(ret => FeedbackActions.loaded(ret.items)),
    catchErrorAndShowModal()
  );
});

interface FeedbackState {
  isVisible: boolean;
  isLoaded: boolean;
  unitReport: UserKpiReport;
  users: OrganizationUnitUser[];
}

const initialState: FeedbackState = {
  isVisible: false,
  isLoaded: false,
  unitReport: null!,
  users: [],
};

handle
  .reducer(initialState)
  .on(FeedbackActions.show, (state, { unitReport }) => {
    Object.assign(state, initialState);
    state.unitReport = unitReport;
    state.isVisible = true;
  })
  .on(FeedbackActions.loaded, (state, { users }) => {
    state.isLoaded = true;
    state.users = users;
  })
  .on(FeedbackActions.close, state => {
    state.isVisible = false;
  });
