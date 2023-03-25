import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

interface StatsItemProps {
  className?: string;
  color: string;
  name: string;
  shortName: string;
  count: number;
}

const Icon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  margin-left: 5px;
  border-radius: 50%;
`;

const Right = styled.div``;

const Name = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #595d6e;
  line-height: 20px;
`;
const Count = styled.div`
  font-weight: bold;
  font-size: 20px;
  color: #48465b;
  line-height: 20px;
`;

const _StatsItem = (props: StatsItemProps) => {
  const { className, color, name, shortName, count } = props;
  const { t } = useTranslation();
  return (
    <div className={className}>
      <Icon style={{ background: color }}>{shortName}</Icon>
      <Right>
        <Name>{t(name)}</Name>
        <Count>{count}</Count>
      </Right>
    </div>
  );
};

export const StatsItem = styled(_StatsItem)`
  display: flex;
`;
