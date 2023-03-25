import React from 'react';
import Head from "next/head";
import SC from 'styled-components';
import {Page, Card} from '../../components';
import Grid from '@kiwicom/orbit-components/lib/utils/Grid/index';

const Content = SC.div`
  margin: 0;
`;

const Header = SC.div`
  margin: 25px 0 45px 0;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 30px;
  color: #000000;
`;

const about = [
  { label: 'Приказ № 352 от 05.12.2019 г. О директоре ФГБУ «ДОД Росимущества»', href: '/vacancies', type: 'document' },
  { label: 'Документы об учреждении Распоряжение Росимущества №573-р от 14.08.2018 г. Устав ФГБУ «ДОД Ро…', href: '/vacancies', type: 'document' },
  { label: 'Документы об учреждении Приказ №253 от 06.08.2018 г. Об определении перечня особо ценного движимого…', href: '/vacancies', type: 'document' },
  { label: 'Документы об учрежденииПриказ №263 от 10.08.2018 г. Об утверждении порядка составления и утверждения плана…', href: '/vacancies', type: 'document' },
  { label: 'Документы об учрежденииПриказ №264 от 10.08.2018 г. Об утверждении Порядка определения нормативных затрат…', href: '/vacancies', type: 'document' },
  { label: 'Документы об учрежденииПриказ №481 от 19.12.2018 г. Об утверждении Примерного положения об оплате…', href: '/vacancies', type: 'document' },
  { label: 'Документы об учреждении Распоряжение №700-р от 16.10.2018 г. Об утверждении Положения о закупке…', href: '/vacancies', type: 'document' },
];

const serf = [
  { label: 'Лицензия МЧС 2010 год', href: '/vacancies', type: 'document' },
  { label: 'Лицензия МЧС 2012 год', href: '/vacancies', type: 'document' },
  { label: 'СРО_НОВ', href: '/vacancies', type: 'document' },
  { label: 'Сертификат исо 9001-2008', href: '/vacancies', type: 'document' },
];

const statements = [
  { label: 'Сводная ведомость результатов проведения специальной оценки условий труда', href: '/vacancies', type: 'document' },
  { label: 'Сводная ведомость результатов проведения специальной оценки условий труда 2', href: '/vacancies', type: 'document' },
  { label: 'Сводная ведомость результатов проведения специальной оценки условий труда 3', href: '/vacancies', type: 'document' },
];

const info = [
  { label: 'Справка о средней заработной плате руководителя, его заместителей и главного бухгалтера ФГБУ «ДОД Росимущ…', href: '/vacancies', type: 'document' },
  { label: 'Документы об учреждении Государственное задание ФГБУ «ДОД Росимущества» на 2019 год', href: '/vacancies', type: 'document' },
];

const ancors = [
  {name: 'Об учреждении', href: '#about'},
  {name: 'Сертификаты и лицензии', href: '#certificates'},
  {name: 'Сводные ведомости', href: '#summary'},
  {name: 'Раскрытие информации', href: '#disclosure'}
];

const CustomGrid = ({items = []}) => {
  const renderCard = i => <Card key={i.label} {...i} />;
  return (
    <Grid
      className="grid"
      as="div"
      largeDesktop={{
        columns: 'repeat(5, minmax(10px, 1fr))',
        gap: '40px',
      }}
      desktop={{
        columns: 'repeat(4, minmax(10px, 1fr))',
        gap: '40px',
      }}
      tablet={{
        columns: 'repeat(3, minmax(10px, 1fr))',
        gap: '30px',
      }}
      largeMobile={{
        columns: 'repeat(3, minmax(10px, 1fr))',
        gap: '30px',
      }}
      mediumMobile={{
        columns: 'repeat(2, minmax(10px, 1fr))',
        gap: '30px',
      }}>
      {items.map(renderCard)}
    </Grid>
  );
}

export default function documents() {
  return (
    <>
      <Head>
        <title>Торги</title>
        <meta property="og:title" content="Документы" />
        <meta property="og:description" content="Документы" />
        <meta property="og:url" content="https://site.com/about" />
        <meta property="og:image" content="/images/og/im_2.png" key="og:image" />
        <meta property="twitter:image" content="/images/og/im_2.png" key="twitter:image" />
        <meta property="twitter:title" content="Документы" />
        <meta property="twitter:description" content="Документы" />
        <meta property="twitter:url" content="https://site.com/about" />
        <meta name="description" content="Документы" />
      </Head>
      <Page
        ancors={ancors}
        label="Документы"
        text=" Федеральное государственное бюджетное учреждение «Дирекция по обеспечению деятельности Федерального агентства по управлению государственным имуществом» (ОГРН 1187746840423,  ИНН 7722467407), на основании распоряжения Правительства Российской Федерации от 24.01.2018 № 75-р было преобразовано из Федерального государственного унитарного предприятия «Авторемонтный центр Мингосимущества России» (ОГРН 1027739280470, ИНН 7722011854)."
      >
        <Header id="about">Об учреждении</Header>
        <Content>
          <CustomGrid items={about} />
        </Content>
        <Header id="certificates">Сертификаты и лицензии</Header>
        <Content>
          <CustomGrid items={serf} />
        </Content>
        <Header id="summary">Сводные ведомости</Header>
        <Content>
          <CustomGrid items={statements} />
        </Content>
        <Header id="disclosure">Раскрытие информации</Header>
        <Content>
          <CustomGrid items={info} />
        </Content>
      </Page>
    </>
  );
}
