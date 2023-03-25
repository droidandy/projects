import React, { useState } from 'react'
import { useActions } from 'typeless';
import { useTranslation } from 'react-i18next';
import { RocketIcon } from 'src/icons/RocketIcon';
import { CancelIcon } from 'src/icons/CancelIcon';
import { ProjectReviewAction, getProjectReviewState } from '../../interface';
import { Table, TableRow } from '../../../common/Table';
import { Input } from '../../../common/FormInput/Input';
import { 
  IconButton,
  Col,
  TableContent,
  TableHeader,
  TableSubHeader,
  TableForm,
  SingleArrowIcon,
  StateLabel,
} from '../../../common/style';
import { 
  LeftLabel,
  RightLabel,
  ReviewTableBody,
  ReviewTableTitle,
  TableFooter,
} from './style';
import {
  formatDate,
  getUserManagementSetting,
  getMainPhaseSetting,
  getBudgetPlanSetting,
  getOtherResourcesSetting,
  getRisksSetting,
  getChangeManagementSetting,
  getCommunicationSetting
} from './const';

export const ReviewCharterView = () => {
  const { t } = useTranslation();
  const { 
    project,
    review,
  } = getProjectReviewState.useState();
  const {
    projectDetails,
    userManagement,
    projectPhases,
    projectResources,
    projectRisks,
    changeManagement,
  } = project;

  console.log(projectRisks);
  const { 
    approve,
    reject,
    changeReview,
  } = useActions(ProjectReviewAction);
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
        }}
      >
        <ReviewTableBody>
          <>
            <Col>
              <ReviewTableTitle title={t('Project Details')}/>
            </Col>
            <Col>
              <RightLabel>{t('Project Name') + ':'}</RightLabel>
              <LeftLabel>{projectDetails.name}</LeftLabel>
            </Col>
            <Col>
              <RightLabel>{t('Project Description') + ':'}</RightLabel>
              <LeftLabel dangerouslySetInnerHTML={{__html: projectDetails.description}} />
            </Col>
            <Col>
              <RightLabel>{t('Project Budget') + ':'}</RightLabel>
              <LeftLabel>{projectDetails.budget}</LeftLabel>
            </Col>
            <Col>
              <RightLabel>{t('Start Date') + ':'}</RightLabel>
              <LeftLabel>{formatDate(projectDetails.startDate)}</LeftLabel>
            </Col>
            <Col>
              <RightLabel>{t('End Date') + ':'}</RightLabel>
              <LeftLabel>{formatDate(projectDetails.endDate)}</LeftLabel>
            </Col>
            <Col>
              <RightLabel>{t('Project Objectives') + ':'}</RightLabel>
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
              <RightLabel>{t('Innovation Factor of this project') + ':'}</RightLabel>
              <LeftLabel dangerouslySetInnerHTML={{__html: projectDetails.state.replace(/\n/g, '<br>')}} />
            </Col>
            <Col>
              <RightLabel>{t('Requirements and specifications') + ':'}</RightLabel>
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
              <RightLabel>{t('Existing or Potential Challenges') + ':'}</RightLabel>
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
              <RightLabel>{t('Related Projects') + ':'}</RightLabel>
              <LeftLabel>
                {
                  projectDetails.relProjects.map( (value) => value ).join(', ')
                }
              </LeftLabel>
            </Col>
          </>

          <>
            <Col>
              <ReviewTableTitle title={t('User Management')}/>
            </Col>
            <Col>
              <RightLabel>{t('Project Owner') + ':'}</RightLabel>
              <LeftLabel>{userManagement.owner}</LeftLabel>
            </Col>
            <Col>
              <RightLabel>{t('Project Manager') + ':'}</RightLabel>
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
                    t('Department'),
                    t('Username'),
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
                              t(value.department),
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
              <ReviewTableTitle title={t('Project Phases')}/>
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
                              value.channel ? value.channel : '',
                              value.frequency ? value.frequency : '',
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
                              value.channel ? value.channel : '',
                              value.frequency ? value.frequency : '',
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
                              value.channel ? value.channel : '',
                              value.frequency ? value.frequency : '',
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
              <ReviewTableTitle title={t('Project Resources')}/>
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
                          value.activity ? value.activity : '',
                          value.details,
                          value.financialItem,
                          value.mainBudget,
                          value.extraCost,
                          value.totalCost,
                          value.paymentProc ? value.paymentProc : '',
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
                          value.activity ? value.activity : '',
                          value.resource ? value.resource : '',
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
              <ReviewTableTitle title={t('Project Risks')}/>
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
                          value.activity ? value.activity : '',
                          value.type ? value.type : '',
                          value.description,
                          value.probability ? value.probability : '',
                          value.impact ? value.impact : '',
                          <StateLabel state={value.probability * value.impact} >
                            {value.probability * value.impact}
                          </StateLabel>,
                          value.counterMeasures.map( value => value ).join(', '),
                          value.responsibility ? value.responsibility : '',
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
              <ReviewTableTitle title={t('Change Management')}/>
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
                          value.changeScope ? value.changeScope : '',
                          value.affectedParties ? value.affectedParties: '',
                          value.requiredAction.map( value => value ).join(', '),
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
              <ReviewTableTitle title={t('Review')}/>
            </Col>
            <Col>
              <RightLabel>{t('Review Feedback / Notes') + ':'}</RightLabel>
            </Col>
            <Col>
              <Input 
                name="review" 
                onChange={changeReview}
                onBlur={() => { }}
                value={review}
                type="editor" 
                placeholder={t('Write Explanation')} 
                width="100%"
              />
            </Col>
          </>
        </ReviewTableBody>
        <TableFooter>
          <Col width={6}>
          </Col>
          <Col width={6} direction="ltr">
            <IconButton
              type="button"
              styling="primary" 
              width="110px"
              onClick={approve}
            >
              {t('Approve')}
              <RocketIcon />
            </IconButton>
            <IconButton
              type="button" 
              styling="danger" 
              width="110px"
              onClick={reject}
            >
              {t('Reject')}
              <CancelIcon />
            </IconButton>
          </Col>
        </TableFooter>
      </TableForm>
    </TableContent>
  );
};
