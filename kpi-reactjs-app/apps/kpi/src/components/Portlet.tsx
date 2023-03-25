import * as React from 'react';
import styled from 'styled-components';

interface PortletProps {
  className?: string;
  children: React.ReactNode;
  padding?: boolean;
  flex?: boolean;
  title?: React.ReactNode;
  maxHeight?: boolean;
  buttons?: React.ReactNode;
}

const Head = styled.div`
  display: flex;
  position: relative;
  padding: 0 25px;
  border-bottom: 1px solid #ebedf2;
  min-height: 60px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  align-items: stretch;
  justify-content: space-between;
`;

const Label = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.h3`
  margin: 0;
  padding: 0;
  font-size: 1.2rem;
  font-weight: 500;
  color: #48465b;
`;

const Body = styled.div``;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  align-content: flex-end;
`;

const _Portlet = (props: PortletProps) => {
  const { className, children, title, padding, buttons } = props;
  return (
    <div className={className}>
      {title && (
        <Head>
          <Label>
            <Title>{title}</Title>
          </Label>
          {buttons && <Toolbar>{buttons}</Toolbar>}
        </Head>
      )}
      <Body style={padding ? { padding: 25 } : undefined}>{children}</Body>
    </div>
  );
};

export const Portlet = styled(_Portlet)`
  width: 100%;
  box-shadow: 0px 0px 13px 0px rgba(82, 63, 105, 0.05);
  background-color: #ffffff;
  margin-bottom: 20px;
  border-radius: 4px;
  flex: ${props => (props.flex ? '1 0 auto' : null)};
  height: ${props => (props.maxHeight ? '100%' : null)};
`;
