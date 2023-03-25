import React, { useEffect, useState } from 'react'
import { useActions } from 'typeless';
import { useTranslation } from 'react-i18next';
import { SelectOption } from 'src/types';
import { 
  useChangeManagementForm, 
  ChangeManagementFormActions, 
  ChangeManagementFormProvider, 
  getChangeManagementFormState,
} from '../../forms/change-management-form';
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
import { SaveAction } from '../../const';
import {
  getChangeManagementSetting,
  defaultChangemanagement,
} from './const';

export const ChangeManagementView = () => {
  const { t } = useTranslation();
  const { options, projectId } = getNewProjectState.useState();
  const { cancel, saveProjectChangeManagement } = useActions(NewProjectActions);
  const { submit, change, changeMany } = useActions(ChangeManagementFormActions);
  const [ newManagement, setNewManagement ] = useState({ ...defaultChangemanagement });
  const [ showSettings, setShowSettings ] = useState({ showChangeManagementAdd: false });  

  useChangeManagementForm();
  useEffect(() => {
    changeMany(getNewProjectState().changeManagement);
  }, []);

  const { values } = getChangeManagementFormState.useState();
  
  //Risk Management handlers
  const onChangeManagement = (name:string, index: number, value: any) => {
    const current: any = [ ...values.changeManagements ][index];
    if (current[name] === value) return;
    current[name] = value;
    if (!projectId) return;
    const changeManagement = {
      initiativeItemId: projectId,
      needForChange: {
        en: current.needForChange ? current.needForChange : null,
        ar: current.needForChange ? current.needForChange : null,
      },
      description: {
        en: current.description ? current.description : null,
        ar: current.description ? current.description : null,
      },
      changeScopeId: current.changeScope ? current.changeScope.value : null,
      affectedPartiesId: current.affectedParties ? current.affectedParties.value : null,
      requiredAction: current.requiredAction ? (current.requiredAction as SelectOption[]).map( item => { return item.value; } ) : [],
      startDate: current.timeline[0],
      endDate: current.timeline[1],
    }
    saveProjectChangeManagement(SaveAction.Update, changeManagement, current.id);
  }

  const addManagement = () => {
    const current: any = newManagement;
    if (!projectId) return;
    const changeManagement = {
      initiativeItemId: projectId,
      needForChange: {
        en: current.needForChange ? current.needForChange : null,
        ar: current.needForChange ? current.needForChange : null,
      },
      description: {
        en: current.description ? current.description : null,
        ar: current.description ? current.description : null,
      },
      changeScopeId: current.changeScope ? current.changeScope.value : null,
      affectedPartiesId: current.affectedParties ? current.affectedParties.value : null,
      requiredAction: current.requiredAction ? (current.requiredAction as SelectOption[]).map( item => { return item.value; } ) : [],
      startDate: current.timeline[0],
      endDate: current.timeline[1],
    }
    saveProjectChangeManagement(SaveAction.Create, changeManagement, -1);
  }

  const delManagement = (index: number) => {
    const id = values.changeManagements[index].id;
    saveProjectChangeManagement(SaveAction.Delete, null, id);
  }

  return (
    <TableContent>
      <ChangeManagementFormProvider>
        <TableForm
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          <TableBody>
            <Table>
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
                    t('Action'),
                  ])
                }
              />

              {
                values.changeManagements && values.changeManagements.map( (value, index) => {
                  return (
                    <TableRow key={value.id} headers={
                      getChangeManagementSetting([
                        <FormInput
                          name={'needForChange_' + index}
                          value={value.needForChange} 
                          placeholder={t('Text Area')}
                          onChange = {val => onChangeManagement('needForChange', index, val)}
                        />,
                        <FormInput
                          name={'description_' + index}
                          value={value.description} 
                          placeholder={t('Text Area')}
                          onChange = {val => onChangeManagement('description', index, val)}
                        />,
                        <FormInput
                          name={'changeScope_' + index}
                          type="select"
                          options={options.changeScopeOptions}
                          isMulti={false}
                          showIndicators={true}
                          value={value.changeScope} 
                          placeholder={t('Select')}
                          onChange = {val => onChangeManagement('changeScope', index, val)}
                        />,
                        <FormInput
                          name={'affectedParties_' + index}
                          type="select"
                          options={options.affectedPartiesOptions}
                          isMulti={false}
                          showIndicators={true}
                          value={value.affectedParties} 
                          placeholder={t('Select')}
                          onChange = {val => onChangeManagement('affectedParties', index, val)}
                        />,
                        <FormInput
                          name={'requiredAction_' + index}
                          type="select"
                          options={options.requiredActionOptions}
                          isMulti={true}
                          value={value.requiredAction} 
                          placeholder={t('Write')}
                          onChange = {val => onChangeManagement('requiredAction', index, val)}
                        />,
                        <FormInput
                          name={'timeline_' + index}
                          type="date"
                          selectRange
                          value={value.timeline} 
                          onChange = {val => onChangeManagement('timeline', index, val)}
                        />,
                        <IconButton
                          styling="danger"
                          width="70px"
                          onClick={(e) => {
                            e.preventDefault();
                            delManagement(index);
                          }}
                        >
                          <DeleteIcon color="white" /> {t('Delete')}
                        </IconButton>
                      ])
                    } />
                  )
                })
              }

              { showSettings.showChangeManagementAdd &&
                <TableRow headers={
                  getChangeManagementSetting([
                    <FormInput
                      name="needForChange"
                      value={newManagement.needForChange} 
                      placeholder={t('Text Area')}
                      onChange={(val) => setNewManagement({
                        ...newManagement,
                        needForChange: val,
                      })}
                    />,
                    <FormInput
                      name="description"
                      value={newManagement.description} 
                      placeholder={t('Text Area')}
                      onChange={(val) => setNewManagement({
                        ...newManagement,
                        description: val,
                      })}
                    />,
                    <FormInput
                      name="changeScope"
                      type="select"
                      options={options.changeScopeOptions}
                      isMulti={false}
                      showIndicators={true}
                      value={newManagement.changeScope} 
                      placeholder={t('Select')}
                      onChange={(val) => setNewManagement({
                        ...newManagement,
                        changeScope: val,
                      })}
                    />,
                    <FormInput
                      name="affectedParties"
                      type="select"
                      options={options.affectedPartiesOptions}
                      isMulti={false}
                      showIndicators={true}
                      value={newManagement.affectedParties} 
                      placeholder={t('Select')}
                      onChange={(val) => setNewManagement({
                        ...newManagement,
                        affectedParties: val,
                      })}
                    />,
                    <FormInput
                      name="requiredAction"
                      type="select"
                      options={options.requiredActionOptions}
                      isMulti={true}
                      value={newManagement.requiredAction} 
                      placeholder={t('Write')}
                      onChange={(val) => setNewManagement({
                        ...newManagement,
                        requiredAction: val,
                      })}
                    />,
                    <FormInput
                      name="timeline"
                      type="date"
                      selectRange
                      value={newManagement.timeline} 
                      onChange={(val) => setNewManagement({
                        ...newManagement,
                        timeline: val,
                      })}
                    />,
                    <IconButton
                      styling="primary"
                      width="70px"
                      onClick={(e) => {
                        e.preventDefault();
                        addManagement();
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
                            showChangeManagementAdd: true,
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
      </ChangeManagementFormProvider>
    </TableContent>
  );
};
