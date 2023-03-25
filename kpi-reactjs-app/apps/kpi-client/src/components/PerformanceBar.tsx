import styled from 'styled-components';
import { Colors } from 'src/Const';

interface PerformanceBarProps {
  color: string;
}

export const PerformanceBar = styled.div<PerformanceBarProps>`
  border-radius: 3px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  color: white;
  background: ${props => Colors[props.color]};
`;
