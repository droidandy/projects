import React from 'react';
import Head from "next/head";
import { useRouter } from 'next/router';
import SC from 'styled-components';
import Grid from '@kiwicom/orbit-components/lib/utils/Grid';
import { Page, VacancyCard } from '../../components';
import { maxDevice, minDevice } from '../../theme';

const Content = SC.div`
  margin: 30px 0 0 0;
`;

const Header = SC.div`
  margin: 25px 0;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 30px;
  color: #000000;
`;

const Text = SC.div`
  margin: 12px 0;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
  color: #777777;
`;

const Label = SC.div`
  white-space: pre-line;
  font-style: normal;
  font-weight: normal;
  color: #000000;
`;

const SmallLabel = SC.div`
  white-space: pre-line;
  font-style: normal;
  font-weight: bold;
  font-size: 10px;
  line-height: 13px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
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
    align-items: center;
    justify-content: space-between;
  }
  @media ${maxDevice.mobileL} {
    margin-bottom: 30px;
    font-size: 30px;
    line-height: 36px;
  }
`;

const Other = SC.div`
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #000000;
`;

const Button = SC.button`
  background: #008E5B;
  border-radius: 5px;
  height: 60px;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #FFFFFF;
  border: none;
  padding: 25px;
`;

const Btn = SC(Button)`
  margin: 40px 0;
`;

const items = [
  { label: 'Заместитель руководителя', category: 'Менеджмент', href: '/vacancies/1' },
  { label: 'Ведущий программист на Pyton', category: 'IT', href: '/vacancies/34' },
  { label: 'Заведующий отдела закупок', category: 'Менеджмент', href: '/vacancies/345' },
];

export default function Vacancies() {
  const router = useRouter();
  const { id } = router.query;
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
      <Page withRight={false}>
        <Row>
          <SmallLabel>Менеджмент</SmallLabel>
          <Label>Заместитель руководителя</Label>
        </Row>
        <Header>Обязанности</Header>
        <Text>
          — Контроль эффективной работы склада;
        </Text>
        <Text>
          — Организация соблюдения стандартов складских и логистических операций;
        </Text>
        <Text>
          — Выполнение плановых показателей;
        </Text>
        <Text>
          — Работа с документами;
        </Text>
        <Text>
          — Руководство и обучение персонала;
        </Text>
        <Text>
          — Помощь руководителю склада.
        </Text>
        <Header>Требования</Header>
        <Text>
          — Уверенный пользователь ПК (1С Склад, Word, Excel);
        </Text>
        <Text>
          — Работа в команде на результат;
        </Text>
        <Text>
          — Готовность к интенсивной физической работе;
        </Text>
        <Text>
          — Опыт в управлении.
        </Text>
        <Header>Условия</Header>
        <Text>
          — Оформление по ТК РФ;
        </Text>
        <Text>
          — Стабильная белая заработная плата;
        </Text>
        <Text>
          — График работы 5-2-4-3, есть дневные и вечерние графики
        </Text>
        <Text>
          — Место работы подбираем ближайшее к дому;
        </Text>
        <Text>
          — Склады находятся по всей Москве и МО;
        </Text>
        <Text>
          — Рост и развитие внутри компании.
        </Text>
        <Btn>
          откликнуться на вакансию
        </Btn>
        <Other>Другие вакансии</Other>
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
