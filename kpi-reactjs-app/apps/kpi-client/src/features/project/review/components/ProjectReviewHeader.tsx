import React from 'react';
import { useActions } from 'typeless';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ArrowIcon } from 'src/components/ArrowIcon';
import { ProjectReviewAction } from '../interface';
import { 
  IconButton,
  Col,
} from '../../common/style';

const Wrapper = styled.div`
  height: 100px;
  display: flex;
  place-items: center;
`;

const Label = styled.label`
  color: #244159;
  font-size: 14px;
`;

const Title = styled.label`
  color: #244159;
  font-size: 16px;
  font-weight: bold;
`;

export const ProjectReviewHeader = () => {
  const { t } = useTranslation();
  const { 
    goBack
  } = useActions(ProjectReviewAction);
  return (
    <Wrapper>
      <Col width={6}>
        <Title> {t('Tasks')} </Title>
      </Col>
      <Col width={6} direction="ltr">
        <IconButton
          type="button" 
          styling="secondary" 
          width="100px" 
          height="36px"
          onClick={goBack}
        >
          <ArrowIcon direction="left" color="#244159"/>
          <Label> {t('Return')} </Label>
        </IconButton>
      </Col>
    </Wrapper>
  )

};
