import React from 'react';
import styled from 'styled-components';

interface HeaderItemProps{
  children: React.ReactNode;
  color: string;
  text: string;
}

const Content = styled.div`
  display: flex;
  height: 70px;
  flex-direction: column;
  place-items: center;
  justify-content: space-between;
  padding-left: 25px;
  padding-right: 25px;
`;

const Label = styled.label`
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;
  text-align: center;
`;

export const HeaderItem = (props: HeaderItemProps) => {
  const {children, color, text} = props;

  return (
    <Content style={{ color }}>
      {children}
      <Label>{text}</Label>
    </Content>
  )
};
