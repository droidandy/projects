// @flow
import React from 'react';
import styled from 'styled-components';

const MyFile = styled.div`
  font-size: 1em;
  margin-bottom: 0px;
  margin-top: 0.3rem;

  & > i {
    margin-right: 0.5rem;
  }
`;

export type FileT = {
  name: string,
  pathToFile: string
};

export default ({ name, pathToFile }: FileT) => (
  <MyFile>
    <i className="fa fa-file-o" aria-hidden="true" />
    <a href={pathToFile} download={name}>{name}</a>
  </MyFile>
);
