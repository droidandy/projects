import React from 'react';
import SC from 'styled-components';
import { Icon } from './icon';

const Container = SC.div`
  margin: 7px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Name = SC.div`
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 20px;
  color: #777777;
  margin-right: 7px;
  width: 50%;
  min-width: 150px;
`;

const Position = SC.div`
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 20px;
  color: #777777;
  opacity: 0.75;
  width: 50%;
  min-width: 150px;
`;

const Document = SC.div`
  margin: 0 20px 0 0;
`;

export const PersonRow = ({name, position}) => {
  return (
    <Container>
      <Document><Icon name="document" size="20" /></Document>
      {name && (<Name>{name}</Name>)}
      {position && (<Position>{position}</Position>)}
    </Container>
  );
};
