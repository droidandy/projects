import styled from 'styled-components';

interface TableProps {
  noMargin?: boolean;
}
export const Table = styled.div<TableProps>`
  background: #FFFFFF;
  box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.08);
  border-radius: 3px;
  width: 100%;
  margin-bottom: ${props => props.noMargin ? '0px' : '40px'};
`;