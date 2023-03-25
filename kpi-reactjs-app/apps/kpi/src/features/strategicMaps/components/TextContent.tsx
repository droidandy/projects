import * as React from 'react';
import styled from 'styled-components';
import { DisplayTransHtml } from 'src/components/DisplayTransHtml';

interface TextContentProps {
  className?: string;
  html: string;
}

const _TextContent = (props: TextContentProps) => {
  const { className, html } = props;
  return (
    <div className={className}>
      <DisplayTransHtml value={html} />
    </div>
  );
};

export const TextContent = styled(_TextContent)`
  padding: 8px 15px;
`;
