import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'src/components/Link';

interface TreeItemProps {
  className?: string;
  isExpanded?: boolean;
  depth: number;
  onToggleExpanded?: () => void;
  onClick?: () => void;
  children: React.ReactNode;
  active?: boolean;
  hasChildren?: boolean;
  clickable?: boolean;
  href?: string | null;
  isDisabled?: boolean;
}

const IconWrapper = styled.div`
  &:hover {
    opacity: 0.5;
    cursor: pointer;
  }
  display: flex;
  align-items: center;
  height: 100%;
`;

const _TreeItem = (props: TreeItemProps) => {
  const {
    className,
    isExpanded,
    onToggleExpanded,
    children,
    href,
    onClick,
  } = props;
  return (
    <Link href={href || undefined} className={className} onClick={onClick}>
      <IconWrapper
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          if (onToggleExpanded) {
            onToggleExpanded();
          }
        }}
      >
        {isExpanded ? (
          <i className="la la-angle-down" />
        ) : (
          <i className="la la-angle-right" />
        )}
      </IconWrapper>
      {children}
    </Link>
  );
};

export const TreeItem = styled(_TreeItem)`
  display: flex;
  align-items: center;
  padding: 5px;
  padding-left: ${props => props.depth * 10 + 5}px;
  color: #646c9a;
  i {
    margin-right: 5px;
  }
  border-radius: 4px;
  cursor: default;
 
  ${props =>
    props.clickable &&
    `
    &:hover {
      color: #374afb;
      background-color: #f8f8fb;
      cursor: pointer;
    }
  `}

  ${props =>
    props.active &&
    props.clickable &&
    `
    && {
      color: #ffffff;
      background-color: #374afb;
    } 
  `}
  ${IconWrapper} {
    visibility: ${props =>
      props.hasChildren && props.clickable ? 'visible' : 'hidden'};
  }
  
  opacity: ${props => (props.isDisabled ? '0.5 !important' : null)};
`;
