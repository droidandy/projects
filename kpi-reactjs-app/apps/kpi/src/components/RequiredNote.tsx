import * as React from 'react';
import styled from 'styled-components';
import { Trans } from 'react-i18next';

interface RequiredNoteProps {
  className?: string;
}

const _RequiredNote = (props: RequiredNoteProps) => {
  const { className } = props;
  return (
    <div className={className}>
      <Trans>Fields marked by * are mandatory</Trans>
    </div>
  );
};

export const RequiredNote = styled(_RequiredNote)`
  display: block;
  font-style: italic;
  margin-top: 20px;
`;
