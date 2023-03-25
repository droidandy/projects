import styled from 'styled-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { UnitReportStatus } from 'src/types-next';
import { UnreachableCaseError } from 'src/common/helper';

const Title = styled.h2`
  margin-top: 0;
`;

const Desc = styled.p``;
const Status = styled.p``;

export interface ReportHeader {
  title: React.ReactNode;
  desc?: React.ReactNode;
  status: UnitReportStatus;
}

export function TopText(props: ReportHeader) {
  const { title, desc, status } = props;
  const { t } = useTranslation();

  const getStatus = () => {
    switch (status) {
      case 'InProgress':
        return 'Submitting';
      case 'Submitted':
        return 'Reviewing';
      case 'Approved':
        return 'Approving';
      case 'Ready':
        return 'Ready';
      default:
        throw new UnreachableCaseError(status);
    }
  };

  return (
    <>
      <Title>{title}</Title>
      {desc && <Desc>{desc}</Desc>}
      <Status>
        {t('Status')}: <strong>{t(getStatus())} </strong>
      </Status>
    </>
  );
}
