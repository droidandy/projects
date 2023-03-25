import styled from 'styled-components';
import { rtlTextLeft } from 'shared/rtl';

export const Table = styled.table`
  width: 100%;
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.08);
  border-collapse: collapse;
`;

export const Th = styled.th`
  ${rtlTextLeft()};
  padding: 10px;
  border: none;
  background: #edf2fa;
  color: #6c7293;
  font-weight: 600;
  font-size: 14px;
`;
export const Td = styled.td`
  ${rtlTextLeft()};
  padding: 15px 10px;
  color: #6c7293;
  font-size: 14px;
  border: none;
  background: white;

  box-shadow: inset 0 1px 0 #f2f3f8;

  white-space: nowrap;
`;
