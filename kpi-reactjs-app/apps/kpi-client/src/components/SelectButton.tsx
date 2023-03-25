import * as React from 'react';
import styled from 'styled-components';

interface SelectButtonProps {
  className?: string;
  children?: React.ReactNode;
}

const Sep = styled.span`
  align-self: stretch;
  background-color: #dee1e9;
  margin-bottom: 8px;
  margin-top: 8px;
  width: 1px;
  box-sizing: border-box;
`;

const Value = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  padding: 2px 8px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
`;

const Caret = styled.div`
  color: hsl(0, 0%, 80%);
  display: flex;
  padding: 8px;
  transition: color 150ms;
  box-sizing: border-box;
  svg {
    fill: currentColor;
    line-height: 1;
    stroke: currentColor;
    stroke-width: 0;
  }
  &:hover {
    color: hsl(0, 0%, 60%);
  }
`;

const _SelectButton = (props: SelectButtonProps) => {
  const { className, children } = props;
  return (
    <div className={className}>
      <Value>{children}</Value>
      <Sep />
      <Caret>
        <svg
          height="20"
          width="20"
          viewBox="0 0 20 20"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
        </svg>
      </Caret>
    </div>
  );
};

export const SelectButton = styled(_SelectButton)`
  width: 100%;
  background: white;
  align-items: center;
  background-color: hsl(0, 0%, 100%);
  border-color: #dee1e9;
  border-radius: 4px;
  border-style: solid;
  border-width: 1px;
  display: flex;
  min-height: 39px;
  outline: 0 !important;
  transition: all 100ms;
  box-sizing: border-box;
  padding-right: 8px;
  &:hover {
    border-color: hsl(0, 0%, 70%);
  }
`;
