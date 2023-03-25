import React from 'react';
import Link from 'next/link';
import SC from 'styled-components';
import {Icon} from './icon';

const Container = SC.div`
  &:hover {
    cursor: pointer;
  }
  min-width: 160px;
  overflow: hidden;
`;

const Placeholder = SC.div`
  min-height: 160px;
  min-width: 160px;
  background: #F2F4FA;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Name = SC.div`
  margin: 20px 0 0 0;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 20px;
  color: #000000;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const Position = SC.div`
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 18px;
  color: #777777;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const SelfCard = ({name, position}) => {
  return (
    <Container>
      <Placeholder>
        <Icon name="logo" size="100" signColor="#DFE3F3" color="#DFE3F3" />
      </Placeholder>
      <div>
        {name && (<Name>{name}</Name>)}
        {position && (<Position>{position}</Position>)}
      </div>
    </Container>
  );
};
