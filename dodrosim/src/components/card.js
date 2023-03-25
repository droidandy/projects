import React from 'react';
import Link from 'next/link';
import SC from 'styled-components';
import {Icon} from './icon';

const Container = SC.div`
  &:hover {
    cursor: pointer;
  }
  min-width: 160px;
  height: 160px;
  background: #FFFFFF;
  border: 1px solid #DFE3F3;
  box-sizing: border-box;
  border-radius: 3px;
  overflow: hidden;
  padding: 15px 10px 10px 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Label = SC.div`
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 18px;
  color: #777777;
  // white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
`;

export const Card = ({label, type, ...props}) => {
  return (
    <Link passHref {...props}>
      <div>
        <Container>
          <Icon name={type || 'download'} size="18" color="#008E5B" />
          <a>
            {label && (<Label>{label}</Label>)}
          </a>
        </Container>
      </div>
    </Link>
  );
};
