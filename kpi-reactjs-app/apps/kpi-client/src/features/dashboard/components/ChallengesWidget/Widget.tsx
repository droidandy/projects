import React from 'react';
import { Box } from 'src/components/Box';
import { PeriodPicker } from 'src/components/PeriodPicker';
import { EmptyWidgetContent } from 'src/components/EmptyWidgetContent';
import { NoTasksImage } from 'src/components/NoTasksImage';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  getChallengesWidgetState,
  ChallengesWidgetActions,
} from './ChallengesWidget';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { Spinner } from 'src/components/Spinner';
import { useActions } from 'typeless';
import { Pagination } from 'src/components/Pagination';

const Top = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.h5`
  line-height: 34px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 450px;
  height: 100%;
  margin: 0 -20px;
  ${Pagination} {
    margin-top: auto;
    margin-bottom: 20px;
  }
`;

const SpinnerWrapper = styled(Content)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  thead {
    background: #F7F9FC;
  }
  td,
  th {
    border-bottom: 1px solid #f2f3f8;
    text-align: right;
    font-size: 14px;
  }
  th {
    font-weight: 600;
    padding: 15px 20px;
  }
  td {
    padding: 20px 20px;
  }
`;

const Status = styled.div`
  font-size: 11px;
  line-height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 30px;
  background: #e8f8f3;
  color: #41c197;
  border-radius: 3px;
`;

export function Widget() {
  const { t } = useTranslation();
  const {
    challenges,
    isLoading,
    pageIndex,
    pageSize,
    totalCount,
    period,
    isPageLoading,
  } = getChallengesWidgetState.useState();
  const { changePeriod, changePage } = useActions(ChallengesWidgetActions);
  const renderContent = () => {
    if (isLoading) {
      return (
        <SpinnerWrapper>
          <Spinner black size="40px" />
        </SpinnerWrapper>
      );
    }
    if (!challenges.length) {
      return (
        <EmptyWidgetContent title={t('No Challenges Available Right Now')}>
          <NoTasksImage />
        </EmptyWidgetContent>
      );
    }
    return (
      <>
        <Table style={{ opacity: isPageLoading ? 0.7 : 1 }}>
          <thead>
            <tr>
              <th>{t('Challenge Title')}</th>
              <th>{t('Responsible Unit')}</th>
              <th>{t('Affected Unit')}</th>
              <th>{t('Status')}</th>
            </tr>
          </thead>
          <tbody>
            {challenges.map(item => (
              <tr key={item.id}>
                <td>
                  <DisplayTransString value={item.name} />
                </td>
                <td>
                  <DisplayTransString value={item.challengedUnit.name} />
                </td>
                <td>
                  <DisplayTransString value={item.affectedUnit.name} />
                </td>
                <td>
                  <Status>{item.status}</Status>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination
          total={totalCount}
          current={pageIndex - 1}
          pageSize={pageSize}
          gotoPage={page => {
            changePage(page + 1);
          }}
        />
      </>
    );
  };
  return (
    <Box>
      <Top>
        <Title>{t('Challenges Widget')}</Title>
        <PeriodPicker
          start={new Date().getFullYear() - 5}
          end={new Date().getFullYear()}
          value={period}
          minFrequency="Quarterly"
          onChange={changePeriod}
        />
      </Top>
      <Content>{renderContent()}</Content>
    </Box>
  );
}
