import React, { useEffect, useState } from 'react'
import { useActions } from 'typeless';
import { useTranslation } from 'react-i18next';
import { 
  useResourcesForm, 
  ResourcesFormActions, 
  ResourcesFormProvider, 
  getResourcesFormState,
} from '../../forms/resources-form';
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
} from '../../../common/style';
import { ProjectResourceType, SaveAction } from '../../const';
import {
  getBudgetPlanSetting,
  getOtherResourcesSetting,
  defaultBudgetPlan,
  defaultOtherResource,
} from './const';

export const ProjectResourcesView = () => {
  const { t } = useTranslation();
  const { options, projectId } = getNewProjectState.useState();
  const { cancel, saveProjectResource } = useActions(NewProjectActions);
  const { submit, changeMany } = useActions(ResourcesFormActions);
  const [ budgetPlan, setBudgetPlan ] = useState(defaultBudgetPlan);
  const [ otherResource, setOtherResource ] = useState(defaultOtherResource);
  const [ showSettings, setShowSettings ] = useState({
    showBudgetPlanAdd: false,
    showOtherResourceAdd: false,
  });  

  useResourcesForm();
  useEffect(() => {
    changeMany(getNewProjectState().projectResources);
  }, []);

  const { values } = getResourcesFormState.useState();
  
  //BudgetPlanTable handlers
  const onBudgetPlanChange = (name:string, index: number, value: any) => {
    const current: any = [ ...values.budgetPlans ][index];
    if (current[name] === value) return;
    current[name] = value;
    if (!projectId || !current.activity || !current.details) return;
    const resource = {
      initiativeItemId: projectId,
      typeId: current.activity ? current.activity.value : null,
      details: current.details ? current.details : null,
      financialItem: {
        en: current.financialItem ? current.financialItem : null,
        ar: current.financialItem ? current.financialItem : null,
      },
      mainBudget: parseFloat(current.mainBudget),
      extraCost: parseFloat(current.extraCost),
      totalCost: parseFloat(current.totalCost),
      paymentProcedureId: current.paymentProc ? current.paymentProc.value : null,
      startDate: current.timeline[0],
      endDate: current.timeline[1],
      comment: current.comment ? current.comment : null,
    }
    saveProjectResource(ProjectResourceType.BudgetPlan, SaveAction.Update, resource, current.id);
  }

  const addBudgetPlan = () => {
    const current: any = budgetPlan;
    if (!projectId || !current.activity || !current.details) return;
    const resource = {
      initiativeItemId: projectId,
      typeId: current.activity ? current.activity.value : null,
      details: current.details ? current.details : null,
      financialItem: {
        en: current.financialItem ? current.financialItem : null,
        ar: current.financialItem ? current.financialItem : null,
      },
      mainBudget: parseFloat(current.mainBudget),
      extraCost: parseFloat(current.extraCost),
      totalCost: parseFloat(current.totalCost),
      paymentProcedureId: current.paymentProc ? current.paymentProc.value : null,
      startDate: current.timeline[0],
      endDate: current.timeline[1],
      comment: current.comment ? current.comment : null,
    }
    saveProjectResource(ProjectResourceType.BudgetPlan, SaveAction.Create, resource, -1);
  }

  const delBudgetPlan = (index: number) => {
    const id = values.budgetPlans[index].id;
    saveProjectResource(ProjectResourceType.BudgetPlan, SaveAction.Delete, null, id);
  }

  //Other resources handlers
  const onOtherResourceChange = (name:string, index: number, value: any) => {
    const current: any = [ ...values.otherResources ][index];
    if (current[name] === value) return;
    current[name] = value;
    if (!projectId || !current.activity) return;
    const resource = {
      initiativeItemId: projectId,
      typeId: current.activity ? current.activity.value : null,
      resourceId: current.resource ? current.resource.value : null,
      details: current.details ? current.details : null,
      mainBudget: parseFloat(current.mainBudget),
      comment: current.comment ? current.comment : null,
    }
    saveProjectResource(ProjectResourceType.OtherResource, SaveAction.Update, resource, current.id);
  }

  const addOtherResource = () => {
    const current: any = otherResource;
    if (!projectId || !current.activity) return;
    const resource = {
      initiativeItemId: projectId,
      typeId: current.activity ? current.activity.value : null,
      resourceId: current.resource ? current.resource.value : null,
      details: current.details ? current.details : null,
      mainBudget: parseFloat(current.mainBudget),
      comment: current.comment ? current.comment : null,
    }
    saveProjectResource(ProjectResourceType.OtherResource, SaveAction.Create, resource, -1);
  }

  const delOtherResource = (index: number) => {
    const id = values.otherResources[index].id;
    saveProjectResource(ProjectResourceType.OtherResource, SaveAction.Delete, null, id);
  }

  return (
    <TableContent>
      <ResourcesFormProvider>
        <TableForm
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          <TableBody>
            <Table>
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
                    t('Action'),
                  ])
                }
              />
              {
                values.budgetPlans && values.budgetPlans.map( (value, index) => {
                  return (
                    <TableRow key={value.id} headers={
                      getBudgetPlanSetting([
                        <FormInput
                          name={'activity_' + value.id}
                          type="select"
                          options={options.activityOptions}
                          isMulti={false}
                          showIndicators={true}
                          value={value.activity} 
                          onChange = {val => onBudgetPlanChange('activity', index, val)}
                          placeholder={t('Select')} 
                        />,
                        <FormInput
                          name={'details_' + value.id}
                          value={value.details} 
                          onChange = {val => onBudgetPlanChange('details', index, val)}
                          placeholder={t('Write note here')} 
                        />,
                        <FormInput
                          name={'financialItem_' + value.id}
                          value={value.financialItem} 
                          onChange = {val => onBudgetPlanChange('financialItem', index, val)}
                          placeholder={t('Value')} 
                        />,
                        <FormInput
                          name={'mainBudget_' + value.id}
                          value={value.mainBudget} 
                          onChange = {val => onBudgetPlanChange('mainBudget', index, val)}
                          placeholder={t('Value')} 
                        />,
                        <FormInput
                          name={'extraCost_' + value.id}
                          value={value.extraCost} 
                          onChange = {val => onBudgetPlanChange('extraCost', index, val)}
                          placeholder={t('Value')} 
                        />,
                        <FormInput
                          name={'totalCost_' + value.id}
                          value={value.totalCost} 
                          onChange = {val => onBudgetPlanChange('totalCost', index, val)}
                          placeholder={t('Value')} 
                        />,
                        <FormInput
                          name={'paymentProc_' + value.id}
                          type="select"
                          options={options.paymentOptions}
                          isMulti={false}
                          showIndicators={true}
                          value={value.paymentProc} 
                          onChange = {val => onBudgetPlanChange('paymentProc', index, val)}
                          placeholder={t('Select')} 
                        />,
                        <FormInput
                          name={'timeline_' + value.id}
                          type="date"
                          selectRange
                          value={value.timeline} 
                          onChange = {val => onBudgetPlanChange('timeline', index, val)}
                        />,
                        <FormInput
                          name={'comment' + value.id}
                          value={value.comment} 
                          onChange = {val => onBudgetPlanChange('comment', index, val)}
                          placeholder={t('Write note here')} 
                        />,
                        <IconButton
                          styling="danger"
                          width="70px"
                          onClick={(e) => {
                            e.preventDefault();
                            delBudgetPlan(index);
                          }}
                        >
                          <DeleteIcon color="white" /> {t('Delete')}
                        </IconButton>
                      ])
                    } />
                  )
                })
              }

              { showSettings.showBudgetPlanAdd &&
                <TableRow headers={
                  getBudgetPlanSetting([
                    <FormInput
                      name="activity"
                      type="select"
                      options={options.activityOptions}
                      isMulti={false}
                      showIndicators={true}
                      value={budgetPlan.activity} 
                      onChange={(val) => setBudgetPlan({
                        ...budgetPlan,
                        activity: val,
                      })}
                      placeholder={t('Select')} 
                    />,
                    <FormInput
                      name="details"
                      value={budgetPlan.details} 
                      onChange={(val) => setBudgetPlan({
                        ...budgetPlan,
                        details: val,
                      })}
                      placeholder={t('Write note here')} 
                    />,
                    <FormInput
                      name="financialItem"
                      value={budgetPlan.financialItem} 
                      onChange={(val) => setBudgetPlan({
                        ...budgetPlan,
                        financialItem: val,
                      })}
                      placeholder={t('Value')} 
                    />,
                    <FormInput
                      name="mainBudget"
                      value={budgetPlan.mainBudget} 
                      onChange={(val) => setBudgetPlan({
                        ...budgetPlan,
                        mainBudget: val,
                      })}
                      placeholder={t('Value')} 
                    />,
                    <FormInput
                      name="extraCost"
                      value={budgetPlan.extraCost} 
                      onChange={(val) => setBudgetPlan({
                        ...budgetPlan,
                        extraCost: val,
                      })}
                      placeholder={t('Value')} 
                    />,
                    <FormInput
                      name="totalCost"
                      value={budgetPlan.totalCost} 
                      onChange={(val) => setBudgetPlan({
                        ...budgetPlan,
                        totalCost: val,
                      })}
                      placeholder={t('Value')} 
                    />,
                    <FormInput
                      name="paymentProc"
                      type="select"
                      options={options.paymentOptions}
                      isMulti={false}
                      showIndicators={true}
                      value={budgetPlan.paymentProc} 
                      onChange={(val) => setBudgetPlan({
                        ...budgetPlan,
                        paymentProc: val,
                      })}
                      placeholder={t('Select')} 
                    />,
                    <FormInput
                      name="timeline"
                      type="date"
                      selectRange
                      value={budgetPlan.timeline} 
                      onChange={(val) => setBudgetPlan({
                        ...budgetPlan,
                        timeline: val,
                      })}
                    />,
                    <FormInput
                      name="comment"
                      value={budgetPlan.comment} 
                      onChange={(val) => setBudgetPlan({
                        ...budgetPlan,
                        comment: val,
                      })}
                      placeholder={t('Write note here')} 
                    />,
                    <IconButton
                      styling="primary"
                      width="70px"
                      onClick={(e) => {
                        e.preventDefault();
                        addBudgetPlan();
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
                            showBudgetPlanAdd: true,
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
                    t('Action'),
                  ])
                }
              />
              {
                values.otherResources && values.otherResources.map( (value, index) => {
                  return (
                    <TableRow key={value.id} headers={
                      getOtherResourcesSetting([
                        <FormInput
                          name={'otherActivity_' + value.id}
                          type="select"
                          options={options.activityOptions}
                          isMulti={false}
                          showIndicators={true}
                          value={value.activity} 
                          onChange = {val => onOtherResourceChange('activity', index, val)}
                          placeholder={t('Select')} 
                        />,
                        <FormInput
                          name={'otherResource_' + value.id}
                          type="select"
                          options={options.resourceOptions}
                          isMulti={false}
                          showIndicators={true}
                          value={value.resource} 
                          onChange = {val => onOtherResourceChange('resource', index, val)}
                          placeholder={t('Select')} 
                        />,
                        <FormInput
                          name={'otherDetails_' + value.id}
                          value={value.details} 
                          onChange = {val => onOtherResourceChange('details', index, val)}
                          placeholder={t('Write note here')} 
                        />,
                        <FormInput
                          name={'otherMainBudget_' + value.id}
                          value={value.mainBudget} 
                          onChange = {val => onOtherResourceChange('mainBudget', index, val)}
                          placeholder={t('Value')} 
                        />,
                        <FormInput
                          name={'otherComment_' + value.id}
                          value={value.comment} 
                          onChange = {val => onOtherResourceChange('comment', index, val)}
                          placeholder={t('Write note here')} 
                        />,
                        <IconButton
                          styling="danger"
                          width="70px"
                          onClick={(e) => {
                            e.preventDefault();
                            delOtherResource(index);
                          }}
                        >
                          <DeleteIcon color="white" /> {t('Delete')}
                        </IconButton>
                      ])
                    } />
                  )
                })
              }

              { showSettings.showOtherResourceAdd &&
                <TableRow headers={
                  getOtherResourcesSetting([
                    <FormInput
                      name="otherActivity"
                      type="select"
                      options={options.activityOptions}
                      isMulti={false}
                      showIndicators={true}
                      value={otherResource.activity} 
                      onChange={(val) => setOtherResource({
                        ...otherResource,
                        activity: val,
                      })}
                      placeholder={t('Select')} 
                    />,
                    <FormInput
                      name="otherResource"
                      type="select"
                      options={options.resourceOptions}
                      isMulti={false}
                      showIndicators={true}
                      value={otherResource.resource} 
                      onChange={(val) => setOtherResource({
                        ...otherResource,
                        resource: val,
                      })}
                      placeholder={t('Select')} 
                    />,
                    <FormInput
                      name="otherDetails"
                      value={otherResource.details} 
                      onChange={(val) => setOtherResource({
                        ...otherResource,
                        details: val,
                      })}
                      placeholder={t('Write note here')} 
                    />,
                    <FormInput
                      name="otherMainBudget"
                      value={otherResource.mainBudget} 
                      onChange={(val) => setOtherResource({
                        ...otherResource,
                        mainBudget: val,
                      })}
                      placeholder={t('Value')} 
                    />,
                    <FormInput
                      name="otherComment"
                      value={otherResource.comment} 
                      onChange={(val) => setOtherResource({
                        ...otherResource,
                        comment: val,
                      })}
                      placeholder={t('Write note here')} 
                    />,
                    <IconButton
                      styling="primary"
                      width="70px"
                      onClick={(e) => {
                        e.preventDefault();
                        addOtherResource();
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
                            showOtherResourceAdd: true,
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
      </ResourcesFormProvider>
    </TableContent>
  );
};
