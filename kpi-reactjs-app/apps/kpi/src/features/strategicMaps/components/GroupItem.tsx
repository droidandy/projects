import * as React from 'react';
import styled from 'styled-components';
import { TransString, AppStrategicMapColor } from 'src/types-next';
import { DisplayTransString } from 'src/components/DisplayTransString';
import {
  DragSourceMonitor,
  useDrag,
  useDrop,
  DropTargetMonitor,
} from 'react-dnd';
import {
  StrategicMapsActions,
  ItemTypes,
  getStrategicMapsState,
} from '../interface';
import { useActions } from 'typeless';
import { XYCoord } from 'dnd-core';
import { getDesignerItemStyle } from 'src/common/helper';

interface GroupItemProps {
  className?: string;
  name: TransString;
  id: string;
  index: number;
  containerKey: string;
  isEditMode: boolean;
}

const MenuIcons = styled.div`
  position: absolute;
  top: -17px;
  right: 5px;
  i:hover {
    cursor: pointer;
    color: black;
  }
  color: black;
`;

function getUrl(key: string) {
  const [type, id] = key.split('_');
  return `/scorecards/${type}/${id}`;
}

const _GroupItem = (props: GroupItemProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { className, name, id, index, containerKey, isEditMode } = props;
  const { moveToColumn, moveItem, removeItem } = useActions(
    StrategicMapsActions
  );
  const { colors } = getStrategicMapsState.useState();

  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.item, id, index, containerKey },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (_, monitor: DragSourceMonitor) => {
      const target = monitor.getDropResult();
      if (target) {
        if (target.isEmpty) {
          moveToColumn(id, target.groupId, target.columnId);
        }
      }
    },
  });
  const [, drop] = useDrop({
    accept: ItemTypes.item,
    hover(item: any, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (item.containerKey !== containerKey) {
        moveItem(item.id, id, hoverIndex);
        item.index = hoverIndex;
        item.containerKey = containerKey;
        return;
      }

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
      moveItem(item.id, id, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const opacity = isDragging ? 0 : 1;
  if (isEditMode) {
    drag(drop(ref));
  }

  const style = React.useMemo(() => {
    const type = id.split('_')[0] as AppStrategicMapColor;
    return getDesignerItemStyle(type, colors);
  }, [colors, id]);

  return isEditMode ? (
    <div ref={ref} className={className} style={{ opacity, ...style }}>
      <DisplayTransString value={name} />
      <MenuIcons>
        <i className="flaticon2-trash" onClick={() => removeItem(id)} />
      </MenuIcons>
    </div>
  ) : (
    <a href={getUrl(id)} className={className} target="_blank" style={style}>
      <DisplayTransString value={name} />
    </a>
  );
};

export const GroupItem = styled(_GroupItem)`
  position: relative;
  background: #3d86af;
  padding: 8px 15px;
  border-radius: 30px;
  width: 100%;
  flex-grow: 0;
  color: white;
  text-align: center;
  margin: 20px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => (props.isEditMode ? 'move' : 'pointer')};
`;
