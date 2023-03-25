import * as React from 'react';
import * as R from 'remeda';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Colors } from 'src/Const';
import { ReportStatsItem } from 'src/types';

interface ChartLegendProps {
  className?: string;
  items: ReportStatsItem[];
}

const Slice = styled.div`
  display: flex;
  align-items: center;
  margin: 0 8px;
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
  const { className, items } = props;
  const { t } = useTranslation();
  const options = React.useMemo(() => {
    const labels = [
      { name: 'blue', color: Colors.blue, text: 'Exceeded' },
      { name: 'green', color: Colors.green, text: 'Achieved' },
      { name: 'yellow', color: Colors.yellow, text: 'Nearly' },
      { name: 'red', color: Colors.red, text: 'Below' },
      { name: 'gray', color: Colors.gray, text: 'No Performance' },
    ];
    const mapByColor = R.indexBy(items, x => x.color);
    return labels
      .filter(x => mapByColor[x.name])
      .map(item => {
        const stats = mapByColor[item.name];
        return {
          ...item,
          percentage: stats.percentage,
        };
      });
  }, [items]);

  const rowOptions = R.chunk(options, 3);
  return (
    <>
      {
        rowOptions.map( (subOptions, index) => {
          return (
            <div className={className} key={index}>
              {subOptions.map(option => (
                <Slice key={option.color}>
                  <Color style={{ background: option.color }}></Color>
                  <p>
                    {t(option.text)} - {option.percentage}%
                  </p>
                </Slice>
              ))}
            </div>
          )
        })
      }
    </>
  );
};

export const ChartLegend = styled(_ChartLegend)`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 20px auto 5px;
  padding-right: 30px;
`;
