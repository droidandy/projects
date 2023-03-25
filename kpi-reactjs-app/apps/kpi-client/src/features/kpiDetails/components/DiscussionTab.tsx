import React from 'react';
import styled from 'styled-components';
import { EmbeddedComments } from 'src/features/comments/components/EmbeddedComments';

interface DiscussionTabProps {
  className?: string;
}

const _DiscussionTab = (props: DiscussionTabProps) => {
  const { className } = props;
  const [isExpanded, setIsExpanded] = React.useState(false);
  return (
    <div className={className} style={{ paddingBottom: isExpanded ? 260 : 90 }}>
      <EmbeddedComments setIsExpanded={setIsExpanded} />
    </div>
  );
};

export const DiscussionTab = styled(_DiscussionTab)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
