import * as React from 'react';
import styled, { css, createGlobalStyle } from 'styled-components';
import FreeTransform from 'react-free-transform';

import {
  StrategicMapItem,
  DraggableType,
  StrategicMapsActions,
} from '../interface';
import { useActions } from 'typeless';

interface FreeDragItemProps {
  className?: string;
  item: StrategicMapItem;
  isEditMode: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
  itemType: DraggableType;
  onEdit?: () => void;
  onRemove?: () => void;
  offset: { x: number; y: number };
}

const MenuIcons = styled.div`
  position: absolute;
  top: -25px;
  right: -5px;
  i + i {
    margin-left: 5px;
  }
  i:hover {
    cursor: pointer;
    color: black;
  }
`;

const TransformStyle = createGlobalStyle`
.tr-transform__content {
  background: white;
  border: 1px dashed #ccc;
  z-index: 4;
}

.tr-transform__controls {
  z-index: 10;
}
.tr-transform__rotator {
  top: -45px;
  left: calc(50% - 7px);
  z-index: 5;
}

.tr-transform__rotator,
.tr-transform__scale-point {
  z-index: 5;
  background: #fff;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  position: absolute;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
.tr-transform__rotator:hover,
.tr-transform__scale-point:hover {
  background: #f1f5f8;
}
.tr-transform__rotator:active,
.tr-transform__scale-point:active {
  background: #dae1e7;
}
.tr-transform__scale-point {
}

.tr-transform__scale-point--tl {
  top: -7px;
  left: -7px;
}

.tr-transform__scale-point--ml {
  top: calc(50% - 7px);
  left: -7px;
}

.tr-transform__scale-point--tr {
  left: calc(100% - 7px);
  top: -7px;
}

.tr-transform__scale-point--tm {
  left: calc(50% - 7px);
  top: -7px;
}

.tr-transform__scale-point--mr {
  left: calc(100% - 7px);
  top: calc(50% - 7px);
}

.tr-transform__scale-point--bl {
  left: -7px;
  top: calc(100% - 7px);
}

.tr-transform__scale-point--bm {
  left: calc(50% - 7px);
  top: calc(100% - 7px);
}

.tr-transform__scale-point--br {
  left: calc(100% - 7px);
  top: calc(100% - 7px);
}`;

const _FreeDragItem = (props: FreeDragItemProps) => {
  const {
    children,
    item,
    isEditMode,
    itemType,
    onEdit,
    onRemove,
    offset,
  } = props;
  const { updateFreeItemSize } = useActions(StrategicMapsActions);
  const rafRef = React.useRef(0);

  const position = {
    y: item.top,
    x: item.left,
    width: item.width,
    height: item.height,
    angle: item.angle || 0,
    scaleX: item.scaleX || 1,
    scaleY: item.scaleY || 1,
  };

  return (
    <>
      {isEditMode && <TransformStyle />}
      <FreeTransform
        {...position}
        offsetX={offset.x}
        offsetY={offset.y}
        onUpdate={(data: {
          x: number;
          y: number;
          angle: number;
          width: number;
          height: number;
        }) => {
          if (!isEditMode) {
            return;
          }
          const newPosition = {
            ...position,
            ...data,
          };
          cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(() => {
            updateFreeItemSize(itemType, {
              id: item.id,
              angle: newPosition.angle,
              left: newPosition.x,
              top: newPosition.y,
              width: newPosition.width,
              height: newPosition.height,
              scaleX: newPosition.scaleX,
              scaleY: newPosition.scaleY,
            });
          });
        }}
        classPrefix="tr"
        disableScale
      >
        {children}
        {(onEdit || onRemove) && isEditMode && (
          <MenuIcons>
            {onEdit && <i className="flaticon2-edit" onClick={onEdit} />}
            {onRemove && <i className="flaticon2-trash" onClick={onRemove} />}
          </MenuIcons>
        )}
      </FreeTransform>
    </>
  );
};

export const FreeDragItem = styled(_FreeDragItem)`
  && {
    border: none;
    overflow: visible;
  }

  ${props =>
    props.isEditMode &&
    css`
      cursor: move;
    `}

  .tr-transform__content {
    background: white;
    border: 1px dashed #ccc;
    z-index: 4;
  }

  .tr-transform__controls {
    z-index: 10;
  }
  .tr-transform__rotator {
    top: -45px;
    left: calc(50% - 7px);
    z-index: 5;
  }

  .tr-transform__rotator,
  .tr-transform__scale-point {
    z-index: 5;
    background: #fff;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    position: absolute;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
  .tr-transform__rotator:hover,
  .tr-transform__scale-point:hover {
    background: #f1f5f8;
  }
  .tr-transform__rotator:active,
  .tr-transform__scale-point:active {
    background: #dae1e7;
  }
  .tr-transform__scale-point {
  }

  .tr-transform__scale-point--tl {
    top: -7px;
    left: -7px;
  }

  .tr-transform__scale-point--ml {
    top: calc(50% - 7px);
    left: -7px;
  }

  .tr-transform__scale-point--tr {
    left: calc(100% - 7px);
    top: -7px;
  }

  .tr-transform__scale-point--tm {
    left: calc(50% - 7px);
    top: -7px;
  }

  .tr-transform__scale-point--mr {
    left: calc(100% - 7px);
    top: calc(50% - 7px);
  }

  .tr-transform__scale-point--bl {
    left: -7px;
    top: calc(100% - 7px);
  }

  .tr-transform__scale-point--bm {
    left: calc(50% - 7px);
    top: calc(100% - 7px);
  }

  .tr-transform__scale-point--br {
    left: calc(100% - 7px);
    top: calc(100% - 7px);
  }
`;
