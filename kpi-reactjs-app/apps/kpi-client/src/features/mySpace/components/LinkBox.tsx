import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'src/components/Link';

interface LinkBoxProps {
  className?: string;
  url: string;
  title: string;
  text: string;
  icon: React.ReactNode;
}

const Icon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  border: 50%;
  background: #0a73a5;
  padding: 0;
  position: absolute;
  top: -35px;
  left: calc(50% - 35px);
  border-radius: 50%;
`;

const Title = styled.span`
  color: #244159;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  margin-bottom: 10px;
`;

const Text = styled.span`
  line-height: 22px;
`;

const _LinkBox = (props: LinkBoxProps) => {
  const { className, url, title, text, icon } = props;
  return (
    <Link href={url} className={className}>
      <Icon>{icon}</Icon>
      <Title>{title}</Title>
      <Text>{text}</Text>
    </Link>
  );
};

export const LinkBox = styled(_LinkBox)`
  position: relative;
  display: flex;
  background: #ffffff;
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.03);
  border-radius: 3px;
  color: #728393;
  padding: 55px 18px 20px;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
`;
