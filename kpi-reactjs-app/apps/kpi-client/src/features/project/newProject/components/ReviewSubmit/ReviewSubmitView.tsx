import React, { useState } from 'react'
import { useActions } from 'typeless';
import { useTranslation } from 'react-i18next';
import { NewProjectActions, getNewProjectState } from '../../interface';
import { PencilIcon } from '../../../icons'
import { Table, TableRow } from '../../../common/Table';
import { 
  IconButton,
  Col,
  RightHeader,
  SubRightHeader,
  TableContent,
  TableBody,
  TableHeader,
  TableSubHeader,
  TableFooter,
  TableForm,
  SingleArrowIcon,
  StateLabel,
} from '../../../common/style';
import { getCommunicationSetting } from '../ProjectPhases/const';
import { 
  EditButton,
  LeftLabel,
  RightLabel,
} from './style';
import {
  formatDate,
  getUserManagementSetting,
  getMainPhaseSetting,
  getBudgetPlanSetting,
  getOtherResourcesSetting,
  getRisksSetting,
  getChangeManagementSetting,
} from './const';

export const ReviewSubmitView = () => {
  const { t } = useTranslation();
  const { 
    cancel, 
    submit,
    setCurrentStep,
  } = useActions(NewProjectActions);
  const { 
    projectDetails,
    userManagement,
    projectPhases,
    projectResources,
    projectRisks,
    changeManagement,
  } = getNewProjectState.useState();
  const [ showSettings, setShowSettings ] = useState({
    showComSetup: true,
    showComDuring: true,
    showComPost: true,
  });  

  return (
    <TableContent>
      <TableForm
        onSubmit={e => {
          e.preventDefault();
          submit();
        }}
      >
        <TableBody>
          <Col>
            <RightHeader>{t('Review your Details and Submit')}</RightHeader>
          </Col>

          <>
            <Col>
              <SubRightHeader>
                <EditButton
                  width="70px"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentStep('project-details');
                  }}
                >
                  {t('Edit')}
                  <PencilIcon />
                </EditButton>
                {'01 ' + t('Project Details')}
              </SubRightHeader>
            </Col>
            <Col>
              <RightLabel>{':' + t('Project Name')}</RightLabel>
              <LeftLabel>{projectDetails.name}</LeftLabel>
            </Col>
            <Col>
              <RightLabel>{':' + t('Project Description')}</RightLabel>
              <LeftLabel dangerouslySetInnerHTML={{__html: projectDetails.description}} />
            </Col>
            <Col>
              <RightLabel>{':' + t('Project Budget')}</RightLabel>
              <LeftLabel>{projectDetails.budget}</LeftLabel>
            </Col>
            <Col>
              <RightLabel>{':' + t('Start Date')}</RightLabel>
              <LeftLabel>{formatDate(projectDetails.startDate)}</LeftLabel>
            </Col>
            <Col>
              <RightLabel>{':' + t('End Date')}</RightLabel>
              <LeftLabel>{formatDate(projectDetails.endDate)}</LeftLabel>
            </Col>
            <Col>
              <RightLabel>{':' + t('Project Objectives')}</RightLabel>
              <LeftLabel>
                {
                  projectDetails.objectives.map( (value, index) => {
                    return (
                      <p key={index}> {value} </p>
                    )
                  })
                }
              </LeftLabel>
            </Col>
            <Col>
              <RightLabel>{':' + t('Innovation Factor of this project')}</RightLabel>
              <LeftLabel dangerouslySetInnerHTML={{__html: projectDetails.state.replace(/\n/g, '<br>')}} />
            </Col>
            <Col>
              <RightLabel>{':' + t('Requirements and specifications')}</RightLabel>
              <LeftLabel>
                {
                  projectDetails.specs.map( (value, index) => {
                    return (
                      <p key={index}> {value} </p>
                    )
                  })
                }
              </LeftLabel>
            </Col>
            <Col>
              <RightLabel>{':' + t('Existing or Potential Challenges')}</RightLabel>
              <LeftLabel>
                {
                  projectDetails.challenges.map( (value, index) => {
                    return (
                      <p key={index}> {value} </p>
                    )
                  })
                }
              </LeftLabel>
            </Col>
            <Col>
              <RightLabel>{':' + t('Related Projects')}</RightLabel>
              <LeftLabel>
                {
                  projectDetails.relProjects.map( (value) => value.label ).join(', ')
                }
              </LeftLabel>
            </Col>
          </>

          <>
            <Col>
              <SubRightHeader>
                <EditButton
                  width="70px"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentStep('user-management');
                  }}
                >
                  {t('Edit')}
                  <PencilIcon />
                </EditButton>
                {'02 ' + t('User Management')}
              </SubRightHeader>
            </Col>
            <Col>
              <RightLabel>{':' + t('Project Owner')}</RightLabel>
              <LeftLabel>{userManagement.owner}</LeftLabel>
            </Col>
            <Col>
              <RightLabel>{':' + t('Project Manager')}</RightLabel>
              <LeftLabel>{userManagement.manager}</LeftLabel>
            </Col>
            <Col width={6}>
              <Table noMargin>
                <TableHeader>
                  {t('Project Members')}
                </TableHeader>
                <TableRow 
                  background="#F7F9FC"
                  fontWeight="bold"
                  headers={
                  getUserManagementSetting([
                    t('Username/Department'),
                    t('Role'),
                  ])
                }/>
                {
                  userManagement.members && userManagement.members.map(
                    (value, index) => {
                      return (
                        <TableRow
                          key={value.id}
                          headers={
                            getUserManagementSetting([
                              t(value.username),
                              t(value.role)
                            ])
                          }
                        />
                      );
                    }
                  )
                }
              </Table>
            </Col>
          </>

          <>
            <Col>
              <SubRightHeader>
                <EditButton
                  width="70px"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentStep('project-phases');
                  }}
                >
                  {t('Edit')}
                  <PencilIcon />
                </EditButton>
                {'03 ' + t('Project Phases')}
              </SubRightHeader>
            </Col>
            <Col>
              <Table noMargin>
                <TableHeader>
                  {t('Project Main Phases')}
                </TableHeader>
                <TableRow 
                  background="#F7F9FC"
                  fontWeight="bold"
                  headers={
                  getMainPhaseSetting([
                    '* ' + t('Phase name'),
                    '* ' + t('Start Date'),
                    '* ' + t('End Date'),
                    '* ' + t('Outcome'),
                    t('Notes'),
                  ])
                }/>
                {
                  projectPhases.mainPhases && projectPhases.mainPhases.map(
                    (value) => {
                      return (
                        <TableRow
                          key={value.id}
                          headers={
                            getMainPhaseSetting([
                              value.name,
                              formatDate(value.startDate),
                              formatDate(value.endDate),
                              value.outcome,
                              value.comment
                            ])
                          }
                        />
                      );
                    }
                  )
                }
              </Table>
            </Col>
            <Col>
              <Table noMargin>
                <TableHeader>
                  {t('Project Communication Plan')}
                </TableHeader>
                <TableRow 
                  background="#F7F9FC"
                  fontWeight="bold"
                  headers={
                  getCommunicationSetting([
                    t('Message'),
                    t('Target Audience'),
                    t('Communication channel'),
                    t('Frequency'),
                    t('Efficiency measurement'),
                  ])
                }/>
                <TableSubHeader onClick={() => setShowSettings({ ...showSettings, showComSetup: !showSettings.showComSetup})}>
                  {t('Project Setup')}
                  <SingleArrowIcon direction={showSettings.showComSetup ? 'up' : 'down'} />
                </TableSubHeader>
                {
                  showSettings.showComSetup && projectPhases.communication.setup && projectPhases.communication.setup.map(
                    (value) => {
                      return (
                        <TableRow
                          key={value.id}
                          headers={
                            getCommunicationSetting([
                              value.message,
                              value.audience,
                              value.channel ? value.channel.label : '',
                              value.frequency ? value.frequency.label : '',
                              value.efficiency,
                            ])
                          }
                        />
                      );
                    }
                  )
                }
                <TableSubHeader onClick={() => setShowSettings({ ...showSettings, showComDuring: !showSettings.showComDuring})}>
                  {t('During execution/Implementation')}
                  <SingleArrowIcon direction={showSettings.showComDuring ? 'up' : 'down'} />
                </TableSubHeader>
                {
                  showSettings.showComDuring && projectPhases.communication.during && projectPhases.communication.during.map(
                    (value) => {
                      return (
                        <TableRow
                          key={value.id}
                          headers={
                            getCommunicationSetting([
                              value.message,
                              value.audience,
                              value.channel ? value.channel.label : '',
                              value.frequency ? value.frequency.label : '',
                              value.efficiency,
                            ])
                          }
                        />
                      );
                    }
                  )
                }
                <TableSubHeader onClick={() => setShowSettings({ ...showSettings, showComPost: !showSettings.showComPost})}>
                  {t('Post Implementation')}
                  <SingleArrowIcon direction={showSettings.showComPost ? 'up' : 'down'} />
                </TableSubHeader>
                {
                  showSettings.showComPost && projectPhases.communication.post && projectPhases.communication.post.map(
                    (value) => {
                      return (
                        <TableRow
                          key={value.id}
                          headers={
                            getCommunicationSetting([
                              value.message,
                              value.audience,
                              value.channel ? value.channel.label : '',
                              value.frequency ? value.frequency.label : '',
                              value.efficiency,
                            ])
                          }
                        />
                      );
                    }
                  )
                }
              </Table>
            </Col>
          </>

          <>
            <Col>
              <SubRightHeader>
                <EditButton
                  width="70px"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentStep('project-resources');
                  }}
                >
                  {t('Edit')}
                  <PencilIcon />
                </EditButton>
                {'04 ' + t('Project Resources')}
              </SubRightHeader>
            </Col>
            <Col>
              <Table noMargin>
                <TableHeader>
                  {t('Budget planning table')}
                </TableHeader>
                <TableRow 
                  background="#F7F9FC"
                  fontWeight="bold"
                  headers={
                    getBudgetPlanSetting([
                      '* ' + t('Phase/Activity'),
                      '* ' + t('Details'),
                      t('Financial Item'),
                      t('Main Budget'),
                      t('Extra Cost'),
                      t('Total Cost'),
                      t('Payment Procedure'),
                      t('Timeline'),
                      t('Comment'),
                    ])
                  }
                />
                {
                  projectResources.budgetPlans && projectResources.budgetPlans.map( (value) => {
                    return (
                      <TableRow key={value.id} headers={
                        getBudgetPlanSetting([
                          value.activity ? value.activity.label : '',
                          value.details,
                          value.financialItem,
                          value.mainBudget,
                          value.extraCost,
                          value.totalCost,
                          value.paymentProc ? value.paymentProc.label : '',
                          formatDate(value.timeline[0]) + ' ~ ' + formatDate(value.timeline[1]),
                          value.comment
                        ])
                      } />
                    )
                  })
                }
              </Table>
            </Col>
            <Col>
              <Table noMargin>
                <TableHeader>
                  {t('Other Resources')}
                </TableHeader>
                <TableRow 
                  background="#F7F9FC"
                  fontWeight="bold"
                  headers={
                    getOtherResourcesSetting([
                      '* ' + t('Phase/Activity'),
                      t('Resource'),
                      t('Details'),
                      t('Main Budget'),
                      t('Notes'),
                    ])
                  }
                />
                {
                  projectResources.otherResources && projectResources.otherResources.map( (value) => {
                    return (
                      <TableRow key={value.id} headers={
                        getOtherResourcesSetting([
                          value.activity ? value.activity.label : '',
                          value.resource ? value.resource.label : '',
                          value.details,
                          value.mainBudget,
                          value.comment,
                        ])
                      } />
                    )
                  })
                }
              </Table>
            </Col>
          </>

          <>
            <Col>
              <SubRightHeader>
                <EditButton
                  width="70px"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentStep('project-risks');
                  }}
                >
                  {t('Edit')}
                  <PencilIcon />
                </EditButton>
                {'05 ' + t('Project Risks')}
              </SubRightHeader>
            </Col>
            <Col>
              <Table noMargin>
                <TableHeader>
                  {t('Risk Management')}
                </TableHeader>
                <TableRow 
                  background="#F7F9FC"
                  fontWeight="bold"
                  headers={
                    getRisksSetting([
                      '* ' + t('Phase/Activity'),
                      t('Risk Type'),
                      t('Description'),
                      t('Probability'),
                      t('Impact'),
                      t('Risk Index'),
                      t('Counter Measures'),
                      t('Responsibility'),
                      t('Timeline'),
                    ])
                  }
                />
                {
                  projectRisks.risks && projectRisks.risks.map( (value) => {
                    return (
                      <TableRow key={value.id} headers={
                        getRisksSetting([
                          value.activity ? value.activity.label : '',
                          value.type ? value.type.label : '',
                          value.description,
                          value.probability ? value.probability.label : '',
                          value.impact ? value.impact.label : '',
                          <StateLabel state={value.probability.value * value.impact.value} >
                            {value.probability.value * value.impact.value}
                          </StateLabel>,
                          value.counterMeasures.map( value => value.label ).join(', '),
                          value.responsibility ? value.responsibility.label : '',
                          formatDate(value.timeline[0]) + ' ~ ' + formatDate(value.timeline[1]),
                        ])
                      } />
                    )
                  })
                }
              </Table>
            </Col>
          </>

          <>
            <Col>
              <SubRightHeader>
                <EditButton
                  width="70px"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentStep('change-management');
                  }}
                >
                  {t('Edit')}
                  <PencilIcon />
                </EditButton>
                {'06 ' + t('Change Management')}
              </SubRightHeader>
            </Col>
            <Col>
              <Table noMargin>
                <TableHeader>
                  {t('Change Management')}
                </TableHeader>
                <TableRow 
                  background="#F7F9FC"
                  fontWeight="bold"
                  headers={
                    getChangeManagementSetting([
                      t('Need for Change'),
                      t('Description'),
                      t('Change Scope'),
                      t('Affected Parties'),
                      t('Required Action'),
                      t('Timeline'),
                    ])
                  }
                />
                {
                  changeManagement.changeManagements && changeManagement.changeManagements.map( (value) => {
                    return (
                      <TableRow key={value.id} headers={
                        getChangeManagementSetting([
                          value.needForChange,
                          value.description,
                          value.changeScope ? value.changeScope.label : '',
                          value.affectedParties ? value.affectedParties.label: '',
                          value.requiredAction.map( value => value.label ).join(', '),
                          formatDate(value.timeline[0]) + ' ~ ' + formatDate(value.timeline[1]),
                        ])
                      } />
                    )
                  })
                }
              </Table>
            </Col>
          </>
        </TableBody>
        <TableFooter>
          <Col width={6}>
            <IconButton
              styling="secondary"
              onClick={(e) => {
                e.preventDefault();
                cancel();
              }}
            >
              {t('Cancel')}
            </IconButton>
            <IconButton
              styling="primary"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              {t('Save Draft')}
            </IconButton>
          </Col>
          <Col width={6} direction="ltr">
            <IconButton type="submit" styling="primary">
              {t('Submit')}
            </IconButton>
          </Col>
        </TableFooter>
      </TableForm>
    </TableContent>
  );
};
