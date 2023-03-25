import React from 'react';
import { getRoleState, RoleActions } from '../interface';
import { Page } from 'src/components/Page';
import { Portlet } from 'src/components/Portlet';
import { DetailsSkeleton } from 'src/components/DetailsSkeleton';
import {
  RoleFormProvider,
  RoleFormActions,
  getRoleFormState,
} from '../role-form';
import { FormItem } from 'src/components/FormItem';
import { FormInput } from 'src/components/ReduxInput';
import { RequiredNote } from 'src/components/RequiredNote';
import { BackButton } from 'src/components/BackButton';
import { useActions } from 'typeless';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { Checkbox } from 'src/components/Checkbox';
import { SaveButtons } from 'src/components/SaveButtons';
import { Trans } from 'react-i18next';
import { PermissionMap } from 'src/types-next';
import { Row, Col } from 'src/components/Grid';

export const RoleView = () => {
  const {
    isLoading,
    role,
    isSaving,
    isDeleting,
    permissions,
  } = getRoleState.useState();
  const {
    values: { permissionMap = {} as PermissionMap },
    errors,
    touched,
  } = getRoleFormState.useState();
  const { submit, change } = useActions(RoleFormActions);
  const { remove } = useActions(RoleActions);

  const renderDetails = () => {
    if (isLoading) {
      return <DetailsSkeleton />;
    }
    return (
      <RoleFormProvider>
        <form
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          <BackButton href="/settings/roles" />
          <RequiredNote />
          <Row>
            <Col>
              <FormItem label="Name" required>
                <FormInput name="name" langSuffix />
              </FormItem>
            </Col>
            <Col>
              <FormItem label="Slug" required>
                <FormInput name="slug" />
              </FormItem>
            </Col>
          </Row>
          <FormItem label="Description" required>
            <FormInput name="description" />
          </FormItem>

          <FormItem label="Permissions" required>
            <div>
              {permissions.map(perm => (
                <div key={perm.name}>
                  <Checkbox
                    checked={!!permissionMap[perm.name]}
                    onChange={() => {
                      const copy = { ...permissionMap };
                      if (copy[perm.name]) {
                        delete copy[perm.name];
                      } else {
                        copy[perm.name] = perm;
                      }
                      change('permissionMap', copy);
                    }}
                  >
                    {perm.name}
                  </Checkbox>
                </div>
              ))}
              {errors.permissionMap && touched.permissionMap && (
                <ErrorMessage>
                  <Trans>{errors.permissionMap}</Trans>
                </ErrorMessage>
              )}
            </div>
          </FormItem>
          <button type="submit" style={{ display: 'none' }} />
        </form>
        <SaveButtons
          showDelete={!!role}
          onCancel="/settings/roles"
          onSave={submit}
          isSaving={isSaving}
          isDeleting={isDeleting}
          onDelete={remove}
        />
      </RoleFormProvider>
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
