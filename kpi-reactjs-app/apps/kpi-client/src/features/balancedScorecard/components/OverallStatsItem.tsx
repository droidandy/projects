import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

interface OverallStatsItemProps {
  className?: string;
  color: string;
  name: string;
  count: number;
}

const Bar = styled.div`
  width: 8px;
  height: 40px;
  margin-left: 10px;
`;
const Right = styled.div``;
const Name = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #595d6e;
`;
const Count = styled.div`
  font-size: 20px;
  line-height: 20px;
`;

const _OverallStatsItem = (props: OverallStatsItemProps) => {
  const { className, color, name, count } = props;
  const { t } = useTranslation();
  return (
    <div className={className}>
      <Bar style={{ background: color }} />
      <Right>
        <Name>{t(name)}</Name>
        <Count style={{ color }}>{count}</Count>
      </Right>
    </div>
  );
};

export const OverallStatsItem = styled(_OverallStatsItem)`
  display: flex;
`;
