import styled from 'styled-components';
import React from 'react';
import { getDashboardState } from '../interface';
import { KpiCard } from './KpiCard';
import { DisplayTransString } from 'src/components/DisplayTransString';

const Title = styled.h2`
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 50px;
  color: #244159;
`;

const Cards = styled.div`
  display: flex;
  margin: 45px -10px 30px;
`;

export function KpiCards() {
  const { dashboard } = getDashboardState.useState();

  return (
    <>
      <Title>
        <DisplayTransString value={dashboard!.name} />
      </Title>
      <Cards>
        {dashboard!.kpiCards.map(item => (
          <KpiCard kpiCard={item} key={item.id} />
        ))}
      </Cards>
    </>
  );
}
