import React from 'react';
import * as R from 'remeda';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FormSelect } from 'src/components/FormSelect';
import { getReferencesNextState } from 'src/features/referencesNext/interface';
import { useSelectOptions } from 'src/hooks/useSelectOptions';
import { Button } from './Button';
import { Row, Col } from './Grid';
import { FormItem } from './FormItem';
import { NoLabelItem } from 'src/components/NoLabelItem';

const AddButton = styled(Button)`
  margin-top: 15px;
`;

interface UpdatersFieldProps {
  submit: () => any;
  updaters: number[];
  checkbox: React.ReactNode;
}

export function UpdatersField(props: UpdatersFieldProps) {
  const { submit, updaters, checkbox } = props;
  const { t } = useTranslation();

  const { users } = getReferencesNextState.useState();
  const usersOptions = useSelectOptions(users.users);
  const filteredUsersOptions = React.useMemo(() => {
    const map = R.indexBy(updaters, x => x);
    return usersOptions.filter(x => !map[x.value]);
  }, [usersOptions, updaters]);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        submit();
      }}
    >
      <Row>
        <Col>
          <FormItem label="Updaters" required labelTop>
            <FormSelect
              isLoading={!users.isLoaded}
              name="user"
              options={filteredUsersOptions}
            />
          </FormItem>
        </Col>
        <Col>
          <AddButton>{t('add')}</AddButton>
        </Col>
      </Row>
      <NoLabelItem>{checkbox}</NoLabelItem>
    </form>
  );
}
