import * as React from 'react';
import styled, { css } from 'styled-components';
import { AppStrategicMapText } from 'src/types-next';
import { FreeDragItem } from './FreeDragItem';
import { TextContent } from './TextContent';
import { useActions } from 'typeless';
import { StrategicMapsActions } from '../interface';
import { TextActions } from './TextModal';

interface TextItemProps {
  className?: string;
  item: AppStrategicMapText;
  isEditMode: boolean;
  offset: { x: number; y: number };
}

const _TextItem = (props: TextItemProps) => {
  const { className, item, isEditMode, offset } = props;
  const { removeText } = useActions(StrategicMapsActions);
  const { show: showText } = useActions(TextActions);

  return (
    <FreeDragItem
      item={item}
      itemType="text"
      isEditMode={isEditMode}
      className={className}
      onRemove={() => removeText(item.id)}
      onEdit={() => showText(item)}
      offset={offset}
    >
      <TextContent html={item.text} />
    </FreeDragItem>
  );
};

export const TextItem = styled(_TextItem)`
  ${props =>
    props.isEditMode &&
    css`
      background: white;
      border: 1px dashed #ccc;
    `}
`;
