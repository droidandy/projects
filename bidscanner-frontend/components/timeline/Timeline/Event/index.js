// @flow
import React from 'react';
import styled from 'styled-components';


type EventProps = { text: string };

const Circle = styled.span`
  display: inline-block;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  background-color: #BCBEC0;
  margin-right: 16px; 
`;

export default ({ text }: EventProps) => (
  <div>
    <Circle />
    {text}
  </div>
);
