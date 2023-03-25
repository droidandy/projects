import React  from 'react';
import Head from "next/head";
import { useRouter } from 'next/router';
import SC from 'styled-components';
import Grid from '@kiwicom/orbit-components/lib/utils/Grid/index';
import { NewsCard, Page } from '../../components';
import { maxDevice, minDevice } from '../../theme';

const Content = SC.div`
  margin: 30px 0;
`;

const Label = SC.div`
  width: 66%;
  white-space: pre-line;
  font-style: normal;
  font-weight: normal;
  color: #000000;
`;

const SmallLabel = SC.div`
  width: 33%;
  white-space: pre-line;
  font-style: normal;
  font-weight: bold;
  font-size: 10px;
  line-height: 13px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-align: right;
  @media ${maxDevice.tablet} {
    text-align: left;
  }
  color: #777777;
`;

const Row = SC.div`
  font-size: 40px;
  line-height: 48px;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  @media ${minDevice.tablet} {
    flex-direction: row-reverse;
    align-items: flex-start;
    justify-content: space-between;
  }
  @media ${maxDevice.mobileL} {
    margin-bottom: 30px;
    font-size: 30px;
    line-height: 36px;
  }
`;

const Other = SC.div`
  margin: 60px 0 0 0;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #000000;
`;

const Text = SC.div`
  width: 66%;
  margin: 12px 0;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
  color: #777777;
`;

const ImageContent = SC.div`
  width: 100%;
  min-width: 100%;
  height: 400px;
  min-height: 400px;
  background-repeat: no-repeat;
  // background-attachment: fixed;
  background-size: cover;
  background-position: center; 
  border-radius: 3px;
  margin: 0 0 40px 0;
`;

const items = [
  { label: 'О правилах профилактики коронавирусной инфекции', date: '24 декабря 2021', href: '/news/1', url: 'https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510__340.jpg' },
  { label: 'Росимущество и ФАС России обсудили проблемные вопросы применения Закона № 44-ФЗ', date: '9 ноября 2021', href: '/news/32', url: 'https://media.istockphoto.com/photos/picturesque-morning-in-plitvice-national-park-colorful-spring-scene-picture-id1093110112?k=6&m=1093110112&s=612x612&w=0&h=uBH7Rj-Ew_ixjunRrD_U7alq2ZUPJ_5XgMpe9xO52QQ=' },
  { label: 'Склады и офисы: основные тренды на рынке коммерческой недвижимости', date: '9 августа 2021', href: '/news/342', url: 'https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510__340.jpg' },
  { label: 'Росимущество работает над созданием суперсервиса «Имущество онлайн»', date: '21 июля 2021', href: '/news/123123', url: 'https://media.istockphoto.com/photos/picturesque-morning-in-plitvice-national-park-colorful-spring-scene-picture-id1093110112?k=6&m=1093110112&s=612x612&w=0&h=uBH7Rj-Ew_ixjunRrD_U7alq2ZUPJ_5XgMpe9xO52QQ=' },
];

export default function News() {
  const router = useRouter();
  const { id } = router.query;
  const current = items[1];
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
      <Page withRight={false}>
        <Row>
          <SmallLabel>{current.date}</SmallLabel>
          <Label>{current.label}</Label>
        </Row>
        <ImageContent style={{ backgroundImage: `url(${current.url})` }} />
        <Text>
          Цены на жилье в 2018 году росли практически во всех крупных городах России. Однако спрогнозировать ситуацию на локальных рынках недвижимости в 2019 году пока сложно.
        </Text>
        <Text>
          Аналитики региональных агентств недвижимости и компаний, входящих в Российскую гильдию риэлторов (РГР), подготовили отчет (.ppt) о ценах и тенденциях на локальных рынках.
        </Text>
        <Other>Другие новости</Other>
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
            {items.map(renderCard)}
          </Grid>
        </Content>
      </Page>
    </>
  );
}
