import React from 'react';
import * as Rx from 'src/rx';
import { Modal } from 'src/components/Modal';
import { useActions, createModule } from 'typeless';
import { Trans } from 'react-i18next';
import { OrganizationUserTable } from './OrganizationUserTable';
import { OrganizationUnitModalSymbol } from '../symbol';
import { getGlobalState, GlobalActions } from 'src/features/global/interface';
import {
  searchOrganizationUnitUser,
  searchOrgUsers,
  getAllOrganizationUnit,
} from 'shared/API';
import { catchErrorAndShowModal } from 'src/common/utils';
import { Spinner } from 'src/components/Spinner';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { OrganizationUnit, OrganizationUnitUser, OrgUser } from 'shared/types';
import {
  OrganizationUnitForm,
  useOrganizationUnitForm,
  OrganizationUnitFormActions,
} from './OrganizationUnitForm';
import { Button } from 'src/components/Button';
import { rtlMargin } from 'shared/rtl';
import { StickyBottomBar } from 'src/components/StickyBottomBar';
import { updateOrganizationUnit } from 'src/services/API-next';
import { useLanguage } from 'src/hooks/useLanguage';
import { OrganizationStructureActions } from '../interface';

const SpinnerWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: calc(50% - 20px);
  z-index: 2;
`;

const Left = styled.div`
  ${rtlMargin('0', 'auto')}
`;
const Right = styled.div`
  ${rtlMargin('auto', '0')}
`;

export function OrganizationUnitModal() {
  useOrganizationUnitForm();
  handle();
  const {
    isVisible,
    isSaving,
    isLoading,
    unit,
  } = getOrganizationUnitModalState.useState();
  const { close, saveUnit } = useActions(OrganizationUnitModalActions);
  const { reset } = useActions(OrganizationUnitFormActions);
  const cancel = () => {
    close();
    reset();
  };
  const { t } = useTranslation();
  const lang = useLanguage();

  return (
    <Modal
      size="lg"
      isOpen={isVisible}
      title={<Trans>View {unit ? unit!.name[lang] : ''} Users</Trans>}
      close={cancel}
    >
      {(isLoading || isSaving) && (
        <SpinnerWrapper>
          <Spinner black size="40px" />
        </SpinnerWrapper>
      )}
      <div style={{ opacity: isSaving || isLoading ? 0.3 : 1 }}>
        <OrganizationUnitForm />
        <OrganizationUserTable />
        <StickyBottomBar style={{ paddingBottom: 0 }}>
          <Left>
            <Button styling="brand" onClick={() => cancel()}>
              {t('Cancel')}
            </Button>
          </Left>
          <Right>
            <Button onClick={() => saveUnit()}>{t('Save')}</Button>
          </Right>
        </StickyBottomBar>
      </div>
    </Modal>
  );
}

export const [
  handle,
  OrganizationUnitModalActions,
  getOrganizationUnitModalState,
] = createModule(OrganizationUnitModalSymbol)
  .withActions({
    show: (selectedUnit: OrganizationUnit) => ({ payload: { selectedUnit } }),
    close: null,
    setLoading: (isLoading: boolean) => ({ payload: { isLoading } }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    loaded: (users: OrganizationUnitUser[], orgUsers: OrgUser[]) => ({
      payload: {
        users,
        orgUsers,
      },
    }),
    saveUnit: () => ({ payload: {} }),
    addNewUnitUser: (newUser: any) => ({
      payload: { newUser },
    }),
    deleteUnitUser: (user: number) => ({ payload: { user } }),
    changeUnitField: (field: 'onLeave' | 'primary', idx: number) => ({
      payload: { field, idx },
    }),
    unitUserUpdated: (updatedUser: OrganizationUnitUser, idx: number) => ({
      payload: { updatedUser, idx },
    }),
  })
  .withState<OrgStructureState>();

interface OrgStructureState {
  isAdding: boolean;
  isVisible: boolean;
  isLoading: boolean;
  isSaving: boolean;
  users: OrganizationUnitUser[];
  unit: OrganizationUnit | null;
  orgUsers: OrgUser[] | null;
}

const initialState: OrgStructureState = {
  isAdding: false,
  isVisible: false,
  isLoading: false,
  isSaving: false,
  users: [],
  unit: null,
  orgUsers: [],
};

handle
  .epic()
  .on(OrganizationUnitModalActions.show, ({ selectedUnit }) => {
    const { organizationId, language } = getGlobalState();
    return Rx.concatObs(
      Rx.of(OrganizationUnitModalActions.setLoading(true)),
      Rx.forkJoin([
        searchOrganizationUnitUser({
          pageSize: 1e5,
          unitId: selectedUnit.id,
        }).pipe(Rx.map(x => x.items)),
        searchOrgUsers({
          pageSize: 1e5,
          orgId: organizationId,
          sortBy: `user.name.${language}`,
        }).pipe(Rx.map(x => x.items)),
      ]).pipe(
        Rx.mergeMap(([OrgUnitUsers, OrgUsers]) => {
          return [OrganizationUnitModalActions.loaded(OrgUnitUsers, OrgUsers)];
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(OrganizationUnitModalActions.setLoading(false))
    );
  })
  .on(OrganizationUnitModalActions.saveUnit, () => {
    const { users, unit } = getOrganizationUnitModalState();
    const mappedUsers = [...users].map(
      ({ role, primary, orgUserId, onLeave }) => ({
        role,
        primary,
        onLeave,
        orgUserId,
      })
    );
    const values = { ...unit, users: mappedUsers, children: [] };
    return Rx.concatObs(
      Rx.of(OrganizationUnitModalActions.setSaving(true)),
      updateOrganizationUnit(unit!.id, values).pipe(
        Rx.mergeMap(() => {
          return [
            OrganizationStructureActions.load(),
            GlobalActions.showNotification(
              'success',
              'Organization unit updated successfully'
            ),
          ];
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(OrganizationUnitModalActions.setSaving(false))
    );
  })
  .on(OrganizationUnitModalActions.changeUnitField, ({ field, idx }) => {
    const { users } = getOrganizationUnitModalState();
    const choosenUser = users[idx];
    if (field === 'primary') {
      const isExistPrimary = users.some(
        user => user[field] && user.role === choosenUser.role
      );
      if (!isExistPrimary || choosenUser[field]) {
        choosenUser[field] = !choosenUser[field];
        return OrganizationUnitModalActions.unitUserUpdated(choosenUser, idx);
      } else {
        return GlobalActions.showNotification(
          'error',
          'You cannot set this role as primary if at least one user already is primary'
        );
      }
    } else {
      choosenUser[field] = !choosenUser[field];
      return OrganizationUnitModalActions.unitUserUpdated(choosenUser, idx);
    }
  });

handle
  .reducer(initialState)
  .replace(OrganizationUnitModalActions.show, (state, { selectedUnit }) => ({
    ...initialState,
    isVisible: true,
    unit: selectedUnit || null,
  }))
  .on(OrganizationUnitModalActions.addNewUnitUser, (state, { newUser }) => {
    state.users = [...state.users, newUser];
  })
  .on(OrganizationUnitModalActions.deleteUnitUser, (state, { user }) => {
    state.users = state.users!.filter(
      (orgUnitUser: OrganizationUnitUser, idx: number) => idx !== user
    );
  })
  .on(OrganizationUnitModalActions.close, state => {
    state.isVisible = false;
  })
  .on(OrganizationUnitModalActions.loaded, (state, { users, orgUsers }) => {
    state.users = users;
    state.orgUsers = orgUsers;
  })
  .on(OrganizationUnitModalActions.setLoading, (state, { isLoading }) => {
    state.isLoading = isLoading;
  })
  .on(OrganizationUnitModalActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  })
  .on(
    OrganizationUnitModalActions.unitUserUpdated,
    (state, { updatedUser, idx }) => {
      state.users = state.users.map((user: OrganizationUnitUser) => {
        if (user === updatedUser) {
          user = updatedUser;
        }
        return user;
      });
    }
  );
