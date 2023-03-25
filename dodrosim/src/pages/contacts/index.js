import React from 'react';
import Head from "next/head";
import SC from 'styled-components';
import { GoogleMap, LoadScript, InfoWindow } from '@react-google-maps/api';
import { maxDevice } from '../../theme';
import {Page} from '../../components';

const InfoHeader = SC.div`
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  color: #000000;
  margin-bottom: 15px;
`;
const InfoText = SC.div`
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 18px;
  color: #000000;
`;

const Content = SC.div`
  margin: 0 0 40px 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  @media ${maxDevice.mobileL} {
    flex-direction: column;
  }
`;

const Block = SC.div`
  width: 600px;
  @media ${maxDevice.mobileL} {
    width: auto;
  }
`;

const InfoContainer = SC.div`
  margin: 15px 0;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

const InfoLabel = SC.div`
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #777777;
`;

const Info = ({ label, children }) => (
  <InfoContainer>
    {label && <InfoLabel>{label}</InfoLabel>}
    {children}
  </InfoContainer>
);

const position = {
  lat: 55.7507096,
  lng: 37.7065385
}

export default function contacts() {
  return (
    <>
      <Head>
        <title>Контакты</title>
        <meta property="og:title" content="Контакты" />
        <meta property="og:description" content="Контакты" />
        <meta property="og:url" content="https://site.com/about" />
        <meta property="og:image" content="/images/og/im_2.png" key="og:image" />
        <meta property="twitter:image" content="/images/og/im_2.png" key="twitter:image" />
        <meta property="twitter:title" content="Контакты" />
        <meta property="twitter:description" content="Контакты" />
        <meta property="twitter:url" content="https://site.com/about" />
        <meta name="description" content="Контакты" />
      </Head>
      <Page label="Контактная информация">
        <Content>
          <Block>
            <Info label="Телефоны">
              <div>+7 (495) 361-45-21</div>
              <div>+7 (495) 361-45-18</div>
            </Info>
            <Info label="Факс">
              <div>+7 (495) 361-45-21</div>
            </Info>
            <Info label="Электронная почта">
              <a href='mailto:info@dodrosim.ru'>info@dodrosim.ru</a>
            </Info>
          </Block>
          <Block>
            <Info label="Адрес">
              <div>111024, Москва, проезд Завода Серп  и Молот, д. 5, стр.</div>
            </Info>
            <Info label="Режим работы">
              <div>Пн — Пт с 9:00 до 18:00</div>
            </Info>
          </Block>
        </Content>
        <LoadScript
          googleMapsApiKey="AIzaSyBOlmI7ovA7rXy7xc5kR2ET88lbuoRzehw"
        >
          <GoogleMap
            mapContainerStyle={{
              width: '100%',
              height: '630px'
            }}
            center={position}
            zoom={15}
          >
            <InfoWindow position={position}>
              <div>
                <InfoHeader>ФГБУ «ДОД Росимущества»</InfoHeader>
                <InfoText>111024, Москва, проезд Завода Серп и Молот, д. 5, стр. 2</InfoText>
              </div>
            </InfoWindow>
          </GoogleMap>
        </LoadScript>
      </Page>
    </>
  );
}
