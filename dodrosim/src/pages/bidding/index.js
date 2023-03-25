import React from 'react';
import Head from "next/head";
import SC from 'styled-components';
import Grid from '@kiwicom/orbit-components/lib/utils/Grid';
import {Page, Card} from '../../components';

const Content = SC.div`
  margin: 40px 0 0 0;
`;

const items = [
  { label: 'Аренда имущества', href: '/vacancies' },
  { label: 'Список закупок', href: '/vacancies' },
  { label: 'План закупок (44-ФЗ)', href: '/vacancies' },
  { label: 'План закупок (223-ФЗ)', href: '/vacancies' },
  { label: 'Отчётность по договорам (223-ФЗ)', href: '/vacancies' },
  { label: 'Положение о закупках', href: '/vacancies' },
];

export default function bidding() {
  const renderCard = i => <Card key={i.label} {...i} />;
  return (
    <>
      <Head>
        <title>Торги</title>
        <meta property="og:title" content="Торги" />
        <meta property="og:description" content="Торги" />
        <meta property="og:url" content="https://site.com/about" />
        <meta property="og:image" content="/images/og/im_2.png" key="og:image" />
        <meta property="twitter:image" content="/images/og/im_2.png" key="twitter:image" />
        <meta property="twitter:title" content="Торги" />
        <meta property="twitter:description" content="Торги" />
        <meta property="twitter:url" content="https://site.com/about" />
        <meta name="description" content="Торги" />
      </Head>
      <Page
        withRight={false}
        label="Торги"
        text="Федеральное государственное бюджетное учреждение «Дирекция по обеспечению деятельности Федерального агентства по управлению государственным имуществом» (ОГРН 1187746840423,  ИНН 7722467407), на основании распоряжения Правительства Российской Федерации от 24.01.2018 № 75-р было преобразовано из Федерального государственного унитарного предприятия «Авторемонтный центр Мингосимущества России» (ОГРН 1027739280470, ИНН 7722011854)."
      >
        <Content>
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
        </Content>
      </Page>
    </>
  );
}
