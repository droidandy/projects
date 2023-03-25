import { DragHandleType } from 'src/types';
import styled, { css } from 'styled-components';

const HANDLE_SIZE = 8;
const HANDLE_DIFF = `${-HANDLE_SIZE / 2}px`;

interface HandleProps {
  type: DragHandleType;
  visible: boolean;
}

export const ResizeHandle = styled.div<HandleProps>`
  width: ${HANDLE_SIZE}px;
  height: ${HANDLE_SIZE}px;
  background: #666;
  position: absolute;
  cursor: ne-resize;
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
  ${props => {
    switch (props.type) {
      case 'nw':
        return css`
          left: ${HANDLE_DIFF};
          top: ${HANDLE_DIFF};
          cursor: nw-resize;
        `;
      case 'ne':
        return css`
          right: ${HANDLE_DIFF};
          top: ${HANDLE_DIFF};
          cursor: ne-resize;
        `;
      case 'sw':
        return css`
          left: ${HANDLE_DIFF};
          bottom: ${HANDLE_DIFF};
          cursor: sw-resize;
        `;
      case 'se':
        return css`
          right: ${HANDLE_DIFF};
          bottom: ${HANDLE_DIFF};
          cursor: se-resize;
        `;
      default:
        return null;
    }
  }};
`;
