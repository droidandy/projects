import * as React from 'react';
import styled from 'styled-components';
import { Container } from './Container';
import { Spinner } from './Spinner';
import { useTranslation } from 'react-i18next';

interface TableViewProps {
  className?: string;
  title: string;
  header: React.ReactNode;
  isLoading: boolean;
  children: React.ReactNode;
  titleAppend?: React.ReactNode;
  flex?: boolean;
  subHeader?: string;
}
const HeaderWrapper = styled.div`
  border-radius: 3px 3px 0px 0px;
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.03);
`;

const Header = styled.div`
  background: #066a99;
  color: white;
  border-radius: 3px 3px 0px 0px;
  margin-top: 30px;
  font-weight: bold;
  font-size: 16px;
  padding: 15px 30px;
`;

const HeaderWithAppendix = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 52px;
  padding-top: 0;
  padding-bottom: 0;
  padding-left: 10px;
`;

const LoaderWrapper = styled.div`
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SubHeader = styled.div`
  padding-top: 40px;
  display: flex;
  flex-direction: row;
`;

const _TableView = (props: TableViewProps) => {
  const {
    title,
    titleAppend,
    header,
    isLoading,
    children,
    className,
    flex,
    subHeader,
  } = props;
  const { t } = useTranslation();
  return (
    <Container className={className} flex={flex}>
      {subHeader ? (
        <SubHeader>
          <div style={{ fontSize: '14px' }}>
            {subHeader}
            <span style={{ margin: '0 10px' }}>|</span>
            <span style={{ fontWeight: 'bold', color: '#504c4c' }}>
              {t('Home')}
            </span>
          </div>
        </SubHeader>
      ) : null}
      <HeaderWrapper>
        {titleAppend ? (
          <HeaderWithAppendix>
            {title} {titleAppend}
          </HeaderWithAppendix>
        ) : (
          <Header>{title}</Header>
        )}

        <div style={{ background: '#fff' }}>{header}</div>
      </HeaderWrapper>
      {isLoading ? (
        <LoaderWrapper>
          <Spinner black size="40px" />
        </LoaderWrapper>
      ) : (
        children
      )}
    </Container>
  );
};

export const TableView = styled(_TableView)``;
