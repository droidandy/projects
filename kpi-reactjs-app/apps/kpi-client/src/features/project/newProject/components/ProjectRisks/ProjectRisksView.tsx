import React, { useEffect, useState } from 'react'
import { useActions } from 'typeless';
import { useTranslation } from 'react-i18next';
import { SelectOption } from 'src/types';
import { 
  useRisksForm, 
  RisksFormActions, 
  RisksFormProvider, 
  getRisksFormState,
} from '../../forms/risks-form';
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
  TableFooter,
  TableForm,
  AddFieldButton,
  StateLabel,
} from '../../../common/style';
import { SaveAction } from '../../const';
import {
  getRisksSetting,
  defaultRisk,
} from './const';

export const ProjectRisksView = () => {
  const { t } = useTranslation();
  const { options, projectId } = getNewProjectState.useState();
  const { cancel, saveProjectRisk } = useActions(NewProjectActions);
  const { submit, changeMany } = useActions(RisksFormActions);
  const [ newRisk, setNewRisk ] = useState({
    ...defaultRisk,
    probability: options.probabilityOptions[0],
    impact: options.impactOptions[0],
  });
  const [ showSettings, setShowSettings ] = useState({ showRiskAdd: false });  

  useRisksForm();
  useEffect(() => {
    changeMany(getNewProjectState().projectRisks);
  }, []);

  const { values } = getRisksFormState.useState();
  
  //Risk Management handlers
  const onProjectRiskChange = (name:string, index: number, value: any) => {
    const current: any = [ ...values.risks ][index];
    if (current[name] === value) return;
    current[name] = value;
    if (!projectId || !current.activity) return;
    const risk = {
      initiativeItemId: projectId,
      typeId: current.activity ? current.activity.value : null,
      riskTypeId: current.type ? current.type.value : null,
      description: {
        en: current.description ? current.description : null,
        ar: current.description ? current.description : null,
      },
      probability: current.probability ? current.probability.value : null,
      impact: current.impact ? current.impact.value : null,
      counterMeasures: current.counterMeasures ? (current.counterMeasures as SelectOption[]).map( item => { return item.value; } ) : [],
      responsibilityId: current.responsibility ? current.responsibility.value : null,
      startDate: current.timeline[0],
      endDate: current.timeline[1],
    }
    saveProjectRisk(SaveAction.Update, risk, current.id);
  }

  const addProjectRisk = () => {
    const current: any = newRisk;
    if (!projectId || !current.activity) return;
    const risk = {
      initiativeItemId: projectId,
      typeId: current.activity ? current.activity.value : null,
      riskTypeId: current.type ? current.type.value : null,
      description: {
        en: current.description ? current.description : null,
        ar: current.description ? current.description : null,
      },
      probability: current.probability.value,
      impact: current.impact.value,
      counterMeasures: current.counterMeasures ? (current.counterMeasures as SelectOption[]).map( item => { return item.value; } ) : [],
      responsibilityId: current.responsibility ? current.responsibility.value : null,
      startDate: current.timeline[0],
      endDate: current.timeline[1],
    }
    saveProjectRisk(SaveAction.Create, risk, -1);
  }

  const delProjectRisk = (index: number) => {
    const id = values.risks[index].id;
    saveProjectRisk(SaveAction.Delete, null, id);
  }

  return (
    <TableContent>
      <RisksFormProvider>
        <TableForm
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          <TableBody>
            <Table>
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
                    t('Action'),
                  ])
                }
              />
              {
                values.risks && values.risks.map( (value, index) => {
                  return (
                    <TableRow key={value.id} headers={
                      getRisksSetting([
                        <FormInput
                          name={'activity_' + value.id}
                          type="select"
                          options={options.activityOptions}
                          isMulti={false}
                          showIndicators={true}
                          value={value.activity} 
                          onChange = {val => onProjectRiskChange('activity', index, val)}
                          placeholder={t('Select')} 
                        />,
                        <FormInput
                          name={'type_' + value.id}
                          type="select"
                          options={options.riskTypeOptions}
                          isMulti={false}
                          showIndicators={true}
                          value={value.type} 
                          onChange = {val => onProjectRiskChange('type', index, val)}
                          placeholder={t('Select')} 
                        />,
                        <FormInput
                          name={'description_' + value.id}
                          value={value.description} 
                          onChange = {val => onProjectRiskChange('description', index, val)}
                          placeholder={t('Write note here')} 
                        />,
                        <FormInput
                          name={'probability_' + value.id}
                          type="select"
                          options={options.probabilityOptions}
                          isMulti={false}
                          showIndicators={true}
                          value={value.probability} 
                          onChange = {val => onProjectRiskChange('probability', index, val)}
                          placeholder={t('Select')} 
                        />,
                        <FormInput
                          name={'impact_' + value.id}
                          type="select"
                          options={options.impactOptions}
                          isMulti={false}
                          showIndicators={true}
                          value={value.impact} 
                          onChange = {val => onProjectRiskChange('impact', index, val)}
                          placeholder={t('Select')} 
                        />,
                        <StateLabel state={value.probability.value * value.impact.value} >
                          {value.probability.value * value.impact.value}
                        </StateLabel>,
                        <FormInput
                          name={'counterMeasures_' + value.id}
                          type="select"
                          options={options.counterMeasuresOptions}
                          showIndicators={true}
                          value={value.counterMeasures} 
                          onChange = {val => onProjectRiskChange('counterMeasures', index, val)}
                          placeholder={t('Write')} 
                        />,
                        <FormInput
                          name={'responsibility_' + value.id}
                          type="select"
                          options={options.responsibilityOptions}
                          isMulti={false}
                          showIndicators={true}
                          value={value.responsibility} 
                          onChange = {val => onProjectRiskChange('responsibility', index, val)}
                          placeholder={t('Select')} 
                        />,
                        <FormInput
                          name={'timeline_' + value.id}
                          type="date"
                          selectRange
                          value={value.timeline} 
                          onChange = {val => onProjectRiskChange('timeline', index, val)}
                        />,
                        <IconButton
                          styling="danger"
                          width="70px"
                          onClick={(e) => {
                            e.preventDefault();
                            delProjectRisk(index);
                          }}
                        >
                          <DeleteIcon color="white" /> {t('Delete')}
                        </IconButton>
                      ])
                    } />
                  )
                })
              }

              { showSettings.showRiskAdd &&
                <TableRow headers={
                  getRisksSetting([
                    <FormInput
                      name="activity"
                      type="select"
                      options={options.activityOptions}
                      isMulti={false}
                      showIndicators={true}
                      value={newRisk.activity} 
                      onChange={(val) => setNewRisk({
                        ...newRisk,
                        activity: val,
                      })}
                      placeholder={t('Select')} 
                    />,
                    <FormInput
                      name="type"
                      type="select"
                      options={options.riskTypeOptions}
                      isMulti={false}
                      showIndicators={true}
                      value={newRisk.type} 
                      onChange={(val) => setNewRisk({
                        ...newRisk,
                        type: val,
                      })}
                      placeholder={t('Select')} 
                    />,
                    <FormInput
                      name="description"
                      value={newRisk.description} 
                      onChange={(val) => setNewRisk({
                        ...newRisk,
                        description: val,
                      })}
                      placeholder={t('Write note here')} 
                    />,
                    <FormInput
                      name="probability"
                      type="select"
                      options={options.probabilityOptions}
                      isMulti={false}
                      showIndicators={true}
                      value={newRisk.probability} 
                      onChange={(val) => setNewRisk({
                        ...newRisk,
                        probability: val,
                      })}
                      placeholder={t('Select')} 
                    />,
                    <FormInput
                      name="impact"
                      type="select"
                      options={options.impactOptions}
                      isMulti={false}
                      showIndicators={true}
                      value={newRisk.impact} 
                      onChange={(val) => setNewRisk({
                        ...newRisk,
                        impact: val,
                      })}
                      placeholder={t('Select')} 
                    />,
                    <StateLabel state={newRisk.probability.value * newRisk.impact.value} >
                      {newRisk.probability.value * newRisk.impact.value}
                    </StateLabel>,
                    <FormInput
                      name="counterMeasures"
                      type="select"
                      options={options.counterMeasuresOptions}
                      showIndicators={true}
                      value={newRisk.counterMeasures} 
                      onChange={(val) => setNewRisk({
                        ...newRisk,
                        counterMeasures: val,
                      })}
                      placeholder={t('Write')} 
                    />,
                    <FormInput
                      name="responsibility"
                      type="select"
                      options={options.responsibilityOptions}
                      isMulti={false}
                      showIndicators={true}
                      value={newRisk.responsibility} 
                      onChange={(val) => setNewRisk({
                        ...newRisk,
                        responsibility: val,
                      })}
                      placeholder={t('Select')} 
                    />,
                    <FormInput
                      name="timeline"
                      type="date"
                      selectRange
                      value={newRisk.timeline} 
                      onChange={(val) => setNewRisk({
                        ...newRisk,
                        timeline: val,
                      })}
                    />,
                    <IconButton
                      styling="primary"
                      width="70px"
                      onClick={(e) => {
                        e.preventDefault();
                        addProjectRisk();
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
                            showRiskAdd: true,
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
      </RisksFormProvider>
    </TableContent>
  );
};
