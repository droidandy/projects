// @flow
import React from 'react';
import styled from 'styled-components';

import { Box } from 'grid-styled';
import MutedText from 'components/styled/MutedText';

const TitleBox = styled(Box)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

type Props = {
  title: string,
  user: any,
};

export default ({ title, user }: Props) =>
  <Box>
    <img src="https://placeimg.com/100/100/tech" alt={title} />
    <TitleBox mt={1}>
      {title}
    </TitleBox>
    <MutedText.Box>
      {user.name}
    </MutedText.Box>
  </Box>;
