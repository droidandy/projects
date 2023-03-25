import React, { useEffect, useState } from 'react'
import { useActions } from 'typeless';
import { useTranslation } from 'react-i18next';
import { 
  useUserManagementForm, 
  UserManagementFormActions, 
  UserManagementFormProvider, 
  getUserManagementFormState
} from '../../forms/user-management-form';
import { DeleteIcon, PlusIcon } from '../../../icons';
import { NewProjectActions, getNewProjectState } from '../../interface';
import { FormInput } from '../../../common/FormInput';
import { Table, TableRow } from '../../../common/Table';
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
import { InitiativeItemUser } from '../../../shared/type';
import { getUserManagementSetting, defaultMember } from './const';

export const UserManagementView = () => {
  const { t } = useTranslation();
  const { options, projectId } = getNewProjectState.useState();
  const { cancel, saveUserManagement, addUserManagement, deleteUserManagement } = useActions(NewProjectActions);
  const { submit, changeMany, change } = useActions(UserManagementFormActions);
  const [ member, setMember ] = useState(defaultMember);

  useUserManagementForm();
  useEffect(() => {
    changeMany(getNewProjectState().userManagement);
  }, []);

  const { values } = getUserManagementFormState.useState();

  const onChange = (name: "owner" | "manager" | "members", value: any) => {
    if(JSON.stringify(values[name]) === JSON.stringify(value)) return;
    change(name, value);
    if (getNewProjectState().projectId) saveUserManagement();
  }

  const delMember = (index: number) => {
    if (!projectId) return;
    const current = [ ...values.members ];
    const user: InitiativeItemUser = {
      initiativeItemId: projectId,
      userOrgId: current[index].orgUserId,
      roleId: current[index].roleId,
    }
    current.splice(index, 1);
    change('members', current);
    deleteUserManagement(user);
  }

  const addMember = () => {
    if (!projectId || -1 === member.orgUserId || -1 === member.roleId) return;
    const current = [ ...values.members ];
    for (let i = 0 ; i < current.length ; i ++) {
      if (current[i].orgUserId == member.orgUserId
          && current[i].username == member.username
          && current[i].role == member.role) return;
    }
    current.push({
      ...member,
      id: (current.length ? current[current.length - 1].id + 1 : 1),
    });
    change('members', current);
    const user: InitiativeItemUser = {
      initiativeItemId: projectId,
      userOrgId: member.orgUserId,
      roleId: member.roleId,
    }
    addUserManagement(user);
  }

  return (
    <Content>
      <UserManagementFormProvider>
        <Form
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          <Header>
          {t('User Management')}
          </Header>
          <Body>
            <Label>{t('Project Owner')}</Label>
            <Inputs>
              <FormInput
                name="owner" 
                onChange={(value) => onChange('owner', value)}
                value={values.owner} 
                placeholder={t('Project Owner')} 
              />
              <Col>
                <Comment>{t('Please enter your Project Owner')}</Comment>
              </Col>
            </Inputs>

            <Label>{t('Project Manager')}</Label>
            <Inputs>
              <FormInput
                name="manager" 
                onChange={(value) => onChange('manager', value)}
                value={values.manager} 
                placeholder={t('Project Manager')} 
              />
              <Col>
                <Comment>{t('Please enter your Project Manager')}</Comment>
              </Col>
            </Inputs>

            <Label>{t('Project Members')}</Label>
            <Inputs>
              <Table>
                <TableRow 
                  background="#F7F9FC"
                  fontWeight="bold"
                  headers={getUserManagementSetting([
                    t('Username/Department'),
                    t('Role'),
                    t('Action')
                  ])
                }/>
                {
                  values.members && values.members.map(
                    (value, index) => {
                      return (
                        <TableRow
                          key={value.id}
                          color="#10A6E9"
                          headers={
                            getUserManagementSetting([
                              t(value.username),
                              t(value.role),
                              <IconButton
                                styling="danger"
                                width="100%"
                                onClick={(e) => {
                                  e.preventDefault();
                                  delMember(index);
                                }}
                              >
                                <DeleteIcon color="white" /> {t('Delete')}
                              </IconButton>
                            ])
                          }
                        />
                      );
                    }
                  )
                }

                <TableRow headers={
                  getUserManagementSetting([
                    <FormInput
                      name="username" 
                      type="select"
                      isMulti={false}
                      showIndicators={true}
                      options={options.usersOptions}
                      value={ -1 !== member.orgUserId ? {label: member.username, value: member.orgUserId} : undefined }
                      placeholder={t('Username/Department')} 
                      onChange={(val) => setMember({
                        ...member,
                        username: val.label,
                        orgUserId: val.value,
                      })}
                    />,
                    <FormInput
                      name="role" 
                      type="select"
                      isMulti={false}
                      showIndicators={true}
                      options={options.roleOptions}
                      placeholder={t('Role')} 
                      value={ -1 !== member.roleId ? {label: member.role, value: member.roleId} : undefined }
                      onChange={(val) => setMember({
                        ...member,
                        role: val.label,
                        roleId: val.value,
                      })}
                    />,
                    <IconButton
                      styling="primary"
                      width="100%"
                      onClick={(e) => {
                        e.preventDefault();
                        addMember();
                      }}
                    >
                      <PlusIcon color="white" /> {t('Add')}
                    </IconButton>
                  ])
                }/>
              </Table>
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
      </UserManagementFormProvider>
    </Content>
  );
};
