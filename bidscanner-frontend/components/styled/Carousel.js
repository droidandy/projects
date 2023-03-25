import styled from 'styled-components';

const ArrowWrapper = styled.div`
  position: absolute;
  cursor: pointer;
  background: transparent;
  color: white !important;
  top: 35%;
  -webkit-transform: translate(0, -50%);
  -ms-transform: translate(0, -50%);
  transform: translate(0, -50%);
  font-family: $slick-font-family;
  font-size: 20px;
  line-height: 1;
  color: gray !important;
  &:hover,
  &:before {
    font-size: 20px;
    line-height: 1;
    color: black !important;
  }
`;

export const RightArrowWrapper = ArrowWrapper.extend`left: 100%;`;
export const LeftArrowWrapper = ArrowWrapper.extend`
  left: -1em;
  @media (min-width: 1200px) {
    left: -2em;
  }
`;

export const CarouselImage = styled.img`
  width: 100px;
  height: 100px;
  margin-left: 0;
  @media (max-width: 1024px) {
    margin-left: 1em;
  }
`;

export const CarouselTitle = styled.div`
  font-size: 1em;
  width: 100px;
  textAlign: center;
  color: ${props => (props.color ? props.color : 'black')};
  @media (max-width: 1024px) {
    margin-left: 1em;
  }
`;
export const CarouselSubtitle = styled.div`
  font-size: 0.8em;
  @media (max-width: 1024px) {
    margin-left: 1em;
  }
`;
