import React from 'react';
import { useKpiDetails } from '../module';
import { getKpiDetailsState, KpiDetailsActions } from '../interface';
import { useActions } from 'typeless';
import { SidePanel } from 'src/components/SidePanel';
import styled from 'styled-components';
import { EntitySidePanelHeader } from 'src/components/EntitySidePanelHeader';
import { Tabs, Tab } from 'src/components/Tabs';
import { useTranslation } from 'react-i18next';
import { PerformanceIcon } from 'src/icons/PerformanceIcon';
import { FileIcon } from 'src/components/FileIcon';
import { CommentIcon } from 'src/components/CommentIcon';
import { HistoryIcon } from 'src/icons/HistoryIcon';
import { DetailsTab } from './DetailsTab';
import Skeleton from 'react-skeleton-loader';
import { NoDataPlaceholder } from 'src/components/NoDataPlaceholder';
import { PerformanceTab } from './PerformanceTab';
import { DiscussionTab } from './DiscussionTab';
import { useComments } from 'src/features/comments/module';
import { useKpiForm } from '../kpi-form';

const Content = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`;

const SkeletonWrapper = styled.div`
  padding: 30px;
`;

export function KpiDetailsSidePanel() {
  useKpiDetails();
  useComments();
  useKpiForm();
  const { isVisible, kpi, isLoading, tab } = getKpiDetailsState.useState();
  const { close, setTab } = useActions(KpiDetailsActions);
  const { t } = useTranslation();

  const renderDetails = () => {
    if (!kpi) {
      return null;
    }
    return (
      <Content>
        {isLoading ? (
          <SkeletonWrapper>
            <Skeleton height={'13px'} count={10} width="80%" />
          </SkeletonWrapper>
        ) : (
          <>
            <EntitySidePanelHeader entity={kpi} />
            <Tabs flex sticky selectedTab={tab} onIndexChange={setTab}>
              <Tab
                name="performance"
                title={
                  <>
                    <PerformanceIcon /> {t('Performance')}
                  </>
                }
              >
                <PerformanceTab />
              </Tab>
              <Tab
                name="details"
                title={
                  <>
                    <FileIcon /> {t('KPI Details')}
                  </>
                }
              >
                <DetailsTab />
              </Tab>
              <Tab
                name="discussion"
                title={
                  <>
                    <CommentIcon /> {t('Discussion')}
                  </>
                }
              >
                <DiscussionTab />
              </Tab>
              <Tab
                name="history"
                title={
                  <>
                    <HistoryIcon /> {t('History')}
                  </>
                }
              >
                <NoDataPlaceholder>
                  {t('No History Available Right Now')}
                </NoDataPlaceholder>
              </Tab>
            </Tabs>
          </>
        )}
      </Content>
    );
  };

  return (
    <SidePanel isOpen={isVisible} close={close} size="large">
      {renderDetails()}
    </SidePanel>
  );
}
