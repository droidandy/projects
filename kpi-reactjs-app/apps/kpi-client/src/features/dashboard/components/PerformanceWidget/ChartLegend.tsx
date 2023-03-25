import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Colors } from 'src/Const';

interface ChartLegendProps {
  className?: string;
}

const Slice = styled.div`
  display: flex;
  align-items: center;
  margin: 0 10px;
  p {
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 16px;
    text-align: left;
    color: #728393;
    margin: 0;
  }
`;
const Color = styled.span`
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 50%;
  margin-left: 3px;
`;

const _ChartLegend = (props: ChartLegendProps) => {
  const { className } = props;
  const { t } = useTranslation();

  return (
    <div className={className}>
      <Slice>
        <Color style={{ background: Colors.blue }}></Color>
        <p>{t('Exceeded')}</p>
      </Slice>
      <Slice>
        <Color style={{ background: Colors.green }}></Color>
        <p>{t('Achieved')}</p>
      </Slice>
      <Slice>
        <Color style={{ background: Colors.yellow }}></Color>
        <p>{t('Nearly')}</p>
      </Slice>
      <Slice>
        <Color style={{ background: Colors.red }}></Color>
        <p>{t('Below')}</p>
      </Slice>
      <Slice>
        <Color style={{ background: Colors.gray }}></Color>
        <p>{t('No Performance')}</p>
      </Slice>
    </div>
  );
};

export const ChartLegend = styled(_ChartLegend)`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 20px auto 5px;
`;
