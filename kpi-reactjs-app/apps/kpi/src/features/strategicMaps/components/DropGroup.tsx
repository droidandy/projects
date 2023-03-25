import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { DropGroupColumn } from './DropGroupColumn';
import { AppStrategicMapGroup } from 'src/types-next';
import { useDrag, useDrop, DropTargetMonitor, XYCoord } from 'react-dnd';
import {
  ItemTypes,
  StrategicMapsActions,
  getStrategicMapsState,
} from '../interface';
import { useActions } from 'typeless';
import { MoveIcon } from 'src/components/MoveIcon';
import { ContainerActions } from './ContainerModal';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { getDesignerItemStyle } from 'src/common/helper';

interface DropGroupProps {
  className?: string;
  group: AppStrategicMapGroup;
  index: number;
  isEditMode: boolean;
}

const MenuIcons = styled.div`
  display: flex;
  position: absolute;
  right: 5px;
  top: 5px;
  i + i {
    margin-left: 5px;
  }
  i:hover {
    cursor: pointer;
    color: black;
  }
`;

const GroupWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  flex-shrink: 0;
  padding: 15px;
  min-height: 150px;
`;
const GroupName = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  flex-grow: 0;
  flex-shrink: 0;
  border-right: 1px #ccc solid;
`;
const GroupNameText = styled.div`
  transform: translateX(-50%) translateY(-50%) rotate(-90deg);
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
`;

const _DropGroup = (props: DropGroupProps) => {
  const { className, group, index, isEditMode } = props;
  const { t } = useTranslation();
  const ref = React.useRef<HTMLDivElement>(null);
  const { show: showGroup } = useActions(ContainerActions);
  const { moveGroup, removeGroup } = useActions(StrategicMapsActions);
  const { colors } = getStrategicMapsState.useState();

  const empty = group.columns.every(col => !col.items.length);

  const [{}, drag, preview] = useDrag({
    item: { type: ItemTypes.group, index },
  });

  const [, drop] = useDrop({
    accept: ItemTypes.group,
    hover(item: any, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current!.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveGroup(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  if (isEditMode) {
    preview(drop(ref));
  }
  const color = getDesignerItemStyle('Container', colors);

  return (
    <div className={className} ref={ref}>
      <GroupName style={{ background: color.background }}>
        <GroupNameText style={{ color: color.color }}>
          <DisplayTransString value={group.name} />
        </GroupNameText>
      </GroupName>
      <GroupWrapper>
        {group.columns.map(column => (
          <DropGroupColumn
            key={(isEditMode ? 'edit' : 'readonly') + column.id}
            groupId={group.id}
            column={column}
            isEditMode={isEditMode}
            size={group.columns.length}
          />
        ))}
      </GroupWrapper>
      {empty && <Center>{t('Drop elements here')}</Center>}
      {isEditMode && (
        <MenuIcons>
          <i className="flaticon2-edit" onClick={() => showGroup(group)} />
          <i
            className="flaticon2-trash"
            onClick={() => removeGroup(group.id)}
          />
          <Handle ref={drag}>
            <MoveIcon />
          </Handle>
        </MenuIcons>
      )}
    </div>
  );
};

const Handle = styled.div`
  width: 16px;
  height: 16px;
  cursor: move;
  margin-left: 5px;
`;

const Center = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

export const DropGroup = styled(_DropGroup)`
  display: flex;
  width: 100%;
  background: ${props => (props.isEditMode ? '#f7f7f7' : null)};
  border-radius: 10px;
  flex-wrap: wrap;
  justify-content: center;
  position: relative;
  min-height: 60px;
  margin-bottom: 20px;
`;
