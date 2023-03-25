import React from 'react';
import { getOrgUserState, OrgUserActions } from '../interface';
import { Page } from 'src/components/Page';
import { Portlet } from 'src/components/Portlet';
import { DetailsSkeleton } from 'src/components/DetailsSkeleton';
import {
  OrgUserFormProvider,
  OrgUserFormActions,
  getOrgUserFormState,
} from '../orgUser-form';
import { FormItem } from 'src/components/FormItem';
import { RequiredNote } from 'src/components/RequiredNote';
import { BackButton } from 'src/components/BackButton';
import { useActions } from 'typeless';
import { SaveButtons } from 'src/components/SaveButtons';
import { Row, Col } from 'src/components/Grid';
import { Checkbox } from 'src/components/Checkbox';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { useTranslation } from 'react-i18next';
import { FormSelect } from 'src/components/FormSelect';
import { useSelectOptions } from 'src/hooks/useSelectOptions';
import { useLoadUsers } from 'src/features/referencesNext/hooks';
import { getReferencesNextState } from 'src/features/referencesNext/interface';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { getGlobalState } from 'src/features/global/interface';

export const OrgUserView = () => {
  const {
    isLoading,
    orgUser,
    isSaving,
    isDeleting,
    roles,
  } = getOrgUserState.useState();
  const {
    values: { rolesMap = {} },
    errors,
    touched,
  } = getOrgUserFormState.useState();
  const { users } = getReferencesNextState.useState();
  const { submit, change } = useActions(OrgUserFormActions);
  const { remove } = useActions(OrgUserActions);
  const { t } = useTranslation();
  const userOptions = useSelectOptions(users.users);
  const { organizationUnits } = getGlobalState.useState();
  const unitOptions = useSelectOptions(organizationUnits);

  useLoadUsers();
  const renderDetails = () => {
    if (isLoading) {
      return <DetailsSkeleton />;
    }
    return (
      <OrgUserFormProvider>
        <BackButton href="/settings/org-users" />
        <RequiredNote />
        <form
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          <Row>
            <Col>
              <FormItem label="User" required labelTop>
                <FormSelect
                  name="user"
                  isLoading={!users.isLoaded}
                  options={userOptions}
                />
              </FormItem>
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col>
              <FormItem label="Unit" required labelTop>
                <FormSelect name="unit" options={unitOptions} />
              </FormItem>
            </Col>
            <Col></Col>
          </Row>

          <FormItem label="Roles" required>
            <div>
              {roles.map(role => (
                <div key={role.id}>
                  <Checkbox
                    checked={!!rolesMap[role.id]}
                    onChange={() => {
                      const copy = { ...rolesMap };
                      if (copy[role.id]) {
                        delete copy[role.id];
                      } else {
                        copy[role.id] = role.id;
                      }
                      change('rolesMap', copy);
                    }}
                  >
                    <DisplayTransString value={role.name} />
                  </Checkbox>
                </div>
              ))}
              {errors.rolesMap && touched.rolesMap && (
                <ErrorMessage>{t(errors.rolesMap)}</ErrorMessage>
              )}
            </div>
          </FormItem>
          <button type="submit" style={{ display: 'none' }} />
        </form>

        <SaveButtons
          showDelete={!!orgUser}
          onCancel="/settings/org-users"
          onSave={submit}
          isSaving={isSaving}
          isDeleting={isDeleting}
          onDelete={remove}
        />
      </OrgUserFormProvider>
    );
  };

  return (
    <>
      <Page>
        <Portlet padding>{renderDetails()}</Portlet>
      </Page>
    </>
  );
};
