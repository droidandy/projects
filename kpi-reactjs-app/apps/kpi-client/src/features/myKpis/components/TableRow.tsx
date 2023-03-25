import styled from 'styled-components';
import { BaseTableRow } from 'src/components/BaseTableRow';

const DEFAULT_WIDTH = 130;

export const TableRow = styled(BaseTableRow)`
  & > div {
    flex-shrink: 0;
    width: ${DEFAULT_WIDTH}px;
  }

  & > :nth-child(1) {
    flex: 1 0 0;
  }
`;
