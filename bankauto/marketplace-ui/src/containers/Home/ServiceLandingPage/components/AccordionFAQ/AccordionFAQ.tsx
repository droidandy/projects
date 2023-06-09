import React from 'react';
import { ContainerWrapper } from '@marketplace/ui-kit';
import { useStyles } from './AccordionFAQ.styles';
import { AccordionFAQItem } from './AccordionFAQItem';

const Q1 = React.memo(() => (
  <>
    Услуги оказываются сервисом Uremont.
    <ul>
      <li>Создайте заявку на ремонт, укажите, какую работу вам необходимо произвести.</li>
      <li>Получите предложения от сервисных центров, выберите оптимальное для вас.</li>
      <li>Отправляйтесь в сервисный центр для проведения работ.</li>
    </ul>
  </>
));

const Q2 = React.memo(() => (
  <>
    <p>
      Для создания заявки заполните форму с описанием необходимых работ, или опишите характер неисправности, если не
      удаётся определить место возникновения неисправности.
    </p>
    <p>
      <b>ВАЖНО</b>: Чем подробнее вы опишете свою заявку, тем более точные предложения от автосервисов вы получите.
    </p>
  </>
));

const Q3 = React.memo(() => (
  <>
    <p>
      Все предложения начинают поступать в течение 15 минут в личный кабинет Uremont на сайте{' '}
      <a href="https://uremont.com">https://uremont.com/</a>. В среднем на одну заявку приходится пять предложений от
      автосервисов.
    </p>
    <p>Все ответы на заявки вы можете увидеть в разделе «Заявки на ремонт/Ответы по заявкам».</p>
  </>
));

const Q4 = React.memo(() => (
  <p>
    Получая ответ на заявку, вы можете перейти в чат и полноценно в режиме online вести общение с автосервисами,
    сравнивая поступившие предложения и выбирая лучшее. После выбора автосервиса следуйте подсказкам сайта.
  </p>
));

const Q5 = React.memo(() => (
  <p>
    Личный кабинет Uremont размещен на сайте <a href="https://uremont.com">https://uremont.com/</a>. Для входа в личный
    кабинет следуете подсказкам на сайте.
  </p>
));

const Q6 = React.memo(() => (
  <p>
    Выбирая подходящего исполнителя, учитывайте следующие параметры: рейтинг, отзывы клиентов на странице автосервиса,
    стоимость и предлагаемые специальные предложения, местонахождение на карте поиска.
  </p>
));

const Q7 = React.memo(() => (
  <p>
    Вам нет необходимости обзванивать все автосервисы и озвучивать одни и те же вопросы каждому автосервису. Достаточно
    создать запрос на ремонт один раз получить выгодные предложения от автосервисов. Как только вы выберите исполнителя,
    вам будут доступны контакты автосервиса. Весь диалог строится в режиме online в чате вашей заявки.
  </p>
));

const Q8 = React.memo(() => (
  <p>
    Размещение заявки вас ни к чему не обязывает. Если ни одно из предложений вас не заинтересовало, вы можете отменить
    заявку.
  </p>
));

const Q9 = React.memo(() => (
  <>
    <p>
      Отзыв является обязательным и завершающим этапом вашего взаимодействия с автосервисом, и принимает участие в
      понижение или повышение статуса автосервиса в рейтинге лучших.
    </p>
    <p>
      Ваш отзыв позволяет остальным автовладельцам сориентироваться, оценить качество работы и сделать правильный выбор
      по ремонту своего автомобиля.
    </p>
  </>
));

const OPTIONS = [
  ['Как работает сервис записи на ремонт?', <Q1 />],
  ['Как правильно создать заявку на ремонт?', <Q2 />],
  ['Как увидеть предложения по ремонту?', <Q3 />],
  ['Как строится диалог с автосервисом на сайте?', <Q4 />],
  ['Как войти в личный кабинет для просмотра ответа от автосервисов?', <Q5 />],
  ['Как выбрать надежного исполнителя?', <Q6 />],
  ['Как обменяться контактами с автосервисом?', <Q7 />],
  ['Обязательно ли выбирать исполнителя?', <Q8 />],
  ['Зачем оставлять отзыв по результатам работы автосервиса?', <Q9 />],
];

export const AccordionFAQ = React.memo(() => {
  const { container, header } = useStyles();
  return (
    <ContainerWrapper className={container}>
      <p className={header}>Частые вопросы</p>
      <AccordionFAQItem options={OPTIONS} />
    </ContainerWrapper>
  );
});
