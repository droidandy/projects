import React from 'react';
import { useStyles } from './InputWithAutostatPrice.styles';

export const InfoAboutAutostat = () => {
  const { infoItem, infoContainer, infoList } = useStyles();

  return (
    <div className={infoContainer}>
      <div className={infoItem}>
        Цена является ориентировочной, была рассчитана аналитическим агентством «АВТОСТАТ» на основании объявлений
        (Avito.ru, Auto.ru, Drom.ru) за текущий месяц и аналитики реальных дилерских сделок.
      </div>
      <div className={infoItem}>При оценке автомобиля были использованы следующие предположения:</div>
      <div className={infoItem}>
        <ul className={infoList}>
          <li>Автомобиль не был в серьёзном ДТП и находится в хорошем техническом состоянии;</li>
          <li>На автомобиле оригинальная краска, нет внешних повреждений и отсутствуют повреждения салона;</li>
          <li>Автомобиль никогда не сдавался в наём, не использовался для частного или коммерческого извоза.</li>
        </ul>
      </div>
      <div className={infoItem}>
        Точная стоимость вашего автомобиля может быть определена исключительно после визуального осмотра автомобиля и
        проведения диагностики специалистами.
      </div>
    </div>
  );
};
