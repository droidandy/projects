import * as React from 'react';
import styled from 'styled-components';
import { Button, BaseButtonProps } from './Button';
import { ArrowIcon } from './ArrowIcon';
import { MenuDropdown } from './MenuDropdown';

interface MenuAddonButtonProps extends BaseButtonProps {
  className?: string;
  children: React.ReactNode;
  dropdown?: React.ReactNode;
  block?: boolean;
  large?: boolean;
  small?: boolean;
  loading?: boolean;
  bold?: boolean;
  elevate?: boolean;
  onClick?: () => any;
  styling?: 'primary' | 'brand' | 'brand2' | 'secondary';
  iconSize?: 'lg';
}
const DropdownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-shadow: 0px 0px 50px 0px rgba(82, 63, 105, 0.15);
  border-radius: 4px;
`;

const MainButton = styled(Button)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`;

const SplitButton = styled(Button)`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  position: relative;
  min-width: 0;
  &:before {
    display: block;
    content: ' ';
    border-left: 1px solid #fff;
    position: absolute;
    top: 10px;
    right: -1px;
    bottom: 10px;
    opacity: 0.3;
  }
`;

const _MenuAddonButton = (props: MenuAddonButtonProps) => {
  const { className, dropdown, ...buttonProps } = props;
  return (
    <div className={className}>
      <MainButton {...buttonProps} />
      <MenuDropdown dropdown={<DropdownWrapper>{dropdown}</DropdownWrapper>}>
        <SplitButton disabled={buttonProps.loading} styling={props.styling}>
          <ArrowIcon color="white" direction="down" />
        </SplitButton>
      </MenuDropdown>
    </div>
  );
};

export const MenuAddonButton = styled(_MenuAddonButton)`
  display: flex;
`;
