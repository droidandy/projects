import React from 'react';
import { UserMenuItem } from './UserMenuItem';
import styled from 'styled-components';
import { Button } from './Button';
import { GlobalActions, getGlobalState } from 'src/features/global/interface';
import { useActions } from 'typeless';
import { useTranslation } from 'react-i18next';
import { MenuDropdown } from './MenuDropdown';
import { Select } from './Select';
import { useLanguage } from 'src/hooks/useLanguage';

const DropdownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.6rem 1.5rem;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: block;
  margin-top: 16px;
`;

const SelectWrapper = styled.div`
  min-width: 250px;
`;

export function UserDropdown() {
  const lang = useLanguage();
  const { logout, changeStrategicPlan } = useActions(GlobalActions);
  const { currentPlanId, strategicPlans } = getGlobalState.useState();
  const { t } = useTranslation();
  const strategicPlanOptions = React.useMemo(() => {
    if (!strategicPlans) {
      return [];
    }
    return strategicPlans.map(item => ({
      label: item.name[lang],
      value: item.id,
    }));
  }, [strategicPlans, lang]);

  return (
    <MenuDropdown
      placement="bottom-end"
      dropdown={
        <DropdownWrapper>
          <SelectWrapper>
            <Select
              label={t('Strategic Plan')}
              options={strategicPlanOptions}
              value={strategicPlanOptions.find(x => x.value === currentPlanId)}
              onChange={(item: any) => changeStrategicPlan(item!.value)}
            />
          </SelectWrapper>
          <ButtonWrapper>
            <Button styling="brand" bold block onClick={logout}>
              {t('Sign out')}
            </Button>
          </ButtonWrapper>
        </DropdownWrapper>
      }
    >
      <UserMenuItem />
    </MenuDropdown>
  );
}
