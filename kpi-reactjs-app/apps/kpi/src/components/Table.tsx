import styled from 'styled-components';
import { rtlTextLeft } from 'shared/rtl';

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  tbody tr:nth-of-type(odd) {
    td,
    th {
      background-color: #f7f8fa;
    }
  }
  tbody tr:nth-of-type(even) {
    td,
    th {
      background-color: white;
    }
  }
`;

export const Th = styled.th`
  ${rtlTextLeft()};
  padding: 8px 10px;
  border: none;
  background-color: #f0f3ff;

  box-shadow: inset 0 1px 0 #f0f3ff, inset 0 -1px 0 #f0f3ff,
    inset 1px 0 0px #f0f3ff;

  &:last-child {
    width: 45px;
    box-shadow: inset 0 1px 0 #f0f3ff, inset 0 -1px 0 #f0f3ff,
      inset 1px 0 0px #f0f3ff, inset -1px 0 0px #f0f3ff;
  }

  i {
    font-size: 0.6rem;
    margin-left: 10px;
  }
`;
export const Td = styled.td`
  ${rtlTextLeft()};
  padding: 8px 10px;
  border: none;

  box-shadow: inset 0 1px 0 #f0f3ff, inset 0 -1px 0 #f0f3ff,
    inset 1px 0 0px #f0f3ff;

  &:last-child {
    width: 45px;
    box-shadow: inset 0 1px 0 #f0f3ff, inset 0 -1px 0 #f0f3ff,
      inset 1px 0 0px #f0f3ff, inset -1px 0 0px #f0f3ff;
  }

  white-space: nowrap;
`;
