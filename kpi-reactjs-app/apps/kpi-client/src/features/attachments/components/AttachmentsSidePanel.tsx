import { useActions } from 'typeless';
import React from 'react';
import { SidePanel } from 'src/components/SidePanel';
import styled from 'styled-components';
import { EntitySidePanelHeader } from '../../../components/EntitySidePanelHeader';
import Skeleton from 'react-skeleton-loader';
import { AttachedFiles } from '../../../components/AttachedFiles';
import { AttachFilesSection } from './AttachFilesSection';
import { NoAttachments } from './NoAttachments';
import { useAttachments } from '../module';
import { getAttachmentsState, AttachmentsActions } from '../interface';

const Content = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`;

const SkeletonWrapper = styled.div`
  padding: 30px;
`;

export function AttachmentsSidePanel() {
  useAttachments();
  const {
    isVisible,
    entity,
    files,
    isLoading,
  } = getAttachmentsState.useState();
  const { close } = useActions(AttachmentsActions);

  const renderDetails = () => {
    if (!entity) {
      return null;
    }
    return (
      <Content>
        <EntitySidePanelHeader entity={entity} />
        {isLoading ? (
          <SkeletonWrapper>
            <Skeleton height={'13px'} count={10} width="80%" />
          </SkeletonWrapper>
        ) : (
          <>
            {files.length ? (
              <AttachedFiles files={files} withDate />
            ) : (
              <NoAttachments />
            )}
            <AttachFilesSection />
          </>
        )}
      </Content>
    );
  };

  return (
    <SidePanel isOpen={isVisible} close={close}>
      {renderDetails()}
    </SidePanel>
  );
}
