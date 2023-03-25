import * as React from 'react';
import styled from 'styled-components';
import { Colors } from 'src/Const';

interface IndicatorCardProps {
  className?: string;
  color: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Indicator = styled.div`
  position: absolute;
  left: 5px;
  top: 5px;
  width: 14px;
  height: 14px;
  background: #fff;
  border-radius: 20px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
`;

const _IndicatorCard = (props: IndicatorCardProps) => {
  const { className, children, color, style } = props;
  return (
    <div className={className} style={style}>
      <Indicator style={{ background: Colors[color] }} />
      {children}
    </div>
  );
};

export const IndicatorCard = styled(_IndicatorCard)`
  position: relative;
  display: flex;
  flex-direction: column;
  background: #f7f9fc;
  border-radius: 3px;
  padding: 25px 20px;
  height: 100%;
`;
