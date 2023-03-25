import { useActions } from 'typeless';
import React from 'react';
import { SidePanel } from 'src/components/SidePanel';
import { EntitySidePanelHeader } from '../../../components/EntitySidePanelHeader';
import styled from 'styled-components';
import { getCommentsState, CommentsActions } from '../interface';
import { useComments } from '../module';
import { MainCommentsContent } from './MainCommentsContent';

const Content = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  padding-bottom: 90px;
`;

export function CommentsSidePanel() {
  useComments();
  const { isVisible, entity } = getCommentsState.useState();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { close } = useActions(CommentsActions);

  const renderDetails = () => {
    if (!entity) {
      return null;
    }
    return (
      <Content style={{ paddingBottom: isExpanded ? 260 : 90 }}>
        <EntitySidePanelHeader entity={entity} />
        <MainCommentsContent setIsExpanded={setIsExpanded} />
      </Content>
    );
  };
  return (
    <SidePanel isOpen={isVisible} close={close}>
      {renderDetails()}
    </SidePanel>
  );
}
