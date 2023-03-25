import * as React from 'react';
import styled from 'styled-components';
import { Manager, Reference, Popper } from 'react-popper';
import { Button } from './Button';

interface Option {
  text: string;
  value: string | number;
}

interface DropdownProps {
  className?: string;
  options: Option[];
  value: string | number;
  onChange: (option: Option) => any;
}

const Menu = styled.ul`
  box-shadow: 0px 0px 50px 0px rgba(82, 63, 105, 0.15);
  padding: 1rem 0;
  border-radius: 4px;
  margin: 0;
  list-style: none;
  background: white;
`;

interface MenuOptionProps {
  selected: boolean;
}

const MenuOption = styled.li<MenuOptionProps>`
  outline: none !important;
  padding: 10px 15px;
  background: ${props => (props.selected ? '#f7f8fa' : null)};
  &:hover {
    background: #f7f8fa;
    cursor: pointer;
  }
`;

export function Dropdown(props: DropdownProps) {
  const { value, options, onChange } = props;
  const [isOpen, setIsOpen] = React.useState(false);
  const current = React.useMemo(() => options.find(x => x.value === value), [
    value,
  ]);

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }
    const onClick = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
    };
  }, [isOpen]);

  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <Button
            small
            innerRef={ref}
            styling="brand"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>{current && current.text}</span>
            <i className={isOpen ? 'flaticon2-up' : 'flaticon2-down'} />
          </Button>
        )}
      </Reference>
      {isOpen && (
        <Popper placement="top">
          {({ ref, style, placement, arrowProps }) => (
            <Menu ref={ref} style={style} data-placement={placement}>
              {options.map((option, i) => (
                <MenuOption
                  selected={option.value === value}
                  onClick={() => {
                    onChange(option);
                  }}
                  key={i}
                >
                  {option.text}
                </MenuOption>
              ))}
            </Menu>
          )}
        </Popper>
      )}
    </Manager>
  );
}
