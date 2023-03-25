import React from 'react';
import styled from 'styled-components';
import { UnitReport } from 'src/types-next';
import { ReportComment } from './ReportComment';

const Comments = styled.div`
  margin-top: 20px;
`;

interface UnitReportCommentsProps {
  unitReport: UnitReport;
}

export function UnitReportComments(props: UnitReportCommentsProps) {
  const { unitReport } = props;

  return (
    <>
      {unitReport.comments.length > 0 && (
        <Comments>
          {unitReport.comments.map(item => (
            <ReportComment key={item.id} comment={item} />
          ))}
        </Comments>
      )}
    </>
  );
}
