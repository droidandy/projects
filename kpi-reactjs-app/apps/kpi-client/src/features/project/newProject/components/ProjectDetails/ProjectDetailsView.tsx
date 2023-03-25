import React, { useEffect } from 'react'
import { useActions } from 'typeless';
import { useTranslation } from 'react-i18next';
import { useDetailsForm, DetailsFormActions, DetailsFormProvider, getDetailsFormState } from '../../forms/details-form';
import { DeleteIcon, PlusIcon } from '../../../icons';
import { NewProjectActions, getNewProjectState, } from '../../interface';
import { FormInput } from '../../../common/FormInput';
import { 
  Content,
  Form,
  Header,
  Footer,
  Body,
  Label,
  Inputs,
  IconButton,
  Comment,
  Col
} from '../../../common/style';
import { 
  SmallLabel,
  MediumInputs,
  SmallInputs,
} from './style';

export const ProjectDetailsView = () => {
  const { t } = useTranslation();
  const { options } = getNewProjectState.useState();
  const { cancel, saveProjectDetails } = useActions(NewProjectActions);
  const { submit, changeMany, change } = useActions(DetailsFormActions);


  useDetailsForm();
  useEffect(() => {
    changeMany(getNewProjectState().projectDetails);
  }, []);

  const { values } = getDetailsFormState.useState();

  const onChange = (name: "name" | "description" | "budget" | "startDate" | "endDate" | "objectives" | "state" | "specs" | "challenges" | "relProjects", 
                    value: any) => {
    if(JSON.stringify(values[name]) === JSON.stringify(value)) return;
    change(name, value);
    if (getNewProjectState().projectId) saveProjectDetails();
    if (name === 'name' && values && !getNewProjectState().projectId) saveProjectDetails();
  }

  return (
    <Content>
      <DetailsFormProvider>
        { values.name !== undefined && 
          <Form
            onSubmit={e => {
              e.preventDefault();
              submit();
            }}
          >
            <Header>
            {t('Project Details')}
            </Header>
            <Body>

              <Label>{'* ' + t('Project Name')}</Label>
              <Inputs>
                <FormInput
                  name="name" 
                  onChange={(value) => onChange('name', value)}
                  value={values.name} 
                  placeholder={t('Project Name')} 
                />
                <Col>
                  <Comment>{t('Please enter your Project Name')}</Comment>
                </Col>
              </Inputs>

              <Label>{'* ' + t('Project Description')}</Label>
              <Inputs>
                <FormInput 
                  name="description" 
                  onChange={(value) => onChange('description', value)}
                  value={values.description} 
                  type="editor" 
                  placeholder={t('Project Description')} 
                />
                <Col>
                  <Comment>{t('Please enter your Project Description')}</Comment>
                </Col>
              </Inputs>

              <Col>
                <Label>{'* ' + t('Project Budget')}</Label>
                <SmallInputs>
                  <FormInput name="budget" 
                    value={values.budget} 
                    onChange={(value) => onChange('budget', value)}
                    placeholder={t('Project Budget')} 
                  />
                  <Comment>{t('Please enter your Project Budget')}</Comment>
                </SmallInputs>
              </Col>

              <Label>{t('Start Date')}</Label>
              <SmallInputs>
                <FormInput 
                  name="startDate" 
                  onChange={(value) => onChange('startDate', value)}
                  value={values.startDate} 
                  type="date" 
                />
                <Col>
                  <Comment>{t('Please enter your Start date')}</Comment>
                </Col>
              </SmallInputs>

              <SmallLabel>{t('End Date')}</SmallLabel>
              <SmallInputs>
                <FormInput 
                  name="endDate" 
                  onChange={(value) => onChange('endDate', value)}
                  value={values.endDate} 
                  type="date" 
                />
                <Col>
                  <Comment>{t('Please enter your End date')}</Comment>
                </Col>
              </SmallInputs>

              <Label>{'* ' + t('Project Objectives')}</Label>
              <Inputs>
                {
                  values.objectives && values.objectives.map( (value, index) => {
                    return (
                      <Col key={value + index}>
                        <MediumInputs>
                          <FormInput 
                            name={'objectives_' + index} 
                            onChange={(value) => {
                              const current = [ ...values.objectives ];
                              current[index] = value;
                              onChange('objectives', current);
                            }}
                            value={value} 
                            placeholder={t('Enter Text')} 
                          />
                        </MediumInputs>
                        <IconButton
                          styling="danger"
                          onClick={(e) => {
                            e.preventDefault();
                            const current = [ ...values.objectives ];
                            current.splice(index, 1);
                            onChange('objectives', current);
                          }}
                        >
                          <DeleteIcon color="white" /> {t('Delete')}
                        </IconButton>
                      </Col>
                    )
                  })
                }
                <Col>
                  <IconButton
                    styling="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      const current = [ ...values.objectives ];
                      current.push('');
                      onChange('objectives', current);
                    }}
                  >
                    <PlusIcon color="white" /> {t('Add')}
                  </IconButton>
                </Col>
              </Inputs>

              <Label>{t('Innovation Factor of this project')}</Label>
              <Inputs>
                <FormInput
                  name="state" 
                  onChange={(value) => onChange('state', value)}
                  value={values.state} 
                  type="multiline"
                  placeholder={t('Enter Text')} 
                />
                <Col>
                  <Comment>{t('Please enter your State')}</Comment>
                </Col>
              </Inputs>

              <Label>{t('Requirements and specifications')}</Label>
              <Inputs>
                {
                  values.specs && values.specs.map( (value, index) => {
                    return (
                      <Col key={value + index}>
                        <MediumInputs>
                          <FormInput 
                            name={'specs_' + index} 
                            onChange={(value) => {
                              const current = [ ...values.specs ];
                              current[index] = value;
                              onChange('specs', current);
                            }}
                            value={value} 
                            placeholder={t('Enter Text')} 
                          />
                        </MediumInputs>
                        <IconButton
                          styling="danger"
                          onClick={(e) => {
                            e.preventDefault();
                            const current = [ ...values.specs ];
                            current.splice(index, 1);
                            onChange('specs', current);
                          }}
                        >
                          <DeleteIcon color="white" /> {t('Delete')}
                        </IconButton>
                      </Col>
                    )
                  })
                }
                <Col>
                  <IconButton
                    styling="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      const current = [ ...values.specs ];
                      current.push('');
                      onChange('specs', current);
                    }}
                  >
                    <PlusIcon color="white" /> {t('Add')}
                  </IconButton>
                </Col>
              </Inputs>

              <Label>{t('Existing or Potential Challenges')}</Label>
              <Inputs>
                {
                  values.challenges && values.challenges.map( (value, index) => {
                    return (
                      <Col key={value + index}>
                        <MediumInputs>
                          <FormInput 
                            name={'challenges_' + index} 
                            onChange={(value) => {
                              const current = [ ...values.challenges ];
                              current[index] = value;
                              onChange('challenges', current);
                            }}
                            value={value} 
                            placeholder={t('Enter Text')} 
                          />
                        </MediumInputs>
                        <IconButton
                          styling="danger"
                          onClick={(e) => {
                            e.preventDefault();
                            const current = [ ...values.challenges ];
                            current.splice(index, 1);
                            onChange('challenges', current);
                          }}
                        >
                          <DeleteIcon color="white" /> {t('Delete')}
                        </IconButton>
                      </Col>
                    )
                  })
                }
                <Col>
                  <IconButton
                    styling="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      const current = [ ...values.challenges ];
                      current.push('');
                      onChange('challenges', current);
                    }}
                  >
                    <PlusIcon color="white" /> {t('Add')}
                  </IconButton>
                </Col>
              </Inputs>

              <Label>{t('Related Projects')}</Label>
              <Inputs>
                <FormInput
                  name="relProjects"
                  onChange={(value) => onChange('relProjects', value)}
                  type="select" 
                  options={options.relProjectsOptions} 
                  value={values.relProjects} 
                  placeholder={t('Start Typing')} 
                />
              </Inputs>
            </Body>

            <Footer>
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
                    saveProjectDetails();
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
            </Footer>
          </Form>
        }
      </DetailsFormProvider>
    </Content>
  );
};
