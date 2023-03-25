import * as React from 'react';
import styled from 'styled-components';
import { WarningIcon } from 'src/icons/WarningIcon';

interface AlertBoxProps {
  className?: string;
  title: string;
  description: string;
}

const Left = styled.div`
  margin-left: 20px;
`;
const Right = styled.div``;
const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
`;
const Desc = styled.div`
  font-weight: 600;
  font-size: 14px;
  margin-top: 15px;
`;

const _AlertBox = (props: AlertBoxProps) => {
  const { className, title, description } = props;
  return (
    <div className={className}>
      <Left>
        <WarningIcon />
      </Left>
      <Right>
        <Title>{title}</Title>
        <Desc>{description}</Desc>
      </Right>
    </div>
  );
};

export const AlertBox = styled(_AlertBox)`
  display: flex;
  background: #fead33;
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.03);
  color: white;
  padding: 30px;
`;
