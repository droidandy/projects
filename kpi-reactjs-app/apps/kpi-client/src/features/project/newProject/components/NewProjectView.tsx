import React from 'react';
import { getNewProjectState } from '../interface';
import { State } from '../const';
import { ProjectDetailsView } from './ProjectDetails/ProjectDetailsView';
import { UserManagementView } from './UserManagement/UserManagementView';
import { ProjectPhasesView } from './ProjectPhases/ProjectPhasesView';
import { ProjectResourcesView } from './ProjectResources/ProjectResourcesView';
import { ProjectRisksView } from './ProjectRisks/ProjectRisksView';
import { ChangeManagementView } from './ChangeManagement/ChangeManagementView';
import { ReviewSubmitView } from './ReviewSubmit/ReviewSubmitView';
import { HeaderView } from './Header';
import { Content, Container } from './style';

export const NewProjectView = () => {
  const { currentStep } = getNewProjectState.useState();

  return (
    <Content>
      <Container>
        <HeaderView />
        {currentStep === State.ProjectDetails && <ProjectDetailsView /> }
        {currentStep === State.UserManagement && <UserManagementView /> }
        {currentStep === State.ProjectPhases && <ProjectPhasesView /> }
        {currentStep === State.ProjectResources && <ProjectResourcesView /> }
        {currentStep === State.ProjectRisks && <ProjectRisksView /> }
        {currentStep === State.ChangeManagement && <ChangeManagementView /> }
        {currentStep === State.ReviewSubmit && <ReviewSubmitView /> }
      </Container>
    </Content>
  )

};
