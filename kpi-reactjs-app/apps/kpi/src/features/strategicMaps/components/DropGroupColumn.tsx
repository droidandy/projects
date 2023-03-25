import * as React from 'react';
import styled from 'styled-components';
import { ItemTypes } from '../interface';
import { useDrop } from 'react-dnd';
import { GroupItem } from './GroupItem';
import { AppStrategicMapGroupColumn } from 'src/types-next';

interface DropGroupColumnProps {
  className?: string;
  column: AppStrategicMapGroupColumn;
  groupId: number;
  isEditMode: boolean;
  size: number;
}

const _DropGroupColumn = (props: DropGroupColumnProps) => {
  const { className, groupId, column, isEditMode } = props;

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: [ItemTypes.item],
    drop: () => ({
      groupId,
      columnId: column.id,
      isEmpty: !column.items.length,
    }),
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = canDrop && isOver;

  return (
    <div
      ref={isEditMode ? drop : undefined}
      className={className}
      style={{
        border: isActive ? '2px black dashed' : undefined,
      }}
    >
      {column.items.map((item, i) => (
        <GroupItem
          containerKey={`${groupId}_${column.id}`}
          index={i}
          name={item.name}
          id={item.id}
          key={item.id}
          isEditMode={isEditMode}
        />
      ))}
    </div>
  );
};

export const DropGroupColumn = styled(_DropGroupColumn)`
  display: block;
  border: 2px transparent dashed;
  width: ${props => 100 / props.size}%;
`;
