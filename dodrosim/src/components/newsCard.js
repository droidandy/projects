import React from 'react';
import Link from 'next/link';
import SC from 'styled-components';

const Container = SC.div`
  &:hover {
    cursor: pointer;
  }
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 160px;
  background: #FFFFFF;
  border: 1px solid #DFE3F3;
  box-sizing: border-box;
  border-radius: 3px;
  margin: 15px 20px 15px 0;
  overflow: hidden;
  padding: 15px 10px 10px 10px;
`;

const Content = SC.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 10px 0 0;
`;

const Label = SC.div`
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 18px;
  color: #777777;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
`;

const Date = SC.div`
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  line-height: 13px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #777777;
`;

const ImageContent = SC.div`
  min-width: 130px;
  min-height: 130px;
  background-repeat: no-repeat;
  background-position: center; 
`;

export const NewsCard = ({label, date, url, href}) => {
  return (
    <Link passHref href={href}>
      <div>
        <Container>
          <Content>
            {date && (<Date>{date}</Date>)}
            <a>
              {label && (<Label>{label}</Label>)}
            </a>
          </Content>
          <ImageContent style={{ backgroundImage: `url(${url})` }} />
        </Container>
      </div>
    </Link>
  );
};
