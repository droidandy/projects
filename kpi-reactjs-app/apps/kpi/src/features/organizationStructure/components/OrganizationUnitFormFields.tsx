import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { FormContext } from 'typeless-form';
import styled from 'styled-components';
import { FormSelect } from 'src/components/FormSelect';
import { FormCheckbox } from 'src/components/FormCheckbox';
import { Button } from '../../../components/Button';
import { Row, Col } from '../../../components/Grid';
import { FormItem } from '../../../components/FormItem';
import { OrganizationUnitUserRoleOptions } from '../../../common/options';
import { OrganizationUnitUser, OrgUser } from 'shared/types';
import { OrganizationUnitFormActions } from './OrganizationUnitForm';
import { useActions } from 'typeless';
import { getOrganizationUnitModalState } from './OrganizationUnitModal';
import { RequiredNote } from 'src/components/RequiredNote';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { useLanguage } from 'src/hooks/useLanguage';

const AddButton = styled(Button)`
  margin-top: 15px;
`;

interface OrganizationUnitFormFields {
  users: OrganizationUnitUser[];
  orgUsers: OrgUser[] | null;
}

export function OrganizationUnitFormFields(props: OrganizationUnitFormFields) {
  const { users, orgUsers } = props;
  const { t } = useTranslation();
  const lang = useLanguage();
  const { submit } = useActions(OrganizationUnitFormActions);
  const { isLoading } = getOrganizationUnitModalState();
  const { errors, touched } = React.useContext(FormContext);
  const filteredArray = orgUsers!.filter((item: OrgUser) => {
    return users;
  });
  const isAllowPrimary = !(!!errors.primary || touched.primary);

  const userOptions = React.useMemo(() => {
    if (!filteredArray) {
      return [];
    }
    return filteredArray.map((item: any) => ({
      label: <DisplayTransString value={item.user.name} />,
      value: item.user.name[lang],
      filterName: item.user.name[lang],
      id: item.id
    }));
  }, [filteredArray]);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        submit();
      }}
      style={{ marginBottom: isLoading ? '20px' : '0' }}
    >
      <RequiredNote />
      <Row>
        <Col>
          <FormItem label="User" required labelTop>
            <FormSelect name="user" options={userOptions} />
          </FormItem>
          <FormItem label="Role" required labelTop>
            <FormSelect name="role" options={OrganizationUnitUserRoleOptions} />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormItem label="Primary" labelTop>
            <FormCheckbox style={{ marginTop: '8px' }} name="primary">
              &nbsp;
            </FormCheckbox>
          </FormItem>
        </Col>
        <Col
          style={{ display: 'flex', alignItems: 'center', paddingTop: '14px' }}
        >
          {!isAllowPrimary && (
            <ErrorMessage>
              <Trans>{errors.primary}</Trans>
            </ErrorMessage>
          )}
        </Col>
        <AddButton>{t('Add')}</AddButton>
      </Row>
    </form>
  );
}
