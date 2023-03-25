import React from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Th, Td } from 'src/components/Table';
import { Checkbox } from 'src/components/Checkbox';
import { ConfirmDeleteLink } from 'src/components/ConfirmDeleteLink';
import { useActions } from 'typeless';
import {
  OrganizationUnitModalActions,
  getOrganizationUnitModalState,
} from './OrganizationUnitModal';
import { EmptyOrgUsers } from 'src/features/organizationStructure/components/EmptyOrgUsers';
import { useLanguage } from 'src/hooks/useLanguage';

export function OrganizationUserTable() {
  const { deleteUnitUser, changeUnitField } = useActions(
    OrganizationUnitModalActions
  );
  const { isLoading, users } = getOrganizationUnitModalState();
  const { t } = useTranslation();
  const lang = useLanguage();

  if (!users.length && !isLoading) {
    return <EmptyOrgUsers />;
  }

  return (
    <>
      {!isLoading && (
        <Table style={{ margin: '20px 0' }}>
          <thead>
            <tr>
              <Th>{t('User')}</Th>
              <Th>{t('Role')}</Th>
              <Th>{t('Primary')}</Th>
              <Th>{t('Leave')}</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {users.map((item: any, index: any) => {
              return (
                <tr key={index}>
                  <Td>{item.orgUser.user.name[lang]}</Td>
                  <Td>{item.role}</Td>
                  <Td>
                    <Checkbox
                      style={{ marginBottom: '0px' }}
                      onChange={() => {
                        changeUnitField('primary', index);
                      }}
                      checked={item.primary}
                    />
                  </Td>
                  <Td>
                    <Checkbox
                      style={{ marginBottom: '0px' }}
                      onChange={() => {
                        changeUnitField('onLeave', index);
                      }}
                      checked={item.onLeave}
                    />
                  </Td>
                  <Td>
                    <ConfirmDeleteLink
                      onYes={() => {
                        deleteUnitUser(index);
                      }}
                    />
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </>
  );
}
