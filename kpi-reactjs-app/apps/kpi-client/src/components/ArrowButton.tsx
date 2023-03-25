import * as React from 'react';
import styled from 'styled-components';
import { ArrowIcon } from './ArrowIcon';

interface ArrowButtonProps {
  className?: string;
  children: React.ReactNode;
  onLeft?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onRight?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Left = styled.div`
  width: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  flex-grow: 0;
  flex-shrink: 0;
  &:hover {
    background: #efefef;
  }
`;
const Mid = styled.div`
  border-right: 1px solid #dee1e9;
  border-left: 1px solid #dee1e9;
  padding: 9px 32px;
  white-space: pre;
  flex: 1 0 auto;
  text-align: center;
  &:hover {
    background: #efefef;
  }
`;
const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  user-select: none;
  flex-grow: 0;
  flex-shrink: 0;
  &:hover {
    background: #efefef;
  }
`;

const _ArrowButton = (props: ArrowButtonProps) => {
  const { className, children, onClick, onLeft, onRight } = props;
  return (
    <div className={className}>
      <Right onClick={onLeft}>
        <ArrowIcon color="#dee1e9" direction="right" />
      </Right>
      <Mid onClick={onClick}>{children}</Mid>
      <Left onClick={onRight}>
        <ArrowIcon color="#dee1e9" direction="left" />
      </Left>
    </div>
  );
};

export const ArrowButton = styled(_ArrowButton)`
  display: flex;
  border: 1px solid #dee1e9;
  border-radius: 3px;
  height: 40px;
  cursor: pointer;
  width: 100%;
`;
