import styled from 'styled-components';
import { Box, Flex } from 'grid-styled';
import format from 'date-fns/format';

import ClipSVG from '../../../svg/clip.svg';

const Message = styled(Flex)`
  font-size: 14px;
  line-height: 99%;
`;

const Date = styled(Box)`
  font-size: 12px;
  color: #aeb0b3;
  margin-top: 7px;
`;

const File = styled(Flex)`color: #74bbe7;`;

export default ({ sender: { imgSrc }, message, date, displayRight, files }) => {
  if (!message && !files) return null;

  return (
    <Message w={[1, 1, 7 / 10]} mt={2} direction={displayRight && 'row-reverse'}>
      <Box>
        <img src={imgSrc} alt="avatar" />
      </Box>
      <Flex mx={2} direction="column" align={displayRight && 'flex-end'}>
        {message && <Box>{message}</Box>}
        {files && (
          <Box mt={!message ? 0 : 1}>
            {files.map((file, index) => (
              <File key={index} align="center" mt={5}>
                <ClipSVG />
                <Box ml={5}>{file.name}</Box>
              </File>
            ))}
          </Box>
        )}
        <Date>{format(date, 'HH:MM, MM/DD/YYYY')}</Date>
      </Flex>
    </Message>
  );
};
