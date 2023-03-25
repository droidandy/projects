import React, { useState } from 'react';
import { getStrategicPlanState, StrategicPlanActions } from '../interface';
import { Page } from 'src/components/Page';
import { Portlet } from 'src/components/Portlet';
import { DetailsSkeleton } from 'src/components/DetailsSkeleton';
import { StrategicPlanFormProvider } from '../strategicPlan-form';
import { FormItem } from 'src/components/FormItem';
import { FormInput } from 'src/components/ReduxInput';
import { RequiredNote } from 'src/components/RequiredNote';
import { BackButton } from 'src/components/BackButton';
import { useActions } from 'typeless';
import { SaveButtons } from 'src/components/SaveButtons';
import { useTranslation } from 'react-i18next';
import { Link } from 'src/components/Link';
import { StrategicPlanIconView } from 'src/components/StrategicPlanIconView';
import { StrategicPlanForm } from './StrategicPlanForm';
import { Col, Row } from 'src/components/Grid';
import { Wrapper, WrapperButtons } from './StrategicPlanFields';
import styled from 'styled-components';
import { rtlMargin } from 'shared/rtl';

export const CustomRow = styled(Row)`
  textarea {
    max-width: calc(100% - 140px);
  }
`;

export const IconWrapper = styled.div`
  display: flex
  align-self: center
  ${rtlMargin('0px', '30px')}
`;

export const StrategicPlanView = () => {
  const { t } = useTranslation();
  const fileRef = React.useRef(null as HTMLInputElement | null);
  const [field, setField] = useState('');
  const [fileKey, setFileKey] = React.useState(1);
  const {
    isLoading,
    strategicPlan,
    isSaving,
    icons,
  } = getStrategicPlanState.useState();
  const { uploadIcon, validateForm } = useActions(StrategicPlanActions);

  const renderDetails = () => {
    if (isLoading) {
      return <DetailsSkeleton />;
    }

    return (
      <>
        <StrategicPlanFormProvider>
          <form
            onSubmit={e => {
              e.preventDefault();
              validateForm();
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
            <BackButton href="/settings/strategic-plans" />
            <RequiredNote />
            <FormItem label="Name - En" required>
              <FormInput name="name_en" />
            </FormItem>
            <FormItem label="Name - Ar" required>
              <FormInput name="name_ar" />
            </FormItem>
            <FormItem label="Description - En" required>
              <FormInput name="description_en" />
            </FormItem>
            <FormItem label="Description - Ar" required>
              <FormInput name="description_ar" />
            </FormItem>
            <FormItem label="Start Year" required>
              <FormInput name="startYear" />
            </FormItem>
            <FormItem label="End Year" required>
              <FormInput name="endYear" />
            </FormItem>
            <CustomRow>
              <Col>
                <FormItem label="Vision - En" required>
                  <FormInput multiline name="vision_en" />
                </FormItem>
                <FormItem label="Vision - Ar" required>
                  <FormInput multiline name="vision_ar" />
                </FormItem>
              </Col>
              <Wrapper>
                <IconWrapper>
                  <StrategicPlanIconView
                    width={150}
                    height={150}
                    icons={icons}
                    field="vision"
                  />
                </IconWrapper>
                <WrapperButtons style={{ alignSelf: 'center' }}>
                  <Link
                    onClick={() => {
                      fileRef.current!.click();
                      setField('vision');
                    }}
                  >
                    <i className="flaticon2-image-file" /> {t('Upload icon')}
                  </Link>
                </WrapperButtons>
              </Wrapper>
            </CustomRow>
            <CustomRow>
              <Col>
                <FormItem label="Mission - En" required>
                  <FormInput multiline name="mission_en" />
                </FormItem>
                <FormItem label="Mission - Ar" required>
                  <FormInput multiline name="mission_ar" />
                </FormItem>
              </Col>
              <Wrapper>
                <IconWrapper>
                  <StrategicPlanIconView
                    width={150}
                    height={150}
                    icons={icons}
                    field="mission"
                  />
                </IconWrapper>
                <WrapperButtons style={{ alignSelf: 'center' }}>
                  <Link
                    onClick={() => {
                      fileRef.current!.click();
                      setField('mission');
                    }}
                  >
                    <i className="flaticon2-image-file" /> {t('Upload icon')}
                  </Link>
                </WrapperButtons>
              </Wrapper>
            </CustomRow>
            <CustomRow>
              <Col>
                <FormItem label="Strengths - En">
                  <FormInput multiline name="strengths_en" />
                </FormItem>
                <FormItem label="Strengths - Ar">
                  <FormInput multiline name="strengths_ar" />
                </FormItem>
              </Col>
              <Wrapper>
                <IconWrapper>
                  <StrategicPlanIconView
                    width={150}
                    height={150}
                    icons={icons}
                    field="strengths"
                  />
                </IconWrapper>
                <WrapperButtons style={{ alignSelf: 'center' }}>
                  <Link
                    onClick={() => {
                      fileRef.current!.click();
                      setField('strengths');
                    }}
                  >
                    <i className="flaticon2-image-file" /> {t('Upload icon')}
                  </Link>
                </WrapperButtons>
              </Wrapper>
            </CustomRow>
            <CustomRow>
              <Col>
                <FormItem label="Weaknesses - En">
                  <FormInput multiline name="weaknesses_en" />
                </FormItem>
                <FormItem label="Weaknesses - Ar">
                  <FormInput multiline name="weaknesses_ar" />
                </FormItem>
              </Col>
              <Wrapper>
                <IconWrapper>
                  <StrategicPlanIconView
                    width={150}
                    height={150}
                    icons={icons}
                    field="weaknesses"
                  />
                </IconWrapper>
                <WrapperButtons style={{ alignSelf: 'center' }}>
                  <Link
                    onClick={() => {
                      fileRef.current!.click();
                      setField('weaknesses');
                    }}
                  >
                    <i className="flaticon2-image-file" /> {t('Upload icon')}
                  </Link>
                </WrapperButtons>
              </Wrapper>
            </CustomRow>
            <CustomRow>
              <Col>
                <FormItem label="Opportunities - En">
                  <FormInput multiline name="opportunities_en" />
                </FormItem>
                <FormItem label="Opportunities - Ar">
                  <FormInput multiline name="opportunities_ar" />
                </FormItem>
              </Col>
              <Wrapper>
                <IconWrapper>
                  <StrategicPlanIconView
                    width={150}
                    height={150}
                    icons={icons}
                    field="opportunities"
                  />
                </IconWrapper>
                <WrapperButtons style={{ alignSelf: 'center' }}>
                  <Link
                    onClick={() => {
                      fileRef.current!.click();
                      setField('opportunities');
                    }}
                  >
                    <i className="flaticon2-image-file" /> {t('Upload icon')}
                  </Link>
                </WrapperButtons>
              </Wrapper>
            </CustomRow>
            <CustomRow>
              <Col>
                <FormItem label="Threats - En">
                  <FormInput multiline name="threats_en" />
                </FormItem>
                <FormItem label="Threats - Ar">
                  <FormInput multiline name="threats_ar" />
                </FormItem>
              </Col>
              <Wrapper>
                <IconWrapper>
                  <StrategicPlanIconView
                    width={150}
                    height={150}
                    icons={icons}
                    field="threats"
                  />
                </IconWrapper>
                <WrapperButtons style={{ alignSelf: 'center' }}>
                  <Link
                    onClick={() => {
                      fileRef.current!.click();
                      setField('threats');
                    }}
                  >
                    <i className="flaticon2-image-file" /> {t('Upload icon')}
                  </Link>
                </WrapperButtons>
              </Wrapper>
            </CustomRow>
            <button type="submit" style={{ display: 'none' }} />
          </form>
          <StrategicPlanForm />
          <SaveButtons
            onCancel="/settings/strategic-plans"
            onSave={validateForm}
            isSaving={isSaving}
            savePermission={
              strategicPlan ? 'strategic-plan:edit' : 'strategic-plan:add'
            }
          />
        </StrategicPlanFormProvider>
      </>
    );
  };

  return (
    <>
      <Page>
        <Portlet padding>{renderDetails()}</Portlet>
      </Page>
    </>
  );
};
