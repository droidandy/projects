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
  & > :nth-child(2) {
    width: 160px;
  }
  & > :nth-child(3) {
    width: 160px;
  }
  & > :nth-child(5) {
    width: 120px;
  }
  & > :last-child {
    width: 100px;
  }
`;
