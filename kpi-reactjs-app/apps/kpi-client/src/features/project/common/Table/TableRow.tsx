import React from 'react'
import styled from 'styled-components';
import { BaseTableRow } from 'src/components/BaseTableRow';

interface TableRowSetting {
  value: any,
  width: string,
  align: string,
  padding?: string,
}

interface TableRowProps {
  headers: TableRowSetting[],
  background?: string,
  color?: string,
  height?: string,
  fontWeight?: string,
}

const Cell = styled.div<{ 
  align: string, 
  width: string, 
  padding?: string,
}>`
  text-align: ${props => props.align};
  width: ${props => props.width};
  padding: 0px ${props => props.padding ? props.padding : '10px'};
  position: relative;
  display: flex;
  flex-direction: column;
`;

interface RowProps {
  background?: string,
  color?: string,
  height?: string,
  fontWeight?: string, 
}
const StyledTableRow = styled(BaseTableRow)<RowProps>`
  border-bottom: 1px solid #F2F3F8;
  min-height: ${props => props.height ? props.height : '60px'};
  background: ${props => props.background ? props.background : 'white'};
  color: ${props => props.color ? props.color : ''};
  font-weight: ${props => props.fontWeight};
  padding: 0px 20px;
  place-items: center;
`;

export const TableRow = (props: TableRowProps) => {
  const { headers, background, height, color, fontWeight } = props;
  return (
    <StyledTableRow background={background} height={height} color={color} fontWeight={fontWeight}>
      {
        headers.map( (value, index) => {
          return (
            <Cell
              key={index}
              align={value.align}
              width={value.width}
              padding={value.padding}
            >
              {value.value}
            </Cell>
          );
        })
      }
    </StyledTableRow>
  );
}