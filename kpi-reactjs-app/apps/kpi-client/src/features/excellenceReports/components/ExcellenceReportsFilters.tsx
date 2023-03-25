import * as React from 'react';
import styled from 'styled-components';
import {
  ExcellenceReportsActions,
  getExcellenceReportsState,
} from '../interface';
import { useActions } from 'typeless';
import { Row, Col } from 'src/components/Grid';
import { useTranslation } from 'react-i18next';
import { Select } from 'src/components/Select';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { Button } from 'src/components/Button';
import { documentOptions } from 'src/common/options';
import { Input } from 'src/components/FormInput';

interface DataEntryFilterProps {
  className?: string;
}

const _ExcellenceReportsFilters = (props: DataEntryFilterProps) => {
  const { className } = props;
  const { setFilter, clearFilters } = useActions(ExcellenceReportsActions);
  const { filter, units } = getExcellenceReportsState.useState();
  const unitOptions = units.map(el => {
    return {
      label: <DisplayTransString value={el.name} />,
      value: el.id,
    };
  });
  const { t } = useTranslation();

  return (
    <div className={className}>
      <Row>
        <Col>
          <Select
            isMulti
            placeholder={t('Unit')}
            options={unitOptions}
            value={filter.ownerUnits ? filter.ownerUnits : null}
            onChange={value => setFilter('ownerUnits', value)}
          />
        </Col>
        <Col>
          <Select
            isMulti
            placeholder={t('Responsible Unit')}
            options={unitOptions}
            value={filter.responsilbeUnits ? filter.responsilbeUnits : null}
            onChange={value => setFilter('responsilbeUnits', value)}
          />
        </Col>
        <Col />
        <Col
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            onClick={() => {
              clearFilters();
            }}
            style={{ background: '#066A99', borderColor: '#066A99' }}
          >
            {t('Clear')}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Select
            placeholder={t('Document Type')}
            options={documentOptions}
            value={filter.fileType ? filter.fileType : null}
            onChange={value => setFilter('fileType', value)}
          />
        </Col>
        <Col>
          <InputField
            placeholder={t('Report Id')}
            value={filter.reportId ? filter.reportId : ''}
            type="number"
            onChange={value => setFilter('reportId', value.target.value)}
          />
        </Col>
        <Col />
        <Col />
      </Row>
    </div>
  );
};

const InputField = styled(Input)`
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
`;

export const ExcellenceReportsFilters = styled(_ExcellenceReportsFilters)`
  display: block;
  padding: 20px 30px;
  ${Row} + ${Row} {
    margin-top: 15px;
  }
`;
