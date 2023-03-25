/* @flow */
import React from 'react';
import styled from 'styled-components';
import { Flex } from 'grid-styled';

import type { MetaProps, InputProps } from 'redux-form';

// import DropDownMenu from 'material-ui/DropDownMenu';
import DropdownMenu from 'components/forms-components/dropdowns/DropdownMenu';
import InfoIcon from './InfoIcon';

const Container = styled.div`
  width: 100%;
  display: inline-flex;
  position: relative;
  padding: 0.15em ${props => (props.infoText ? '1.5em' : '0')} 0 1em;
`;

const StyledDDMenu = styled(DropdownMenu)`z-index: 2;`;

const Error = styled.span`
  color: #ff2929;
  font-size: 12px;
`;

type Props = {
  label: string,
  infoText?: string,
  className?: string,
  input?: InputProps,
  meta?: MetaProps,
};

export default (props: Props) => {
  const { input, className, infoText, meta: { touched, error }, ...restProps } = props;

  return (
    <div>
      <Container className={className} infoText={infoText}>
        {infoText && <InfoIcon text={infoText} />}
        <StyledDDMenu {...restProps} {...input} />
      </Container>
      <Flex justify="center">{touched && (error && <Error>{error}</Error>)}</Flex>
    </div>
  );
};
