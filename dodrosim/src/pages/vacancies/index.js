import React from 'react';
import Head from "next/head";
import SC from 'styled-components';
import Grid from '@kiwicom/orbit-components/lib/utils/Grid';
import { Page, VacancyCard } from '../../components';

const Content = SC.div`
  margin: 60px 0 0 0;
`;

const items = [
  { label: 'Заместитель руководителя', category: 'Менеджмент', href: '/vacancies/1' },
  { label: 'Ведущий программист на Pyton', category: 'IT', href: '/vacancies/34' },
  { label: 'Заведующий отдела закупок', category: 'Менеджмент', href: '/vacancies/345' },
];

export default function vacancies() {
  const renderCard = i => <VacancyCard key={i.label} {...i} />;
  return (
    <>
      <Head>
        <title>Вакансии</title>
        <meta property="og:title" content="Вакансии" />
        <meta property="og:description" content="Вакансии" />
        <meta property="og:url" content="https://site.com/about" />
        <meta property="og:image" content="/images/og/im_2.png" key="og:image" />
        <meta property="twitter:image" content="/images/og/im_2.png" key="twitter:image" />
        <meta property="twitter:title" content="Вакансии" />
        <meta property="twitter:description" content="Вакансии" />
        <meta property="twitter:url" content="https://site.com/about" />
        <meta name="description" content="Вакансии" />
      </Head>
      <Page
        withRight={false}
        label="Вакансии"
        text="Федеральное государственное бюджетное учреждение «Дирекция по обеспечению деятельности Федерального агентства по управлению государственным имуществом» (ОГРН 1187746840423,  ИНН 7722467407), на основании распоряжения Правительства Российской Федерации от 24.01.2018 № 75-р было преобразовано из Федерального государственного унитарного предприятия «Авторемонтный центр Мингосимущества России» (ОГРН 1027739280470, ИНН 7722011854)."
      >
        <Content>
          <Grid
            className="grid"
            as="div"
            largeDesktop={{
              columns: 'repeat(3, minmax(10px, 1fr))',
              gap: '40px',
            }}
            desktop={{
              columns: 'repeat(3, minmax(10px, 1fr))',
              gap: '40px',
            }}
            tablet={{
              columns: 'repeat(3, minmax(10px, 1fr))',
              gap: '40px',
            }}
            largeMobile={{
              columns: 'repeat(2, minmax(10px, 1fr))',
              gap: '40px',
            }}
            mediumMobile={{
              columns: 'repeat(1, minmax(10px, 1fr))',
              gap: '40px',
            }}>
            {items.map(renderCard)}
          </Grid>
        </Content>
      </Page>
    </>
  );
}
