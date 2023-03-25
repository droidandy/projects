import styled from "styled-components";
import { Button } from "../../../../components/buttons/filled_button/styles";
import { color, device, f_c_c } from "../../../../components/styles";

export const ContainerSwithButton = styled.div`
	margin: 64px auto 0;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const ContainerButton = styled.div`
  ${f_c_c};
  border-radius: 10px;
  box-shadow: 4px 10px 14px #ECEFF7;
  width: fit-content;
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
`;

export const TabButton = styled.button`
    ${f_c_c};
    font-family: "SF Pro Display", sans-serif;
    font-weight: 500;
    color: ${props => props.active ? color.white : color.black};
    background-color: ${props => props.active ? color.green : color.white};
    border: none;
    cursor: pointer;
    font-size: 14px;
    white-space: nowrap;
    line-height: 24px;
    z-index: 1;
    padding: 16px 24px;
    transition: .3s;

    &:hover {
      background-color: ${color.greenHover};
      color: ${color.white};
    }

    &:active {
      background-color: ${color.greenActive};
    }

    &:disabled {
      background-color: #ecedfa;
      color: #b5b5d0;
    }
`;

export const Section = styled.div`
  margin: 32px 0 72px;
`;

export const SmallButton = styled(Button)`
  width: auto;
  min-width: 125px;
  height: 48px;
`;

export const SmallButtonLeft = styled(SmallButton)`
  margin: 0;
  margin-top: 40px;
`;

export const BlogCardsWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  grid-gap: 32px;
  max-width: 1120px;
  margin: 0 auto;
  padding-top: 48px;

  @media ${device.tillLaptop} {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }

  @media ${device.tillMobileL} {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	}
`;

export const BlogCardContainer = styled.div`
  background: #FFFFFF;
  border: 1px solid #E7E9F0;
  box-shadow: 0px 4px 8px rgba(41, 47, 66, 0.07);
  border-radius: 4px;
  padding: 24px;
  display: grid;
  grid-template-rows: 194px auto 1fr;
  align-content: flex-start;
`;

export const ImageWrap = styled.div`
  display: flex;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;

  .image {
    vertical-align: middle;
    object-fit: cover;
    width: 100%;
  }
`;

export const BlogCardCategory = styled.p`
  color: ${color.green};
  text-transform: uppercase;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  font-family: "SF Pro Display", sans-serif;
  margin: 0;
  margin-top: 24px;
`;

export const BlogCardTitle = styled.p`
  font-weight: 500;
  font-size: 18px;
  font-family: "SF Pro Display", sans-serif;
  line-height: 30px;
  margin: 0;
`;

export const HugeTitle = styled.h1`
	color: ${color.black};
	font-weight: 900;
	font-size: 62px;
  line-height: 76px;
  margin-bottom: 24px;

  @media ${device.tillLaptop} {
		font-size: 38px;
    line-height: 60px;
	}
`;

export const BlogItemContainer = styled.div`
  max-width: ${({ isComplex }) => isComplex ? '1024px' : '737px'};;
  margin: 0 auto;
`;

export const BlogItemImage = styled.img`
  width: 100%;
  border-radius: 10px;
  align-self: center;
`;

export const BlogItemSliderContainer = styled.div`
  position: relative;
  margin-top: 48px;
  padding-bottom: 40px;

  .swiper-wrapper {
    margin-bottom: 54px !important;
  }

  &::before {
    content: '';
    display: block;
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 100vw;
    height: 267px;
    transform: translateX(-50%);
    background-color: ${color.black}
  }

  @media (max-width: 1023px) {
    max-width: 500px;
    margin: 0 auto;
	}
`;

export const BlogItemContent = styled.div`
  max-width: 737px;
  margin-top: 48px;

  * {
    font-family: "SF Pro Display", sans-serif;
    color: #5D606B;
  }

  p, li, a {
    font-size: 16px;
    line-height: 26px;
  }

  li {
    list-style-position: inside;
  }

  h1, h2, h3 {
    color: #333848;
  }

  a {
    color: ${color.green};
    text-decoration: none;
  }
`;

export const BlogItemHeader = styled.div`
  display: grid;
  grid-template-columns: ${({ isComplex }) => isComplex ? '1fr 352px' : '1fr'};
  grid-column-gap: 128px;

  @media ${device.tillLaptop} {
    grid-template-columns: 1fr;
    row-gap: ${({ isComplex }) => isComplex ? '64px' : '0'};
	}
`;

export const BlogItemHeaderContent = styled.div`
  max-width: 737px;
`;

export const AveragePrice = styled.h2`
  font-weight: 900;
  font-size: 38px;
  line-height: 60px;
  color: ${color.green};
  margin: 0;
`;

export const Text = styled.p`
  margin: 0;
  font-family: "SF Pro Display", sans-serif;
  font-size: 16px;
  line-height: 26px;
  color: #A8ACBC;
`;
