import React from 'react';

import { Document as DocumentType } from '../types';

import * as s from './documentStyles';

type Props = {
  document: DocumentType;
};

export const Document = ({ document }: Props): JSX.Element => {
  return (
    <>
      <s.Wrapper>
        {document.image}
        <s.Column grow>
          <s.MainText>{document.name}</s.MainText>
          <s.SecondaryText>{document.sym}</s.SecondaryText>
        </s.Column>
        <s.Column grow>
          <s.MainText>{document.value}</s.MainText>
          <s.SecondaryText>{document.type}</s.SecondaryText>
        </s.Column>
        <s.Column align="flex-end">
          <s.MainText>
            {new Intl.DateTimeFormat('en-US').format(document.date)}
          </s.MainText>
          <s.SecondaryText>{document.status}</s.SecondaryText>
        </s.Column>
      </s.Wrapper>
      <s.Underline />
    </>
  );
};
