import * as React from 'react';
import styled from 'styled-components';
import { AppStrategicMapImage } from 'src/types-next';
import { FreeDragItem } from './FreeDragItem';
import { useActions } from 'typeless';
import { StrategicMapsActions } from '../interface';
import { API_BASE_URL } from 'shared/API';

interface ImageItemProps {
  className?: string;
  item: AppStrategicMapImage;
  isEditMode: boolean;
  offset: { x: number; y: number };
}

const _ImageItem = (props: ImageItemProps) => {
  const { className, item, isEditMode, offset } = props;
  const { removeImage } = useActions(StrategicMapsActions);

  return (
    <FreeDragItem
      item={item}
      itemType="image"
      isEditMode={isEditMode}
      className={className}
      offset={offset}
      onRemove={() => removeImage(item.id)}
    >
      <img
        src={`${API_BASE_URL}/api/documents/files?token=${item.imageDocument.downloadToken}`}
        style={{ width: '100%', height: '100%' }}
      />
    </FreeDragItem>
  );
};

export const ImageItem = styled(_ImageItem)`
  display: block;
`;
