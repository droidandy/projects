// @flow
import React from 'react';

import { Box } from 'grid-styled';
import MutedText from 'components/styled/MutedText';
import ButtonAsText from 'components/styled/ButtonAsText';
import File from './File';

const MutedTextBlock = MutedText.withComponent('p');

type Props = {
  files: any[],
  onFileRemove: (fileId: string) => void,
  onMore: () => void,
};

export default ({ files, onFileRemove, onMore }: Props) =>
  <Box py={1} px={2}>
    <MutedTextBlock>Attached Documents:</MutedTextBlock>
    <Box mt={1}>
      {files.map(file => <File {...file} onFileRemove={onFileRemove} />)}
    </Box>
    <Box mt={1}>
      <ButtonAsText type="button" onClick={onMore}>
        add more...
      </ButtonAsText>
    </Box>
  </Box>;
