import * as React from 'react';
import styled from 'styled-components';
import { OrganizationUnit } from 'src/types';
import { ArrowIcon } from './ArrowIcon';
import { DisplayTransString } from './DisplayTransString';
import { API_BASE_URL } from 'shared/API';

interface UnitAccordionProps {
  className?: string;
  unit: OrganizationUnit;
  children: React.ReactNode;
  style?: object;
  buttons?: React.ReactNode;
}

const UnitRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  font-weight: bold;
  font-size: 12px;
  padding: 10px 30px;
  border: none;
  cursor: pointer;

  ${ArrowIcon} {
    margin: 0 6px;
  }
`;

const Avatar = styled.div`
  width: 30px;
  height: 30px;
  font-weight: 500;
  font-size: 13px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-left: 10px;
  img {
    width: 30px;
    height: 30px;
  }
  overflow: hidden;
`;

const Buttons = styled.div`
  margin-left: 0;
  margin-right: auto;
`;

const _UnitAccordion = (props: UnitAccordionProps) => {
  const { className, unit, children, style, buttons } = props;
  const [isExpanded, setIsExpanded] = React.useState(true);
  return (
    <div className={className} style={style}>
      <UnitRow
        style={{
          background: '#EDF2FA',
          fontSize: '12px',
          height: '84px',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Avatar
          style={{
            background: '#10A6E9',
          }}
        >
          <img
            src={`${API_BASE_URL}/api/documents/files?token=${unit.icon?.downloadToken}`}
          />
        </Avatar>
        <DisplayTransString value={unit.name} />
        <ArrowIcon direction={isExpanded ? 'up' : 'down'} />
        {buttons && (
          <Buttons
            onClick={e => {
              e.stopPropagation();
            }}
          >
            {buttons}
          </Buttons>
        )}
      </UnitRow>
      {isExpanded && children}
    </div>
  );
};

export const UnitAccordion = styled(_UnitAccordion)`
  display: block;
  margin-top: 5px;
  background: #ffffff;
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.03);
  border-radius: 0px 0px 3px 3px;
  color: #646c9a;
`;
