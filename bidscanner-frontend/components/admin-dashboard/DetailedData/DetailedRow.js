// @flow
import React from 'react';
import styled from 'styled-components';

const Label = styled.span`color: #bcbec0;`;

export default props => {
  const { label, children } = props;

  return (
    <div>
      <Label>{label}:</Label> {children}
    </div>
  );
};
