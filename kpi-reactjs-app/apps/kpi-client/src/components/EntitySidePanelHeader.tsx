import * as React from 'react';
import styled from 'styled-components';
import { BaseNamed } from 'src/types';
import { DisplayTransString } from 'src/components/DisplayTransString';

interface EntitySidePanelHeaderProps {
  className?: string;
  entity: BaseNamed;
}

const _EntitySidePanelHeader = (props: EntitySidePanelHeaderProps) => {
  const { className, entity } = props;
  return (
    <div className={className}>
      <h3>
        <DisplayTransString value={entity.name} />
      </h3>
      <p>
        <DisplayTransString value={entity.description} />
      </p>
    </div>
  );
};

export const EntitySidePanelHeader = styled(_EntitySidePanelHeader)`
  display: block;
  padding: 25px 30px;
  h3 {
    font-weight: bold;
    font-size: 18px;
    margin: 0;
  }
  p {
    font-size: 14px;
    color: #a7abc3;
    margin-top: 13px;
  }
`;
