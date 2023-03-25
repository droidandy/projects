import React, { Fragment } from 'react';
import Head from "next/head";
import SC from 'styled-components';
import Grid from '@kiwicom/orbit-components/lib/utils/Grid/index';
import { Page, NewsCard } from '../../components';

const Content = SC.div`
  margin: 45px 0;
`;

const Header = SC.div`
  margin: 25px 0;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 30px;
  color: #000000;
`;

const items = [
  { label: 'О правилах профилактики коронавирусной инфекции', date: '24 декабря 2021', href: '/news/1', url: 'https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510__340.jpg' },
  { label: 'Росимущество и ФАС России обсудили проблемные вопросы применения Закона № 44-ФЗ', date: '9 ноября 2021', href: '/news/32', url: 'https://media.istockphoto.com/photos/picturesque-morning-in-plitvice-national-park-colorful-spring-scene-picture-id1093110112?k=6&m=1093110112&s=612x612&w=0&h=uBH7Rj-Ew_ixjunRrD_U7alq2ZUPJ_5XgMpe9xO52QQ=' },
  { label: 'Склады и офисы: основные тренды на рынке коммерческой недвижимости', date: '9 августа 2021', href: '/news/342', url: 'https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510__340.jpg' },
  { label: 'Росимущество работает над созданием суперсервиса «Имущество онлайн»', date: '21 июля 2021', href: '/news/123123', url: 'https://media.istockphoto.com/photos/picturesque-morning-in-plitvice-national-park-colorful-spring-scene-picture-id1093110112?k=6&m=1093110112&s=612x612&w=0&h=uBH7Rj-Ew_ixjunRrD_U7alq2ZUPJ_5XgMpe9xO52QQ=' },
];

const data = [
  {
    title: 'За 2021 год',
    items,
  },
  {
    title: 'За 2020 год',
    items,
  },
  {
    title: 'За 2019 год',
    items,
  },
];

export default function news() {
  const renderCard = i => <NewsCard key={i.label} {...i} />;
  return (
    <>
      <Head>
        <title>Новости</title>
        <meta property="og:title" content="Новости" />
        <meta property="og:description" content="Новости" />
        <meta property="og:url" content="https://site.com/about" />
        <meta property="og:image" content="/images/og/im_2.png" key="og:image" />
        <meta property="twitter:image" content="/images/og/im_2.png" key="twitter:image" />
        <meta property="twitter:title" content="Новости" />
        <meta property="twitter:description" content="Новости" />
        <meta property="twitter:url" content="https://site.com/about" />
        <meta name="description" content="Новости" />
      </Head>
      <Page label="Новости" withRight={false}>
        {data.map(d => (
          <Fragment key={d.title}>
            <Header>{d.title}</Header>
            <Content>
              <Grid
                className="grid"
                as="div"
                largeDesktop={{
                  columns: 'repeat(2, minmax(10px, 1fr))',
                  gap: '40px',
                }}
                desktop={{
                  columns: 'repeat(2, minmax(10px, 1fr))',
                  gap: '40px',
                }}
                tablet={{
                  columns: 'repeat(2, minmax(10px, 1fr))',
                  gap: '30px',
                }}
                largeMobile={{
                  columns: 'repeat(1, minmax(10px, 1fr))',
                  gap: '30px',
                }}
                mediumMobile={{
                  columns: 'repeat(1, minmax(10px, 1fr))',
                  gap: '30px',
                }}>
                {(d.items || []).map(renderCard)}
              </Grid>
            </Content>
          </Fragment>
        ))}
      </Page>
    </>
  );
}
