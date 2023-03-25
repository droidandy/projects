import * as React from 'react';
import styled from 'styled-components';
import { BalancedScorecardItem, ObjectPerformance } from 'src/types';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { Colors } from 'src/Const';
import { useTranslation } from 'react-i18next';
import { ArrowIcon } from 'src/components/ArrowIcon';
import {
  BalancedScorecardItemType,
  Kpi,
  BalancedScorecardItemAllowedParent,
} from 'shared/types';
import { KpiTable } from './KpiTable';
import { AddInlineType } from './AddInlineType';

interface TreeItemProps {
  className?: string;
  item: BalancedScorecardItem;
  depth: number;
  parentGroups: Record<string, BalancedScorecardItem[]>;
  performanceMap: Record<string, ObjectPerformance>;
  parentTypes: BalancedScorecardItemAllowedParent[];
}

const colors = [
  '#FBFCFF',
  '#F2F4F8',
  '#FFFCF5',
  '#FFF5FD',
  '#F6FFF5',
  '#ECF4F9',
  '#FBFCFF',
];

const Content = styled.div`
  display: flex;
  padding: 15px 30px;
`;
const Expanded = styled.div`
  padding: 30px 30px 15px;
`;

const DetailsCol = styled.div`
  display: flex;
  padding-left: 10px;
  cursor: pointer;
  ${ArrowIcon} {
    margin-left: 6px;
    height: 36px;
    display: flex;
    align-items: center;
  }
`;

const Avatar = styled.div`
  width: 30px;
  height: 30px;
  font-weight: 500;
  font-size: 13px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-left: 10px;
  background: #84d677;
  flex-shrink: 0;
  overflow: hidden;
`;

const Type = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  color: #244159;
`;

const Name = styled.div`
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;
  color: #244159;
`;

const ProgressCol = styled.div`
  display: flex;
  align-items: center;
  flex: 1 0 0;
`;

const ProgressWrapper = styled.div`
  display: flex;
  width: 250px;
  position: relative;
  height: 10px;
`;

const ProgressBack = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  background: rgba(0, 0, 0, 0.1);
  height: 10px;
  width: 100%;
  border-radius: 5px;
`;

const ProgressFront = styled(ProgressBack)`
  z-index: 3;
  background: #ffb822;
`;

const Percent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 13px;
  color: white;
  margin-right: 13px;
  width: 60px;
  height: 36px;
  font-weight: 600;
  font-size: 13px;
`;

const PerformanceLabel = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: #244159;
  margin-left: 15px;
  width: 200px;
`;

const _TreeItem = (props: TreeItemProps) => {
  const {
    className,
    item,
    depth,
    parentGroups,
    performanceMap,
    parentTypes,
  } = props;
  const { t } = useTranslation();
  const [isExpanded, setExpanded] = React.useState(false);
  const subItems = parentGroups[item.id];
  const performance = performanceMap[item.id];
  const color = Colors[performance?.performanceColor?.slug || 'gray'];
  const percent = performance?.performance || 0;
  const { kpiItems, nonKpiItems } = React.useMemo(() => {
    return {
      kpiItems: (subItems || []).filter(
        x => x.typeId === BalancedScorecardItemType.KPI
      ) as Kpi[],
      nonKpiItems: (subItems || []).filter(
        x => x.typeId !== BalancedScorecardItemType.KPI
      ),
    };
  }, [subItems]);
  const types = React.useMemo(
    () => parentTypes.filter(x => x.parentTypeId === item.typeId),
    [item, parentTypes]
  );
  return (
    <div
      className={className}
      style={{ background: colors[depth % colors.length] }}
    >
      <Content>
        <DetailsCol
          style={{ width: 420 - depth * 30 }}
          onClick={() => setExpanded(!isExpanded)}
        >
          <ArrowIcon direction={isExpanded ? 'up' : 'down'} />
          <Avatar style={{ backgroundColor: color }}></Avatar>
          <div>
            <Type>
              <DisplayTransString value={item.type} />
            </Type>
            <Name>
              <DisplayTransString value={item.name} />
            </Name>
          </div>
        </DetailsCol>
        <ProgressCol>
          <PerformanceLabel>
            <DisplayTransString value={item.type} /> {t('performance')}:
          </PerformanceLabel>
          <ProgressWrapper>
            <ProgressBack />
            <ProgressFront
              style={{
                width: `${percent}%`,
                background: color,
              }}
            />
          </ProgressWrapper>
          <Percent style={{ background: color }}>{percent}%</Percent>
        </ProgressCol>
      </Content>
      {isExpanded && nonKpiItems.length + kpiItems.length > 0 && (
        <Expanded>
          <KpiTable items={kpiItems} performanceMap={performanceMap} />
          {nonKpiItems.map((sub, i) => (
            <TreeItem
              key={i}
              depth={depth + 1}
              parentGroups={parentGroups}
              item={sub}
              performanceMap={performanceMap}
              parentTypes={parentTypes}
            />
          ))}
          <AddInlineType types={types} parent={item} />
        </Expanded>
      )}
    </div>
  );
};

export const TreeItem = styled(_TreeItem)`
  display: block;
  margin-bottom: 5px;
`;
