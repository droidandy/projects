import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { CalcExcellence } from 'src/types';
import { DisplayTransString } from 'src/components/DisplayTransString';

interface ExcellenceRowDetailsProps {
  className?: string;
  item: CalcExcellence;
}

const Label = styled.div`
  font-weight: bold;
`;

const Value = styled.div``;

const Item = styled.div``;

const Sep = styled.div`
  width: 1px;
  height: 14px;
  background: #cbd6dc;
  margin-left: 40px;
  margin-right: 40px;
`;

const _ExcellenceRowDetails = (props: ExcellenceRowDetailsProps) => {
  const { className, item } = props;
  const { t } = useTranslation();
  return (
    <div className={className}>
      <Item>
        <Label>{t('Theme')}</Label>
        <Value>
          {item.excellenceTheme ? (
            <DisplayTransString value={item.excellenceTheme.name} />
          ) : (
            '-'
          )}
        </Value>
      </Item>
      <Sep />
      <Item>
        <Label>{t('Criteria')}</Label>
        <Value>
          {item.excellenceCriteria && item.excellenceCriteria.parentCriteria ? (
            <DisplayTransString
              value={item.excellenceCriteria.parentCriteria.name}
            />
          ) : (
            '-'
          )}
        </Value>
      </Item>
      <Sep />
      <Item>
        <Label>{t('Subcriteria')}</Label>
        <Value>
          {item.excellenceCriteria ? (
            <DisplayTransString value={item.excellenceCriteria.name} />
          ) : (
            '-'
          )}
        </Value>
      </Item>
      <Sep />
      <Item>
        <Label>{t('Status')}</Label>
        <Value>
          {t(
            item.requirementStatus === 'NotExist'
              ? 'Not Exist'
              : item.requirementStatus
          )}
        </Value>
      </Item>
      <Sep />
      <Item>
        <Label>{t('Active')}</Label>
        <Value>{t(item.isEnabled ? 'Yes' : 'No')}</Value>
      </Item>
      <Sep />
      <Item>
        <Label>{t('Completed')}</Label>
        <Value>{t(item.isCompleted ? 'Yes' : 'No')}</Value>
      </Item>
    </div>
  );
};

export const ExcellenceRowDetails = styled(_ExcellenceRowDetails)`
  display: flex;
  background: #f7f9fc;
  color: #244159;
  padding: 17px 30px;
  align-items: center;
`;
