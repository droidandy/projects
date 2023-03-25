import React from 'react';
import * as R from 'remeda';
import { NoLabelItem } from 'src/components/NoLabelItem';
import { Table, Th, Td } from './Table';
import { FormCheckbox } from './FormCheckbox';
import { getTrans } from 'src/common/utils';
import { useTranslation } from 'react-i18next';
import { getReferencesNextState } from 'src/features/referencesNext/interface';
import { useLanguage } from 'src/hooks/useLanguage';
import { ConfirmDeleteLink } from './ConfirmDeleteLink';

interface UpdatersTableProps {
  updaters: number[];
  changeInfo: (name: string, value: any) => any;
  boolLabel: React.ReactNode;
  boolNameSuffix: string;
  isEditing: boolean;
}

export function UpdatersTable(props: UpdatersTableProps) {
  const { updaters, changeInfo, boolLabel, boolNameSuffix, isEditing } = props;
  const { users } = getReferencesNextState.useState();
  const userMap = React.useMemo(() => R.indexBy(users.users, x => x.id), [
    users,
  ]);
  const { t } = useTranslation();
  const lang = useLanguage();
  return (
    <NoLabelItem>
      {updaters.length > 0 && (
        <Table>
          <thead>
            <tr>
              <Th>{t('user')}</Th>
              <Th>{boolLabel}</Th>
              {isEditing && <Th></Th>}
            </tr>
          </thead>
          <tbody>
            {updaters.map(id => {
              const user = userMap[id];
              const prefix = `user_${id}_`;
              return (
                <tr key={id}>
                  <Td>{getTrans(lang, user.name)}</Td>
                  <Td>
                    <FormCheckbox
                      noMargin
                      name={`${prefix}${boolNameSuffix}`}
                      readOnlyText={!isEditing}
                    >
                      &nbsp;
                    </FormCheckbox>
                  </Td>
                  {isEditing && (
                    <Td>
                      <ConfirmDeleteLink
                        onYes={() => {
                          changeInfo(
                            'updaters',
                            updaters.filter(x => x !== id)
                          );
                        }}
                      />
                    </Td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </NoLabelItem>
  );
}
