// @flow
import React from 'react';
import styled from 'styled-components';
import { reduxForm, Field } from 'redux-form';

import compose from 'recompose/compose';

import { Flex, Box } from 'grid-styled';
import MenuItem from 'material-ui/MenuItem';
import WhiteButton from 'components/styled/WhiteButton';
import InfoIcon from 'components/forms-components/new/InfoIcon';
import SelectField from 'components/forms-components/new/SelectField';
import PostEditor from './PostEditor';

const Container = styled.div`
  position: relative;
  width: 100%;
  min-height: 180px;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
`;

const Name = styled(Box)`
  font-weight: bold;
`;

const PostButtonContainer = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  z-index: 9;
`;

const CompactWhiteButton = styled(WhiteButton)`
  padding: 0.1em 0.5em;
`;

const StyledSelectField = styled(SelectField)`
  padding-left: 0;
`;

const enhance = compose(
  reduxForm({
    form: 'timeline-post',
  })
);

type RecomposeProps = {};

type ExternalProps = {
  companies: {}[],
};

type EnhancedType = Class<React$Component<void, ExternalProps, void>>;

const EnhancedComponent: EnhancedType = enhance((props: ExternalProps & RecomposeProps) => {
  const { companies } = props;

  return (
    <Container>
      <InfoIcon text="Info about this field" />
      <Flex px={2} pt={2}>
        <Box mr={1}>
          <img src="http://placeimg.com/50/50/tech" alt="Name" />
        </Box>
        <Box>
          <Name>User Name</Name>
          <Box>
            <Field name="company" component={StyledSelectField} placeholder="Choose Company">
              {companies.map(company =>
                <MenuItem
                  key={company.id}
                  value={company}
                  primaryText={`${company.name}, ${company.country}`}
                />
              )}
            </Field>
          </Box>
        </Box>
      </Flex>
      <Field name="content" component={PostEditor} placeholder="Share an article, photo or update" />
      <PostButtonContainer>
        <CompactWhiteButton>post</CompactWhiteButton>
      </PostButtonContainer>
    </Container>
  );
});

export default EnhancedComponent;
