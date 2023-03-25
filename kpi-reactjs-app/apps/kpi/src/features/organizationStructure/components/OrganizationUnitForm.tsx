import React from 'react';
import { SelectOption } from 'src/types';
import { createForm } from 'typeless-form';
import { validateOption } from 'src/common/helper';
import { createModule } from 'typeless';
import {
  OrganizationUnitModalFormSymbol,
  OrganizationUnitModalUsersSymbol,
} from '../symbol';
import { OrganizationUnitFormFields } from './OrganizationUnitFormFields';
import {
  getOrganizationUnitModalState,
  OrganizationUnitModalActions,
} from './OrganizationUnitModal';
import { OrgUser } from 'shared/types';
import i18n from 'src/i18n';

export function OrganizationUnitForm() {
  handle();
  const { orgUsers, users } = getOrganizationUnitModalState.useState();

  return (
    <OrganizationUnitFormProvider>
      <OrganizationUnitFormFields users={users} orgUsers={orgUsers} />
    </OrganizationUnitFormProvider>
  );
}

export interface OrganizationUnitFormValues {
  user: SelectOption;
  role: SelectOption;
  primary: boolean;
  onLeave: boolean;
}

export const [
  useOrganizationUnitForm,
  OrganizationUnitFormActions,
  getOrganizationUnitFormState,
  OrganizationUnitFormProvider,
] = createForm<OrganizationUnitFormValues>({
  symbol: OrganizationUnitModalFormSymbol,
  validator: (errors, values) => {
    validateOption(errors, values, 'user');
    validateOption(errors, values, 'role');
  },
});

export const [handle] = createModule(OrganizationUnitModalUsersSymbol);

handle.epic().on(OrganizationUnitFormActions.setSubmitSucceeded, () => {
  const { orgUsers, users } = getOrganizationUnitModalState();
  const { values } = getOrganizationUnitFormState();

  if (values.role && values.primary) {
    const isAllowPrimary = !users.some(
      user => user.role === values.role!.value && !!user.primary
    );
    if (!isAllowPrimary) {
      const primaryError = {
        primary: i18n.t(
          'You cannot set this role as primary if at least one user already is primary'
        ),
      };
      return [
        OrganizationUnitFormActions.setErrors(primaryError),
        OrganizationUnitFormActions.setSubmitFailed(),
      ];
    }
  }
  const userId = values.user.id;
  const role = values.role.value;
  const primary = values.primary || false;
  const onLeave = false;
  const user = orgUsers!.find((orgUser: OrgUser) => orgUser.id === userId);
  const newOrgUnitUser = {
    role,
    primary,
    onLeave,
    orgUserId: userId,
    orgUser: user,
  };

  return [
    OrganizationUnitModalActions.addNewUnitUser(newOrgUnitUser),
    OrganizationUnitFormActions.reset(),
  ];
});
