import styled, { css } from 'styled-components';
import { Box } from 'grid-styled';

const MutedTextCSS = css`
  font-size: 0.75rem;
  color: #aeb0b3;
`;

const MutedText = styled.span`${MutedTextCSS};`;

MutedText.Box = MutedText.withComponent(Box);

MutedText.Link = styled.a`
  ${MutedTextCSS};
  text-decoration: underline;

  &:hover {
    ${MutedTextCSS};
  }
`;

MutedText.Button = styled.button`
  ${MutedTextCSS};
  border: 0 none;
  background: transparent;
  padding: 0;
  cursor: pointer;
`;

export default MutedText;
