import React from 'react';
import Link from 'next/link';
import SC from 'styled-components';

const Container = SC.div`
  &:hover {
    cursor: pointer;
  }
  padding: 15px 10px 10px 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 160px;
  background: #FFFFFF;
  border: 1px solid #DFE3F3;
  box-sizing: border-box;
  border-radius: 3px;
  overflow: hidden;
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

const Category = SC.div`
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  line-height: 13px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #777777;
`;

export const VacancyCard = ({label, category, ...props}) => {
  return (
    <Link passHref {...props}>
      <div>
        <Container>
          {category && (<Category>{category}</Category>)}
          <a>
            {label && (<Label>{label}</Label>)}
          </a>
        </Container>
      </div>
    </Link>
  );
};
