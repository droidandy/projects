// @flow

import Container from 'components/styled/Container';
import { Flex, Box } from 'grid-styled';
import styled from 'styled-components';
import StyledLink from 'components/styled/StyledLink';
import { Link } from 'next-url-prettifier';

import FacebookSVG from './facebook.svg';
import LinkedinSVG from './linkedin.svg';
import TwitterSVG from './twitter.svg';

const Copyright = styled.div`
  color: #bcbec0;
  font-size: 12px;
`;

const SocialButton = styled(Box)`
  width: 25px;
  height: 25px;
`;

const Wrapper = styled(Flex)`@media (max-width: 640px) {flex-direction: column;}`;
const SocialButtonsWrapper = styled(Flex)`@media (max-width: 640px) {padding-right: 2em;}`;

export default () => (
  <div>
    <Container>
      <Wrapper justify="space-between" pb={10} align="center" mt={3}>
        <Box>
          <Flex justify="flex-start" wrap>
            <Box mr="10px">
              <StyledLink>
                <Link href="/general/escrow" as="/escrow">
                  <a>what is escrow?</a>
                </Link>
              </StyledLink>
            </Box>
            <Box mr="20px">
              <StyledLink>
                <Link href="https://support.tradekoo.com/knowledge-base/">
                  <a>help</a>
                </Link>
              </StyledLink>
            </Box>
            <Box mr="20px">
              <StyledLink>
                <Link href="/general/about" as="/public/about-tradekoo-marketplace">
                  <a>about us</a>
                </Link>
              </StyledLink>
            </Box>
            <Box>
              <StyledLink>
                <Link href="/general/termsofuse" as="/public/terms-conditions">
                  <a>terms of use</a>
                </Link>
              </StyledLink>
            </Box>
          </Flex>
          <Copyright>Tecnos SA, Switzerland 2017 ©</Copyright>
        </Box>
        <SocialButtonsWrapper w={[1, 1 / 2, 1 / 4]} justify="flex-end">
          <SocialButton>
            <StyledLink>
              <Link href="https://www.linkedin.com">
                <a>
                  <LinkedinSVG />
                </a>
              </Link>
            </StyledLink>
          </SocialButton>
          <SocialButton ml={1}>
            <StyledLink>
              <Link href="https://www.facebook.com/">
                <a>
                  <FacebookSVG />
                </a>
              </Link>
            </StyledLink>
          </SocialButton>
          <SocialButton ml={1}>
            <StyledLink>
              <Link href="https://twitter.com/">
                <a>
                  <TwitterSVG />
                </a>
              </Link>
            </StyledLink>
          </SocialButton>
        </SocialButtonsWrapper>
      </Wrapper>
    </Container>
  </div>
);
