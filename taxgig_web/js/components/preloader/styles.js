import styled, { keyframes } from "styled-components";

import { f_c_c } from "../styles";

const pulseMe = keyframes`
  0% { transform: scale(1); }
  25% { transform: scale(1.2); }
  50% { transform: scale(1); }
  75% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

export const Block = styled.div`
  width: 100%;
  height: 250px;
`;

export const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`;

export const Container = styled.div`
  ${f_c_c}
  height: 100%;
  margin: 0 auto;
`;

export const Logo = styled.div`
  height: 80px;
  animation: ${pulseMe} 3s linear infinite;
`;
