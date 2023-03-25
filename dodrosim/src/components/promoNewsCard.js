import React from 'react';
import Link from 'next/link';
import SC from 'styled-components';
import { maxDevice } from '../theme';

const Container = SC.div`
  &:hover {
    cursor: pointer;
  }
  overflow: hidden;
  padding: 15px 10px 10px 10px;
`;

const Label = SC.div`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
  color: #333E66;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
`;

const Date = SC.div`
  font-style: normal;
  font-weight: bold;
  font-size: 10px;
  line-height: 13px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #777777;
  margin: 10px 0px;
    overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;

export const PromoNewsCard = ({label, date, href}) => {
  return (
    <Link passHref href={href}>
      <Container>
        {date && (<Date>{date}</Date>)}
        <a>
          {label && (<Label>{label}</Label>)}
        </a>
      </Container>
    </Link>
  );
};
