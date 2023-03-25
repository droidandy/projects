import React from 'react';
import SC from 'styled-components';

const Container = SC.div`
  margin: 7px 0;
  display: flex;
  flex-direction: row;
  @media (max-width: 520px) {
    flex-direction: column;
  }
`;

const Name = SC.div`
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 20px;
  color: #777777;
  margin-right: 7px;
  width: 25%;
  @media (max-width: 520px) {
    width: auto;
  }
`;

const Text = SC.div`
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 20px;
  color: #000000;
  width: 75%;
  @media (max-width: 520px) {
    width: auto;
  }
`;

export const Row = ({name, text}) => {
  return (
    <Container>
      {name && (<Name>{name}</Name>)}
      {text && (<Text>{text}</Text>)}
    </Container>
  );
};
