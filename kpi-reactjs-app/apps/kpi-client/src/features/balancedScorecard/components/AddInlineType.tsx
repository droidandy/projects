import * as React from 'react';
import styled from 'styled-components';
import {
  BalancedScorecardItemAllowedParent,
  BalancedScorecardItem,
  Lookup,
} from 'src/types';
import { useTranslation } from 'react-i18next';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { Input } from 'src/components/FormInput';
import { Button } from 'src/components/Button';
import { BalancedScorecardActions } from '../interface';
import { useActions } from 'typeless';
import { RouterActions } from 'typeless-router';
import { BalancedScorecardItemType } from 'shared/types';

interface AddInlineTypeProps {
  className?: string;
  types: BalancedScorecardItemAllowedParent[];
  preselectedType?: Lookup;
  parent: BalancedScorecardItem | null;
  onDone?: () => void;
}

export const AddItemLink = styled.a`
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;
  color: #10a6e9;
  margin-top: 15px;
  display: inline-block;
`;

const FormWrapper = styled.div``;

const Label = styled.div`
  font-size: 12px;
  font-weight: bold;
  line-height: 15px;
  color: #244159;
  padding: 10px 0;
`;
const Row = styled.div`
  display: flex;
`;
const InputCol = styled.div`
  flex: 1 0 0;
  padding-left: 10px;
`;

const ButtonsCol = styled.div`
  ${Button} + ${Button} {
    margin-right: 10px;
  }
`;

const _AddInlineType = (props: AddInlineTypeProps) => {
  const { className, types, parent, onDone, preselectedType } = props;
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = React.useState<Lookup | null>(
    preselectedType || null
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const inputRef = React.useRef<null | HTMLInputElement>(null);
  const { addItem } = useActions(BalancedScorecardActions);
  const { push } = useActions(RouterActions);

  return (
    <div className={className}>
      {selectedType ? (
        <FormWrapper>
          <Label>
            <DisplayTransString value={selectedType} />
          </Label>
          <Row>
            <InputCol>
              <Input ref={inputRef} />
            </InputCol>
            <ButtonsCol>
              <Button
                styling="primary"
                loading={isLoading}
                onClick={() => {
                  const value = inputRef.current?.value;
                  if (!value) {
                    return;
                  }
                  setIsLoading(true);
                  addItem(selectedType!.id, parent, value, result => {
                    setIsLoading(false);
                    if (result === 'clear') {
                      setSelectedType(null);
                      if (onDone) {
                        onDone();
                      }
                    }
                  });
                }}
              >
                {t('Save')}
              </Button>
              <Button
                onClick={() => {
                  setSelectedType(null);
                  if (onDone) {
                    onDone();
                  }
                }}
                styling="secondary"
              >
                {t('Cancel')}
              </Button>
            </ButtonsCol>
          </Row>
        </FormWrapper>
      ) : (
        types.map(item => (
          <AddItemLink
            key={item.id}
            onClick={() => {
              if (item.typeId === BalancedScorecardItemType.KPI) {
                push('/create-kpi');
              } else {
                setSelectedType(item.type);
              }
            }}
          >
            {t('Add')} <DisplayTransString value={item.type} /> +
          </AddItemLink>
        ))
      )}
    </div>
  );
};

export const AddInlineType = styled(_AddInlineType)`
  display: block;
`;
