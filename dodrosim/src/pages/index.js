import React, { useRef, useEffect } from 'react';
import Rellax from 'rellax';
import { Link, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import Head from 'next/head';
import Image from 'next/image';
import SC from 'styled-components';
import { Footer, LandingItem, PromoNewsCard } from '../components';
import {Icon} from '../components/icon';
import { maxDevice, minDevice } from '../theme';

const Container = SC.div`
  overflow: hidden;
`;

const SliderMenu = SC.div`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #333E66;
  height: 60px;
  z-index: 10;
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow-x: hidden;
  overflow-y: hidden;
  white-space: nowrap;
  padding: 0 115px 0 115px;
  @media ${maxDevice.tablet} {
    padding: 0 5px 0 5px;
  }
  @media ${maxDevice.mobileL} {
    padding: 0 5px 0 5px;
  }
  @media (min-width: 1200px) {
    justify-content: space-around;
  }
`;

const RSLink = SC(Link)`
  color: #FFFFFF33 !important;
  cursor: pointer;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 25px 25px;
  :hover {
    color: #FFFFFF !important;
  }
`;

const Section = SC.section`
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  align-items: flex-end;
  padding: 120px 140px 90px 140px;
  @media ${maxDevice.tablet} {
    align-items: flex-start;
    padding: 120px 30px 90px 30px;
  }
  @media ${maxDevice.mobileL} {
    align-items: flex-start;
    padding: 90px 30px 90px 30px;
  }
`;

const Content = SC.div`
  @media ${minDevice.tablet} {
    width: 560px;
  }
`;

const Text = SC.div`
  margin: 30px 0 0 0;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 28px;
  color: ${({ color }) => color || '#777777'};
  @media ${maxDevice.mobileL} {
    font-size: 16px;
    line-height: 20px;
  }
`;

const Label = SC.div`
  font-style: normal;
  font-weight: normal;
  font-size: 40px;
  line-height: 48px;
  color: ${({ color }) => color || '#333E66'};
  @media ${maxDevice.mobileL} {
    font-size: 30px;
    line-height: 36px;
  }
`;

const Label1 = SC.div`
  font-style: normal;
  font-weight: normal;
  font-size: 64px;
  line-height: 72px;
  color: ${({ color }) => color || '#333E66'};
  @media ${maxDevice.mobileL} {
    font-size: 40px;
    line-height: 48px;
  }
`;

const Elements = SC.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

const Map = SC.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
  background: rgb(244,242,250);
  transform: scale(0.7,0.7);
  transition: all 1s;
  div {
    position: initial !important;
  }
  img {
    position: absolute !important;
    top: -85% !important;
    left: 22% !important;
    margin: initial !important;
    margin-left: -150vh !important;
    width: 300vh !important;
    height: initial !important;
    max-width: initial !important;
    max-height: initial !important;
  }
  img, svg {
    vertical-align: middle !important;
  }
  @media (min-width: 768px) {
    img {
      top: -100% !important;
      left: 50% !important;
    }
  }
`;

const Layer = SC.div`
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  background-image: linear-gradient(180deg, rgba(244,242,250, 1) 10%, rgba(244,242,250,0.8) 45%, rgba(244,242,250,0) 80%);
  @media (min-width: 768px) {
    background-image: linear-gradient(70deg, rgba(244,242,250, 1) 10%, rgba(244,242,250,0.8) 45%, rgba(244,242,250,0) 80%);
  }
`;

const PromoNews = SC.div`
  z-index: 10;
  background: ${({ color }) => color || '#fff'};
  display: flex;
  flex-direction: column;
  padding: 60px 140px 60px 140px;
  @media ${maxDevice.tablet} {
    padding: 60px 30px 60px 30px;
  }
  @media ${maxDevice.mobileL} {
    padding: 60px 30px 60px 30px;
  }
  @media (min-width: 1200px) {
    flex-direction: row;
    align-items: center;
  }
`;

const PromoBlock = SC.div`
  z-index: 10;
  overflow: hidden;
  background: ${({ color }) => color || '#fff'};
  display: flex;
  flex-direction: column;
  padding: 60px 140px 60px 140px;
  @media ${maxDevice.tablet} {
    padding: 60px 30px 60px 30px;
  }
  @media ${maxDevice.mobileL} {
    padding: 60px 30px 60px 30px;
  }
  @media (min-width: 1200px) {
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
  }
`;

const PromoBlock1 = SC.div`
  z-index: 10;
  overflow: hidden;
  background: ${({ color }) => color || '#fff'};
  display: flex;
  flex-direction: column;
  padding: 60px 140px 60px 140px;
  @media ${maxDevice.tablet} {
    padding: 0px 30px 60px 30px;
  }
  @media ${maxDevice.mobileL} {
    padding: 0px 30px 60px 30px;
  }
  @media (min-width: 1200px) {
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
  }
`;

const NewsHeader = SC.div`
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 30px;
  color: #000000;
  text-align: left;
  padding: 0 10px 0 10px;
  width: 260px;
`;

const Button = SC.button`
  background: #fff;
  border-radius: 5px;
  height: 60px;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #008E5B;
  border: none;
  padding: 0 25px;
`;

const Btn = SC(Button)`
  margin: 40px 0;
`;

const Objects = SC.div`
  margin: 15px;
  transform: scale(1.5);
  @media ${maxDevice.mobileL} {
    transform: scale(1.7);
  }
  svg {
    width: 100%;
  }
  @media (min-width: 1200px) {
    width: 50%;
  }
`;

const linkProps = {
  activeClass: 'active',
  hashSpy: true,
  spy: true,
  smooth: true,
  duration: 500,
  offset: 50,
};

export default function Home() {
  const rellaxRef = useRef();

  useEffect(() => {
    const scrollContainer = document.getElementById('container');
    const scrollSliderMenu = document.getElementById('slider-menu');
    new Rellax(".animate", { // <---- Via class name
      speed: -10,
      center: false,
      wrapper: null,
      round: true,
      vertical: true,
      horizontal: false
    });

    new Rellax(rellaxRef.current, { // <---- Via useRef element
      speed: -10,
      center: false,
      wrapper: null,
      round: true,
      vertical: true,
      horizontal: false
    });

    Events.scrollEvent.register('begin', function(to, element) {
      console.log('begin', to);
    });

    Events.scrollEvent.register('end', function(to, element) {
      console.log('end', to);
    });

    scrollContainer.addEventListener('wheel', function(evt) {
      scrollSliderMenu.scrollLeft += (evt.deltaY / 3.5);
    });

    scrollSpy.update();

    return () => {
      Events.scrollEvent.remove('begin');
      Events.scrollEvent.remove('end');
    };
  }, []);

  return (
    <>
      <Head>
        <title>App</title>
        <meta property="og:title" content="app" />
        <meta property="og:description" content="app" />
        <meta property="og:url" content="https://site.com/about" />
        <meta property="og:image" content="/images/og/im_2.png" key="og:image" />
        <meta property="twitter:image" content="/images/og/im_2.png" key="twitter:image" />
        <meta property="twitter:title" content="app" />
        <meta property="twitter:description" content="app" />
        <meta property="twitter:url" content="https://site.com/about" />
        <meta name="description" content="app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container id="container">
        <Map id="map">
          <Image src="/map.svg" layout='fill' />
        </Map>
        <Layer />
        <Element name="property" data-scroll>
          <Section>
            <Content>
              <Label1>Имущество 360°</Label1>
              <Text>
                Дирекция по обеспечению деятельности «Росимущества» осуществляет полный спектр работ по администрированию, управлению и обслуживанию федерального имущества.
              </Text>
              <Elements>
                <LandingItem hint="более" label="20 лет" text="успешной работы" />
                <LandingItem hint="более" label="400" text="сотрудников" />
              </Elements>
            </Content>
          </Section>
        </Element>
        <Element name="administration" data-scroll>
          <Section>
            <Content>
              <Label>Администрирование имущества</Label>
              <Text>
                Полный цикл администрирования недвижимого имущества: поиск объектов, регистраиция прав, обслуживание и вовлечение в хозяйственный оборот.
              </Text>
              <Elements>
                <LandingItem hint="более" label="350 тыс м2" text="коммерческой недвижимости" />
                <LandingItem hint="более" label="14 тыс м2" text="жилой недвижимости" />
                <LandingItem hint="более" label="250" text="объектов в управлении" />
                <LandingItem hint="более" label="100" text="арендаторов" />
              </Elements>
            </Content>
          </Section>
        </Element>
        <Element name="digitalization" data-scroll>
          <Section>
            <Content>
              <Label>Цифровизация</Label>
              <Text>
                ИТ-разработка и консалтинг. Дирекция обеспечения деятельности является оператором цифровой трансформации «Росимущества». Мы занимаемся разработкой програмного обеспечения, ИТ-Консалтингом, разработкой систем верификации реестров и автоматизацией бизнес-процессов работы с недвижимостью.
              </Text>
            </Content>
          </Section>
        </Element>
        <Element name="monitoring" data-scroll>
          <Section>
            <Content>
              <Label>Мониторинг</Label>
              <Text>
                Организация мероприятий по мониторингу федерального имущества на предмет эффективности, качества и законности использования: камеральные работы, выездные мероприятия, контроль устранения замечаний.
              </Text>
              <Elements>
                <LandingItem hint="более" label="2 500" text="проверок" />
                <LandingItem hint="более" label="400" text="выявленных нарушений" />
              </Elements>
            </Content>
          </Section>
        </Element>
        <Element name="fleet-management" data-scroll>
          <Section>
            <Content>
              <Label>Управление автопарком</Label>
              <Text>
                Полный цикл услуг по управлению автомобильным парком Росимущества: формирование автомобильного парка, обслуживание автопарка (СТО), размещение автопарка (гараж).
              </Text>
              <Elements>
                <LandingItem hint="более" label="100" text="машин в автопарке" />
                <LandingItem hint="более" label="10" text="моделей" />
                <LandingItem hint="более" label="150" text="водителей" />
                <LandingItem hint="подача машин" label="24/7" />
              </Elements>
            </Content>
          </Section>
        </Element>
        <Element name="other-services" data-scroll>
          <Section>
            <Content>
              <Label>Другие услуги</Label>
              <Text>
                Дирекция по обеспечению деятельности, также осуществляет ряд дополнительных услуг, в том числе:
              </Text>
              <Elements>
                <LandingItem face="primary" label="Геодезия и картография" text="Полный набор услуг для проведения инженерно-геодезических изысканий." />
                <LandingItem face="primary" label="Кадастровые работы" text="Полный набор кадастровых работ, в том числе: постановка, внесение изменений, снятие с кадастрового учета; обмерные работы, подготовка актов обследования и др." />
                <LandingItem face="primary" label="Ведение архива" text="Осуществляем услуги ведения архива Росимущества (хранение, отцифровка, обработка, уничтожение документов и проч)." />
              </Elements>
            </Content>
          </Section>
        </Element>
      </Container>
      <SliderMenu id="slider-menu">
        <RSLink {...linkProps} to="administration" id="administration">Администрирование</RSLink>
        <RSLink {...linkProps} to="digitalization" id="digitalization">Цифровизация</RSLink>
        <RSLink {...linkProps} to="monitoring" id="monitoring">Мониторинг</RSLink>
        <RSLink {...linkProps} to="fleet-management" id="fleet-management">Управление автопарком</RSLink>
        <RSLink {...linkProps} to="other-services" id="other-services">Другие услуги</RSLink>
      </SliderMenu>
      <PromoBlock1 color="#38B662">
        <Objects>
          <Icon name="objects" height="328"/>
        </Objects>
        <div data-scroll>
          <Label color="#fff">Государственные объекты</Label>
          <Text color="#ffffff60">Посмотреть на карте Государственные объекты недвижимости</Text>
          <Btn>
            Посмотреть объекты на карте
          </Btn>
        </div>
      </PromoBlock1>
      <PromoNews>
        <NewsHeader>Новости учреждения и рынка недвижимости</NewsHeader>
        <PromoNewsCard label="Росимущество и ФАС России обсудили проблемные вопросы применения Закона № 44-ФЗ" date="24 декабря 2020" href="/news/10"/>
        <PromoNewsCard label="Склады и офисы: основные тренды на рынке коммерческой недвижимости." date="24 декабря 2020" href="/news/10"/>
        <PromoNewsCard label="Поглощение на рынке столичных офисов остается высоким даже без сделок с госкомпаниями – Knight Frank" date="22 апреля 2020" href="/news/10"/>
      </PromoNews>
      <Footer />
    </>
  )
}
