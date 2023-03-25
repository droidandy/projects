import React from 'react';
import { getDashboardState } from '../interface';
import styled from 'styled-components';
import { DisplayTransString } from 'src/components/DisplayTransString';
import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useLanguage } from 'src/hooks/useLanguage';
import { API_BASE_URL } from 'shared/API';
import { StrategicPlanItem } from 'src/types';

const IconBox = styled.div`
  direction: rtl !important;
  display: inline-flex !important;
  flex-wrap: nowrap;
  padding: 16px;
  background: #ffffff;
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.03);
  border-radius: 3px;

  svg {
    height: 60px;
    width: auto;
  }
`;

const Icon = styled.div`
  flex: 0 0 50px;
  padding-left: 20px;
`;

const Desc = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.h3`
  border-left: 1px solid #c4c4c4;
  padding-left: 30px;
  margin-left: 30px;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  color: #244159;
`;

const Content = styled.div`
  display: flex;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 19px;
  color: #244159;
`;

const Wrapper = styled.div`
  padding-bottom: 35px;
  * {
    outline: none;
  }

  .slick-dots {
    li {
      width: 14px;
      height: 2px;
      background: #d6dce1;
      margin: 0 2px;
      &.slick-active {
        background: #10a6e9;
      }
      button {
        display: none;
      }
    }
  }
`;

const MultiItem = styled.div`
  display: flex;
  align-items: center;
  margin-left: 40px;
`;

const MultiItemIcon = styled.div`
  margin-left: 10px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e9ecf1;
  border-radius: 50%;
  img {
    max-width: 20px;
    max-height: 20px;
  }
`;

export function ValuesWidget() {
  const language = useLanguage();
  const strategicPlan = getDashboardState.useState().strategicPlan!;

  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: language === 'ar',
    autoplay: true,
    autoplaySpeed: 3000,
  };
  const items = [
    strategicPlan.vision,
    strategicPlan.mission,
    strategicPlan.values,
  ];

  const renderItemContent = (item: StrategicPlanItem) => {
    if (!item.content.length) {
      return null;
    }
    if (item.content.length === 1) {
      return (
        <DisplayTransString value={item.content[0].text} />
      );
    }
    return (
      <>
        {item.content.map((sub, i) => (
          <MultiItem key={i}>
            <MultiItemIcon>
              <img
                src={`${API_BASE_URL}/api/documents/files?token=${
                  sub.icon!.downloadToken
                }`}
              />
            </MultiItemIcon>
            <DisplayTransString value={sub.text} />
          </MultiItem>
        ))}
      </>
    );
  };
  return (
    <Wrapper>
      <Slider {...settings}>
        {items.map((item, i) => (
          <IconBox key={i}>
            <Icon>
              <img
                src={`${API_BASE_URL}/api/documents/files?token=${
                  item.icon!.downloadToken
                }`}
              />
            </Icon>
            <Desc>
              <Title>
                <DisplayTransString value={item.text} />
              </Title>
              <Content>{renderItemContent(item)}</Content>
            </Desc>
          </IconBox>
        ))}
      </Slider>
    </Wrapper>
  );
}
