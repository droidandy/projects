import React, { useEffect, useState } from 'react'
import { useActions } from 'typeless';
import { useTranslation } from 'react-i18next';
import { 
  usePhasesForm, 
  PhasesFormActions, 
  PhasesFormProvider, 
  getPhasesFormState,
} from '../../forms/phases-form';
import { DeleteIcon, PlusIcon } from '../../../icons';
import { NewProjectActions, getNewProjectState } from '../../interface';
import { FormInput } from '../../../common/FormInput';
import { Table, TableRow } from '../../../common/Table';
import { 
  IconButton, 
  Col,
  TableContent,
  TableBody,
  TableHeader,
  TableSubHeader,
  TableFooter,
  TableForm,
  AddFieldButton,
  SingleArrowIcon,
} from '../../../common/style';
import { 
  ProjectPhaseType,
  SaveAction,
} from '../../const';
import { 
  getMainPhaseSetting, 
  getCommunicationSetting,
  defaultMainPhase,
  defaultCommunication,
} from './const';

export const ProjectPhasesView = () => {
  const { t } = useTranslation();
  const { options, projectId } = getNewProjectState.useState();
  const { cancel, saveProjectPhases } = useActions(NewProjectActions);
  const { submit, changeMany } = useActions(PhasesFormActions);
  const [ showSettings, setShowSettings ] = useState({
    showMainPhaseAdd: false,
    showComSetupAdd: false,
    showComDuringAdd: false,
    showComPostAdd: false,
    showComSetup: true,
    showComDuring: true,
    showComPost: true,
  });  
  
  const [ mainPhase, setMainPhase ] = useState(defaultMainPhase);
  const [ comSetup, setComSetup ] = useState(defaultCommunication);
  const [ comDuring, setComDuring ] = useState(defaultCommunication);
  const [ comPost, setComPost ] = useState(defaultCommunication);
  
  usePhasesForm();
  useEffect(() => {
    changeMany(getNewProjectState().projectPhases);
  }, []);

  const { values } = getPhasesFormState.useState();
  
  // Main Phase handlers
  const addMainPhase = () => {
    const current = mainPhase;
    if (!projectId || !current.name || !current.outcome) return;
    const phase = {
      name: {
        en: current.name,
        ar: current.name,
      },
      initiativeItemId: projectId,
      startDate: current.startDate,
      endDate: current.endDate,
      outcome: parseFloat(current.outcome) ? parseFloat(current.outcome) : 0,
      comment: current.comment ? current.comment : null,
    }
    saveProjectPhases(ProjectPhaseType.MainPhase, SaveAction.Create, phase, -1);
  }

  const delMainPhase = (index: number) => {
    saveProjectPhases(ProjectPhaseType.MainPhase, SaveAction.Delete, null, values.mainPhases[index].id);
  }

  const onMainPhaseChange = (name:string, index: number, value: any) => {
    const current: any = [ ...values.mainPhases ][index];
    if (current[name] === value) return;
    current[name] = value;
    if (!projectId || !current.name || !current.outcome) return;
    const phase = {
      name: {
        en: current.name,
        ar: current.name,
      },
      initiativeItemId: projectId,
      startDate: current.startDate,
      endDate: current.endDate,
      outcome: parseFloat(current.outcome) ? parseFloat(current.outcome) : 0,
      comment: current.comment ? current.comment : null,
    }
    saveProjectPhases(ProjectPhaseType.MainPhase, SaveAction.Update, phase, current.id);
  }

  // Communication Handlers
  const addCommunication = (type: ProjectPhaseType) => {
    let current: any;
    if (type === ProjectPhaseType.ProjectSetup) current = comSetup;
    else if (type === ProjectPhaseType.ProjectDuring) current = comDuring;
    else if (type === ProjectPhaseType.ProjectPost) current = comPost;
    else return;

    if (!projectId) return;
    const communication = {
      initiativeItemId: projectId,
      message: current.message ? current.message : null,
      targetAudience: current.audience ? current.audience : null,
      communicationChannelId: current.channel ? current.channel.value : null,
      frequencyId: current.frequency ? current.frequency.value : null,
      efficiency: current.efficiency ? current.efficiency : null,
    }
    saveProjectPhases(type, SaveAction.Create, communication, -1);
  }

  const delCommunication = (type: ProjectPhaseType, index: number) => {
    let id: any;
    if (type === ProjectPhaseType.ProjectSetup) id = values.communication.setup[index].id;
    else if (type === ProjectPhaseType.ProjectDuring) id = values.communication.during[index].id;
    else if (type === ProjectPhaseType.ProjectPost) id = values.communication.post[index].id;
    else return;
    saveProjectPhases(type, SaveAction.Delete, null, id);
  }

  const onCommunicationChange = (type: ProjectPhaseType, name:string, index: number, value: any) => {
    let current: any;
    if (type === ProjectPhaseType.ProjectSetup) current = values.communication.setup[index];
    else if (type === ProjectPhaseType.ProjectDuring) current = values.communication.during[index];
    else if (type === ProjectPhaseType.ProjectPost) current = values.communication.post[index];
    else return;

    if (current[name] === value) return;
    current[name] = value;
    if (!projectId) return;
    const communication = {
      initiativeItemId: projectId,
      message: current.message ? current.message : null,
      targetAudience: current.audience ? current.audience : null,
      communicationChannelId: current.channel ? current.channel.value : null,
      frequencyId: current.frequency ? current.frequency.value : null,
      efficiency: current.efficiency ? current.efficiency : null,
    }
    saveProjectPhases(type, SaveAction.Update, communication, current.id);
  }
  return (
    <TableContent>
      <PhasesFormProvider>
        <TableForm
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          <TableBody>
            <Table>
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
                    t('Action'),
                  ])
                }
              />
              {
                values.mainPhases && values.mainPhases.map( (value, index) => {
                  return (
                    <TableRow key={value.id} headers={
                      getMainPhaseSetting([
                        <FormInput
                          name={'name_' + value.id}
                          value={value.name} 
                          onChange = {val => onMainPhaseChange('name', index, val)}
                          placeholder={t('Phase Name Here')} 
                        />,
                        <FormInput
                          name={'startDate_' + value.id} 
                          type="date"
                          value={value.startDate} 
                          onChange = {val => onMainPhaseChange('startDate', index, val)}
                        />,
                        <FormInput
                          name={'endDate_' + value.id}
                          type="date"
                          value={value.endDate} 
                          onChange = {val => onMainPhaseChange('endDate', index, val)}
                        />,
                        <FormInput
                          name={'outcome_' + value.id}
                          value={value.outcome} 
                          onChange = {val => onMainPhaseChange('outcome', index, val)}
                          placeholder={t('Value')} 
                        />,
                        <FormInput
                          name={'comment_' + value.id}
                          value={value.comment} 
                          onChange = {val => onMainPhaseChange('comment', index, val)}
                          placeholder={t('Write note Here')} 
                        />,
                        <IconButton
                          styling="danger"
                          onClick={(e) => {
                            e.preventDefault();
                            delMainPhase(index);
                          }}
                        >
                          <DeleteIcon color="white" /> {t('Delete')}
                        </IconButton>
                      ])
                    } />
                  )
                })
              }

              { showSettings.showMainPhaseAdd &&
                <TableRow headers={
                  getMainPhaseSetting([
                    <FormInput
                      name="name"
                      value={mainPhase.name} 
                      onChange={(val) => setMainPhase({
                        ...mainPhase,
                        name: val,
                      })}
                      placeholder={t('Phase Name Here')} 
                    />,
                    <FormInput
                      name="startDate"
                      type="date"
                      value={mainPhase.startDate} 
                      onChange={(val) => setMainPhase({
                        ...mainPhase,
                        startDate: val,
                      })}
                    />,
                    <FormInput
                      name="endDate"
                      type="date"
                      value={mainPhase.endDate} 
                      onChange={(val) => setMainPhase({
                        ...mainPhase,
                        endDate: val,
                      })}
                    />,
                    <FormInput
                      name="outcome"
                      value={mainPhase.outcome} 
                      onChange={(val) => setMainPhase({
                        ...mainPhase,
                        outcome: val,
                      })}
                      placeholder={t('Value')} 
                    />,
                    <FormInput
                      name="comment"
                      value={mainPhase.comment} 
                      onChange={(val) => setMainPhase({
                        ...mainPhase,
                        comment: val,
                      })}
                      placeholder={t('Write note Here')} 
                    />,
                    <IconButton
                      styling="primary"
                      onClick={(e) => {
                        e.preventDefault();
                        addMainPhase();
                      }}
                    >
                      <PlusIcon color="white" /> {t('Add')}
                    </IconButton>
                  ])
                } />
              }

              <TableRow
                headers={[
                  {
                    value:  ( 
                      <AddFieldButton
                        styling="primary"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowSettings({
                            ...showSettings,
                            showMainPhaseAdd: true,
                          });
                        }}
                      >
                        <PlusIcon color="white" /> {t('Add New Field')}
                      </AddFieldButton> 
                    ),
                    align: 'right',
                    width: '100%',
                  }
                ]}
              />
            </Table>

            <Table>
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
                    t('Action'),
                  ])
                }
              />
              
              <TableSubHeader onClick={() => setShowSettings({ ...showSettings, showComSetup: !showSettings.showComSetup})}>
                {t('Project Setup')}
                <SingleArrowIcon direction={showSettings.showComSetup ? 'up' : 'down'} />
              </TableSubHeader>
              { showSettings.showComSetup && <>
                {
                  values.communication && values.communication.setup.map( (value, index) => {
                    return (
                      <TableRow key={value.id} headers={
                        getCommunicationSetting([
                          <FormInput
                            name={'setupMessage_' + value.id}
                            value={value.message} 
                            onChange = {val => onCommunicationChange(ProjectPhaseType.ProjectSetup, 'message', index, val)}
                            placeholder={t('Enter Text')} 
                          />,
                          <FormInput
                            name={'setupAudience_' + value.id}
                            value={value.audience} 
                            onChange = {val => onCommunicationChange(ProjectPhaseType.ProjectSetup, 'audience', index, val)}
                            placeholder={t('Enter Text')} 
                          />,
                          <FormInput
                            name={'setupChannel_' + value.id}
                            type="select"
                            isMulti={false}
                            options={options.comChannelOptions} 
                            showIndicators={true} 
                            value={value.channel} 
                            onChange = {val => onCommunicationChange(ProjectPhaseType.ProjectSetup, 'channel', index, val)}
                            placeholder={t('Select')} 
                          />,
                          <FormInput
                            name={'setupFrequency_' + value.id}
                            type="select"
                            isMulti={false}
                            options={options.comFrequencyOptions}
                            showIndicators={true} 
                            value={value.frequency} 
                            onChange = {val => onCommunicationChange(ProjectPhaseType.ProjectSetup, 'frequency', index, val)}
                            placeholder={t('Select')} 
                          />,
                          <FormInput
                            name={'setupEfficiency_' + value.id}
                            value={value.efficiency} 
                            onChange = {val => onCommunicationChange(ProjectPhaseType.ProjectSetup, 'efficiency', index, val)}
                            placeholder={t('Enter Text')} 
                          />,
                          <IconButton
                            styling="danger"
                            onClick={(e) => {
                              e.preventDefault();
                              delCommunication(ProjectPhaseType.ProjectSetup, index);
                            }}
                          >
                            <DeleteIcon color="white" /> {t('Delete')}
                          </IconButton>
                        ])
                      } />
                    )
                  })
                }

                { showSettings.showComSetupAdd &&
                  <TableRow headers={
                    getCommunicationSetting([
                      <FormInput
                        name="setupMessage"
                        value={comSetup.message} 
                        onChange={(val) => setComSetup({
                          ...comSetup,
                          message: val,
                        })}
                        placeholder={t('Enter Text')} 
                      />,
                      <FormInput
                        name="setupAudience"
                        value={comSetup.audience} 
                        onChange={(val) => setComSetup({
                          ...comSetup,
                          audience: val,
                        })}
                        placeholder={t('Enter Text')} 
                      />,
                      <FormInput
                        name="setupChannel"
                        type="select"
                        isMulti={false}
                        options={options.comChannelOptions} 
                        showIndicators={true} 
                        value={comSetup.channel} 
                        onChange={(val) => setComSetup({
                          ...comSetup,
                          channel: val,
                        })}
                        placeholder={t('Select')} 
                      />,
                      <FormInput
                        name="setupFrequency"
                        type="select"
                        isMulti={false}
                        options={options.comFrequencyOptions}
                        showIndicators={true} 
                        value={comSetup.frequency} 
                        onChange={(val) => setComSetup({
                          ...comSetup,
                          frequency: val,
                        })}
                        placeholder={t('Select')} 
                      />,
                      <FormInput
                        name="setupEfficiency"
                        value={comSetup.efficiency} 
                        onChange={(val) => setComSetup({
                          ...comSetup,
                          efficiency: val,
                        })}
                        placeholder={t('Enter Text')} 
                      />,
                      <IconButton
                        styling="primary"
                        onClick={(e) => {
                          e.preventDefault();
                          addCommunication(ProjectPhaseType.ProjectSetup);
                        }}
                      >
                        <PlusIcon color="white" /> {t('Add')}
                      </IconButton>
                    ])
                  } />
                }

                <TableRow
                  headers={[
                    {
                      value:  ( 
                        <AddFieldButton
                          styling="primary"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowSettings({
                              ...showSettings,
                              showComSetupAdd: true,
                            });
                          }}
                        >
                          <PlusIcon color="white" /> {t('Add New Field')}
                        </AddFieldButton> 
                      ),
                      align: 'right',
                      width: '100%',
                    }
                  ]}
                />
              </> }

              <TableSubHeader onClick={() => setShowSettings({ ...showSettings, showComDuring: !showSettings.showComDuring})}>
                {t('During execution/Implementation')}
                <SingleArrowIcon direction={showSettings.showComDuring ? 'up' : 'down'} />
              </TableSubHeader>
              { showSettings.showComDuring && <>
                {
                  values.communication && values.communication.during.map( (value, index) => {
                    return (
                      <TableRow key={value.id} headers={
                        getCommunicationSetting([
                          <FormInput
                            name={'duringMessage_' + value.id}
                            value={value.message} 
                            onChange = {val => onCommunicationChange(ProjectPhaseType.ProjectDuring, 'message', index, val)}
                            placeholder={t('Enter Text')} 
                          />,
                          <FormInput
                            name={'duringAudience_' + value.id}
                            value={value.audience} 
                            onChange = {val => onCommunicationChange(ProjectPhaseType.ProjectDuring, 'audience', index, val)}
                            placeholder={t('Enter Text')} 
                          />,
                          <FormInput
                            name={'duringChannel_' + value.id}
                            type="select"
                            isMulti={false}
                            options={options.comChannelOptions} 
                            showIndicators={true} 
                            value={value.channel} 
                            onChange = {val => onCommunicationChange(ProjectPhaseType.ProjectDuring, 'channel', index, val)}
                            placeholder={t('Select')} 
                          />,
                          <FormInput
                            name={'duringFrequency_' + value.id}
                            type="select"
                            isMulti={false}
                            options={options.comFrequencyOptions}
                            showIndicators={true} 
                            value={value.frequency} 
                            onChange = {val => onCommunicationChange(ProjectPhaseType.ProjectDuring, 'frequency', index, val)}
                            placeholder={t('Select')} 
                          />,
                          <FormInput
                            name={'duringEfficiency_' + value.id}
                            value={value.efficiency} 
                            onChange = {val => onCommunicationChange(ProjectPhaseType.ProjectDuring, 'efficiency', index, val)}
                            placeholder={t('Enter Text')} 
                          />,
                          <IconButton
                            styling="danger"
                            onClick={(e) => {
                              e.preventDefault();
                              delCommunication(ProjectPhaseType.ProjectDuring, index);
                            }}
                          >
                            <DeleteIcon color="white" /> {t('Delete')}
                          </IconButton>
                        ])
                      } />
                    )
                  })
                }

                { showSettings.showComDuringAdd &&
                  <TableRow headers={
                    getCommunicationSetting([
                      <FormInput
                        name="duringMessage"
                        value={comDuring.message} 
                        onChange={(val) => setComDuring({
                          ...comDuring,
                          message: val,
                        })}
                        placeholder={t('Enter Text')} 
                      />,
                      <FormInput
                        name="duringAudience"
                        value={comDuring.audience} 
                        onChange={(val) => setComDuring({
                          ...comDuring,
                          audience: val,
                        })}
                        placeholder={t('Enter Text')} 
                      />,
                      <FormInput
                        name="duringChannel"
                        type="select"
                        isMulti={false}
                        options={options.comChannelOptions} 
                        showIndicators={true} 
                        value={comDuring.channel} 
                        onChange={(val) => setComDuring({
                          ...comDuring,
                          channel: val,
                        })}
                        placeholder={t('Select')} 
                      />,
                      <FormInput
                        name="duringFrequency"
                        type="select"
                        isMulti={false}
                        options={options.comFrequencyOptions}
                        showIndicators={true} 
                        value={comDuring.frequency} 
                        onChange={(val) => setComDuring({
                          ...comDuring,
                          frequency: val,
                        })}
                        placeholder={t('Select')} 
                      />,
                      <FormInput
                        name="duringEfficiency"
                        value={comDuring.efficiency} 
                        onChange={(val) => setComDuring({
                          ...comDuring,
                          efficiency: val,
                        })}
                        placeholder={t('Enter Text')} 
                      />,
                      <IconButton
                        styling="primary"
                        onClick={(e) => {
                          e.preventDefault();
                          addCommunication(ProjectPhaseType.ProjectDuring);
                        }}
                      >
                        <PlusIcon color="white" /> {t('Add')}
                      </IconButton>
                    ])
                  } />
                }
                <TableRow
                  headers={[
                    {
                      value:  ( 
                        <AddFieldButton
                          styling="primary"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowSettings({
                              ...showSettings,
                              showComDuringAdd: true,
                            });
                          }}
                        >
                          <PlusIcon color="white" /> {t('Add New Field')}
                        </AddFieldButton> 
                      ),
                      align: 'right',
                      width: '100%',
                    }
                  ]}
                />
              </> }

              <TableSubHeader onClick={() => setShowSettings({ ...showSettings, showComPost: !showSettings.showComPost})}>
                {t('Post Implementation')}
                <SingleArrowIcon direction={showSettings.showComPost ? 'up' : 'down'} />
              </TableSubHeader>
              { showSettings.showComPost && <>
                {
                  values.communication && values.communication.post.map( (value, index) => {
                    return (
                      <TableRow key={value.id} headers={
                        getCommunicationSetting([
                          <FormInput
                            name={'postMessage_' + value.id}
                            value={value.message} 
                            onChange = {val => onCommunicationChange(ProjectPhaseType.ProjectPost, 'message', index, val)}
                            placeholder={t('Enter Text')} 
                          />,
                          <FormInput
                            name={'postAudience_' + value.id}
                            value={value.audience} 
                            onChange = {val => onCommunicationChange(ProjectPhaseType.ProjectPost, 'audience', index, val)}
                            placeholder={t('Enter Text')} 
                          />,
                          <FormInput
                            name={'postChannel_' + value.id}
                            type="select"
                            isMulti={false}
                            options={options.comChannelOptions} 
                            showIndicators={true} 
                            value={value.channel} 
                            onChange = {val => onCommunicationChange(ProjectPhaseType.ProjectPost, 'channel', index, val)}
                            placeholder={t('Select')} 
                          />,
                          <FormInput
                            name={'postFrequency_' + value.id}
                            type="select"
                            isMulti={false}
                            options={options.comFrequencyOptions}
                            showIndicators={true} 
                            value={value.frequency} 
                            onChange = {val => onCommunicationChange(ProjectPhaseType.ProjectPost, 'frequency', index, val)}
                            placeholder={t('Select')} 
                          />,
                          <FormInput
                            name={'postEfficiency_' + value.id}
                            value={value.efficiency} 
                            onChange = {val => onCommunicationChange(ProjectPhaseType.ProjectPost, 'efficiency', index, val)}
                            placeholder={t('Enter Text')} 
                          />,
                          <IconButton
                            styling="danger"
                            onClick={(e) => {
                              e.preventDefault();
                              delCommunication(ProjectPhaseType.ProjectPost, index);
                            }}
                          >
                            <DeleteIcon color="white" /> {t('Delete')}
                          </IconButton>
                        ])
                      } />
                    )
                  })
                }

                { showSettings.showComPostAdd &&
                  <TableRow headers={
                    getCommunicationSetting([
                      <FormInput
                        name="postMessage"
                        value={comPost.message} 
                        onChange={(val) => setComPost({
                          ...comPost,
                          message: val,
                        })}
                        placeholder={t('Enter Text')} 
                      />,
                      <FormInput
                        name="postAudience"
                        value={comPost.audience} 
                        onChange={(val) => setComPost({
                          ...comPost,
                          audience: val,
                        })}
                        placeholder={t('Enter Text')} 
                      />,
                      <FormInput
                        name="postChannel"
                        type="select"
                        isMulti={false}
                        options={options.comChannelOptions} 
                        showIndicators={true} 
                        value={comPost.channel} 
                        onChange={(val) => setComPost({
                          ...comPost,
                          channel: val,
                        })}
                        placeholder={t('Select')} 
                      />,
                      <FormInput
                        name="postFrequency"
                        type="select"
                        isMulti={false}
                        options={options.comFrequencyOptions}
                        showIndicators={true} 
                        value={comPost.frequency} 
                        onChange={(val) => setComPost({
                          ...comPost,
                          frequency: val,
                        })}
                        placeholder={t('Select')} 
                      />,
                      <FormInput
                        name="postEfficiency"
                        value={comPost.efficiency} 
                        onChange={(val) => setComPost({
                          ...comPost,
                          efficiency: val,
                        })}
                        placeholder={t('Enter Text')} 
                      />,
                      <IconButton
                        styling="primary"
                        onClick={(e) => {
                          e.preventDefault();
                          addCommunication(ProjectPhaseType.ProjectPost);
                        }}
                      >
                        <PlusIcon color="white" /> {t('Add')}
                      </IconButton>
                    ])
                  } />
                }
                <TableRow
                  headers={[
                    {
                      value:  ( 
                        <AddFieldButton
                          styling="primary"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowSettings({
                              ...showSettings,
                              showComPostAdd: true,
                            });
                          }}
                        >
                          <PlusIcon color="white" /> {t('Add New Field')}
                        </AddFieldButton> 
                      ),
                      align: 'right',
                      width: '100%',
                    }
                  ]}
                />
              </> }
            </Table>
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
                {t('Next Step')}
              </IconButton>
            </Col>
          </TableFooter>
        </TableForm>
      </PhasesFormProvider>
    </TableContent>
  );
};
