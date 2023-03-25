import * as React from 'react';
import styled from 'styled-components';
import { KPIDashboardCard } from 'src/types';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { API_BASE_URL } from 'shared/API';
import { KPIDataType } from 'shared/types';

interface KpiCardProps {
  className?: string;
  kpiCard: KPIDashboardCard;
}

const Icon = styled.div`
  width: 70px;
  height: 70px;
  padding: 0;
  position: absolute;
  top: -35px;
  left: calc(50% - 35px);
  background: #0a73a5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    max-width: 40px;
    max-height: 40px;
  }
`;

const Title = styled.h3`
  margin-top: 0;
  text-align: center;
  font-size: 1.55rem;
  color: #48465b;
  font-style: normal;
  font-weight: bold;
  font-size: 36px;
  line-height: 45px;
  text-align: center;
  background: linear-gradient(-251.49deg, #6694f2 0%, #02325b 98.52%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Desc = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 19px;
  text-align: center;
  color: #244159;
`;

const Inner = styled.div`
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.03);
  border-radius: 3px;
  padding: 45px 1.5rem;
  background: white;
  position: relative;
  height: 100%;
`;

const _KpiCard = (props: KpiCardProps) => {
  const { className, kpiCard } = props;
  const getSymbol = () => {
    if (kpiCard.kpi.dataTypeId === KPIDataType.Percentage) {
      return '%';
    }
    return '';
  };

  return (
    <div className={className}>
      <Inner>
        <Icon>
          <img
            src={`${API_BASE_URL}/api/documents/files?token=${kpiCard.icon.downloadToken}`}
          />
        </Icon>
        <Title>
          {kpiCard.value}
          {getSymbol()}
        </Title>
        <Desc>
          <DisplayTransString value={kpiCard.title} />
        </Desc>
      </Inner>
    </div>
  );
};

export const KpiCard = styled(_KpiCard)`
  display: block;
  padding: 0 10px;
  flex: 1 0 0;
`;
