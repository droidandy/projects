import * as React from 'react';
import styled from 'styled-components';
import { Button } from './Button';
import { useTranslation } from 'react-i18next';
import { Container } from './Container';

interface FullPageFormProps {
  className?: string;
  title: React.ReactNode;
  children: React.ReactNode;
  onCancel(): void;
  onSave(): void;
  isSaving: boolean;
}

const Title = styled.div`
  background: #066a99;
  font-weight: bold;
  font-size: 16px;
  padding: 15px 30px;
  color: white;
  border-radius: 3px 3px 0px 0px;
`;

const PaddingBox = styled.div`
  width: 750px;
  margin: 0 auto;
`;

const Content = styled(PaddingBox)`
  padding-top: 30px;
`;

const Buttons = styled(PaddingBox)`
  padding-bottom: 100px;
  display: flex;
  justify-content: flex-end;
  ${Button} + ${Button} {
    margin-right: 10px;
  }
`;

const Sep = styled.div`
  background: #ebedf2;
  height: 1px;
  width: 100%;
  margin: 30px 0 20px;
`;

const _FullPageForm = (props: FullPageFormProps) => {
  const { className, title, onCancel, onSave, children, isSaving } = props;
  const { t } = useTranslation();
  return (
    <Container>
      <div className={className}>
        <Title>{title}</Title>
        <Content>{children}</Content>
        <Sep />
        <Buttons>
          <Button styling="secondary" onClick={onCancel}>
            {t('Cancel')}
          </Button>
          <Button onClick={onSave} loading={isSaving}>
            {t('Save')}
          </Button>
        </Buttons>
      </div>
    </Container>
  );
};

export const FullPageForm = styled(_FullPageForm)`
  background: #ffffff;
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.15);
  border-radius: 3px;
  margin-top: 30px;
`;
