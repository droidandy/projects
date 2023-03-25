import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'typeless-router';
import { Trans } from 'react-i18next';

interface RouteCardProps {
  className?: string;
  text: string;
  url: string;
}

const StyledLink = styled(Link)`
  border: 1px solid #e8e8e8;
  padding: 24px;
  box-shadow: 0px 0px 13px 0px rgba(82, 63, 105, 0.05);
  background-color: #ffffff;
  border-radius: 4px;
  font-size: 2em;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c7293;
  text-decoration: none;
`;

const _RouteCard = (props: RouteCardProps) => {
  const { className, text, url } = props;
  return (
    <div className={className}>
      <StyledLink href={url}>
        <Trans>{text}</Trans>
      </StyledLink>
    </div>
  );
};

export const RouteCard = styled(_RouteCard)`
  display: flex;
  text-align: center;
  padding-left: 15px;
  padding-right: 15px;
  margin-bottom: 30px;
  width: 50%;
  @media (min-width: 768px) {
    width: 25%;
  }
`;
