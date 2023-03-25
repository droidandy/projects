import React, { FC } from 'react';
import { Button, Divider, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { Link } from 'components';
import { ReactComponent as ExpandIcon } from 'icons/arrowDownRed.svg';
import { ImageWebpGen } from 'components/ImageWebpGen';
import { useStyles } from './TextBlock.styles';

const mainTexts = [
  'Уважаемые клиенты!',
  'Принято решение о присоединении РГС Банка к банку «Открытие». Автобизнес при этом останется одним из клиентских сегментов и важной частью стратегии группы «Открытие».',
  'Сегодня мы объединяемся, чтобы стать надежнее и удобнее для вас. При этом мы позаботились о том, чтобы процесс объединения был для вас максимально комфортным. Работа банка в процессе объединения будет непрерывной, а все действующие продукты доступны на прежних условиях, до конца срока их действия.',
];
const expandTexts = [
  'За последние 3 года работы в рамках новой бизнес-стратегии РГС Банк достиг впечатляющих результатов. Мы вошли в ТОП-50 крупнейших банков России по активам, в ТОП-25 банков по розничному кредитному портфелю и в ТОП-5 игроков рынка автокредитования по выдачам и портфелю. Мы выстроили отношения с ключевыми автодилерами и автопроизводителями. 6 из ТОП-10 и треть из ТОП-100 автодилеров являются нашими клиентами, а партнерская сеть офлайн-продаж охватывает более 3,3 тысяч дилерских предприятий. В свою очередь база активных клиентов – физических лиц РГС Банка уже превысила 277 тыс. человек.',
  'Мы запустили маркетплейс #банкавто для профессиональных участников авторынка и потребителей, который совмещает в одном месте банковские и небанковские сервисы. На автомаркете для клиентов доступны не только услуги покупки и продажи автомобилей, в том числе между частными лицами, но и онлайн-бронирование, оценка машины и трейд-ин, а также услуги кредитования и страхования. В каталоге маркетплейса представлены на сегодня свыше 18 тысяч машин более чем 70 автомобильных брендов, партнёрами является более 300 дилерских центров в 30 регионах присутствия.',
  'Из банка для автомобилистов мы трансформировались в цифровую платформу, ориентированную на сегмент автобизнеса, которая продолжит развиваться в рамках группы банка «Открытие».',
  <>
    Ниже мы постарались ответить на основные вопросы, которые могут возникнуть у вас в процессе объединения.
    Дополнительно мы будем рады проконсультировать вас телефону круглосуточного контакт-центра{' '}
    <Link href="tel:88007004040">8 800 700 40 40</Link> или по почте{' '}
    <Link href="mailto:consult@rgsbank.ru">consult@rgsbank.ru</Link>.
  </>,
  'Спасибо, что выбрали РГС Банк! Оставайтесь с нами под брендом «Открытие».',
  <>
    Алексей Токарев,
    <br />
    Президент — Председатель Правления РГС Банка
  </>,
];
const TextBlock: FC = () => {
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const s = useStyles({ expanded });
  const { isMobile } = useBreakpoints();
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={s.root}>
      <div className={s.blockItem}>
        <Typography className={s.title} component="div" color="textPrimary">
          Обращение Президента — Председателя Правления РГС Банка Алексея Токарева
        </Typography>
        {mainTexts.map((item) => (
          <Typography variant="body1" key={item} className={s.regularText}>
            {item}
          </Typography>
        ))}
        <div className={s.textCollapse}>
          {expandTexts.map((item, index) => {
            return (
              <Typography variant="body1" key={index} className={s.regularText}>
                {item}
              </Typography>
            );
          })}
        </div>
        <div className={s.divider}>
          <Divider />
        </div>
        <Button variant="text" color="primary" onClick={toggleExpanded}>
          <ExpandIcon className={s.expandIcon} />
          {expanded ? 'Свернуть' : 'Развернуть'}
        </Button>
      </div>
      {!isMobile ? (
        <div className={s.imageWrapper}>
          <ImageWebpGen src={'/images/tokarev.jpg'} />
        </div>
      ) : null}
    </div>
  );
};
export { TextBlock };
