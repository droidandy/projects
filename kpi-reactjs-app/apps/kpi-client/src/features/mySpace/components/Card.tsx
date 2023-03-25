import * as React from 'react';
import styled from 'styled-components';

const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 30px;
`;

const Content = styled.div``;

interface CardProps {
  className?: string;
  title: React.ReactNode;
  children: React.ReactNode;
}

const _Card = (props: CardProps) => {
  const { className, title, children } = props;
  return (
    <div className={className}>
      <Title>{title}</Title>
      <Content>{children}</Content>
    </div>
  );
};

export const Card = styled(_Card)`
  display: block;
  padding: 25px 30px 20px 30px;
  background: #ffffff;
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.03);
  border-radius: 0px 0px 3px 3px;
  height: 100%;
`;
