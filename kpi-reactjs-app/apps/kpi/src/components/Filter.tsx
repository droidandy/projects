import React from 'react';
import styled from 'styled-components';
import { Button } from './Button';
import { FormItem, FormItemLabel } from './FormItem';
import { Trans } from 'react-i18next';
import { rtlMargin } from 'shared/rtl';
import { MOBILE } from 'src/common/utils';

export interface Field {
  label: React.ReactNode;
  control: React.ReactNode;
}

interface FilterProps {
  fields: Field[];
  applyFilter: () => any;
  clearFilter: () => any;
  toggleFilter: () => any;
  isFilterOpened: boolean;
}

const Buttons = styled.div`
  display: flex;
  align-items: center;
  button + button {
    ${rtlMargin('8px', 0)}
  }
  a {
    ${rtlMargin('8px', 0)}
  }
`;

const Wrapper = styled.div`
  padding: 20px;
  ${FormItem} {
    margin: 0;
  }
  ${FormItemLabel} {
    width: 80px;
  }
`;

const Row = styled.div`
  margin-bottom: 24px;
  display: flex;
  flex-wrap: wrap;
`;
const Col = styled.div`
  padding-left: 24px;
  padding-right: 24px;
  width: 33.333333%;
  margin-bottom: 24px;
  ${MOBILE} {
    width: 100%;
  }
`;

const Expanded = styled.a`
  white-space: pre;
  i {
    font-size: 0.6rem;
  }
`;

export const Filter = (props: FilterProps) => {
  const {
    fields,
    applyFilter,
    clearFilter,
    toggleFilter,
    isFilterOpened,
  } = props;
  const isAlwaysExpanded = fields.length <= 2;
  const buttons = (
    <Buttons
      style={{ justifyContent: isFilterOpened ? 'flex-end' : 'flex-start' }}
    >
      <Button onClick={applyFilter}>
        <Trans>Apply Filter</Trans>
      </Button>
      <Button onClick={clearFilter} styling="brand">
        <Trans>Clear Filter</Trans>
      </Button>
      {isAlwaysExpanded ? null : isFilterOpened ? (
        <Expanded onClick={toggleFilter}>
          <Trans>Collapse</Trans> <i className="flaticon2-arrow-up" />
        </Expanded>
      ) : (
        <Expanded onClick={toggleFilter}>
          <Trans>Expand</Trans> <i className="flaticon2-arrow-down" />
        </Expanded>
      )}
    </Buttons>
  );
  const renderContent = () => {
    if (isFilterOpened && !isAlwaysExpanded) {
      return (
        <>
          <Row>
            {fields.map((item, j) => (
              <Col key={j}>
                <FormItem label={item.label}>{item.control}</FormItem>
              </Col>
            ))}
            <Col>{buttons}</Col>
          </Row>
        </>
      );
    } else {
      const item1 = fields[0];
      const item2 = fields[1];
      return (
        <Row>
          <Col>
            {item1 && <FormItem label={item1.label}>{item1.control}</FormItem>}
          </Col>
          <Col>
            {item2 && <FormItem label={item2.label}>{item2.control}</FormItem>}
          </Col>
          <Col>{buttons}</Col>
        </Row>
      );
    }
  };
  return <Wrapper>{renderContent()}</Wrapper>;
};
