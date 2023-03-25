import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'src/components/Link';
import { StrategicPlanActions, getStrategicPlanState } from '../interface';
import { FormItem } from 'src/components/FormItem';
import { FormInput } from 'src/components/ReduxInput';
import { Col } from 'src/components/Grid';
import { AddButton } from 'src/components/AddButton';
import { useActions } from 'typeless';
import {
  StrategicPlanFormValuesProvider,
  StrategicPlanFormValuesActions,
} from './StrategicPlanForm';
import { StrategicPlanIconView } from 'src/components/StrategicPlanIconView';
import styled from 'styled-components';
import { CustomRow } from './StrategicPlanView';
import { rtlMargin } from 'shared/rtl';

export const Wrapper = styled.div`
  display: flex
  justify-content: flex-end  
`;

export const WrapperButtons = styled.div`
  display: flex
  flex-direction: column
  align-self: flex-end
  align-items: flex-end;
`;

export const WrapperIcon = styled.div`
  display: flex
  align-self: center
    ${rtlMargin('0px', '15px')}
`;

const ValuesFieldWrapper = styled.div`
  display: flex
  justify-content: flex-end
  margin-bottom: 10px;
`;

export function StrategicPlanFields() {
  const { t } = useTranslation();
  const fileRef = React.useRef(null as HTMLInputElement | null);
  const [field, setField] = React.useState('');
  const [fileKey, setFileKey] = React.useState(1);
  const { uploadIcon } = useActions(StrategicPlanActions);
  const { icons } = getStrategicPlanState();
  const { submit } = useActions(StrategicPlanFormValuesActions);

  return (
    <StrategicPlanFormValuesProvider>
      <form
        onSubmit={e => {
          e.preventDefault();
        }}
      >
        <input
          accept="image/*"
          ref={fileRef}
          type="file"
          key={fileKey}
          style={{ display: 'none' }}
          onChange={e => {
            const file = e.target.files![0];
            uploadIcon({ file, field });
            setFileKey(fileKey + 1);
          }}
        />
        <CustomRow>
          <Col>
            <FormItem label="Values - En" required>
              <FormInput multiline name="values_en" />
            </FormItem>
            <FormItem label="Values - Ar" required>
              <FormInput multiline name="values_ar" />
            </FormItem>
          </Col>
          <Wrapper>
            <WrapperIcon>
              <StrategicPlanIconView
                width={150}
                height={150}
                icons={icons}
                field="values"
              />
            </WrapperIcon>
            <ValuesFieldWrapper>
              <WrapperButtons>
                <Link
                  onClick={() => {
                    fileRef.current!.click();
                    setField('values');
                  }}
                  style={{ marginBottom: '60px' }}
                >
                  <i className="flaticon2-image-file" /> {t('Upload icon')}
                </Link>
                <AddButton onClick={submit}>{t('Add')}</AddButton>
              </WrapperButtons>
            </ValuesFieldWrapper>
          </Wrapper>
        </CustomRow>
      </form>
    </StrategicPlanFormValuesProvider>
  );
}
