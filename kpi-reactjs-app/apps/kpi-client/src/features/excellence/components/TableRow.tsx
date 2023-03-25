import styled from 'styled-components';
import { BaseTableRow } from 'src/components/BaseTableRow';

const DEFAULT_WIDTH = 130;

export const TableRow = styled(BaseTableRow)`
  & > div {
    flex-shrink: 0;
  }

  & > :nth-child(1) {
    width: 60px;
  }
  & > :nth-child(2) {
    flex: 1 0 0;
  }
  & > :nth-child(3) {
    width: 160px;
  }
  & > :nth-child(4) {
    width: ${DEFAULT_WIDTH}px;
  }
  & > :nth-child(5) {
    width: 120px;
  }
  & > :nth-child(6) {
    width: 100px;
  }
`;
