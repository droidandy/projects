import * as React from 'react';
import { getBalancedScorecardState } from '../interface';
import { MenuDropdown } from 'src/components/MenuDropdown';
import { DropdownWrapper } from 'src/components/DropdownWrapper';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { Button } from 'src/components/Button';
import { Lookup } from 'shared/types';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

interface AddRootItemButtonProps {
  className?: string;
  setSelectedType(type: Lookup | null): void;
}

const _AddRootItemButton = (props: AddRootItemButtonProps) => {
  const { className, setSelectedType } = props;
  const { t } = useTranslation();
  const { parentTypes } = getBalancedScorecardState.useState();
  const types = React.useMemo(() => parentTypes.filter(x => !x.parentType), [
    parentTypes,
  ]);
  return (
    <div className={className}>
      {' '}
      <MenuDropdown
        placement="bottom-end"
        dropdown={
          <DropdownWrapper>
            {types.map(item => (
              <a key={item.id} onClick={() => setSelectedType(item.type)}>
                <div />
                <DisplayTransString value={item.type} />
              </a>
            ))}
          </DropdownWrapper>
        }
      >
        <Button styling="primary">+ {t('Create New Item')}</Button>
      </MenuDropdown>
    </div>
  );
};

export const AddRootItemButton = styled(_AddRootItemButton)`
  display: block;
`;
