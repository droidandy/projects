import { jsPDF, TextOptionsLight } from 'jspdf';
import '../fonts/OpenSans-Regular-normal';
import '../fonts/OpenSans-Bold-bold';
import {
  avatarImg,
  calendarImg,
  carIconImg,
  driveImg,
  geoImg,
  hashImg,
  houseImg,
  levelImg,
  managerImg,
  phoneImg,
  rubyColor,
  textColor,
  transmissionImg,
} from '../data';
import { SimpleGenerateProps } from '../../../types/pdf';

const pt = (px: number) => px * 0.75;

const tOptions: TextOptionsLight = {
  lineHeightFactor: 1,
  baseline: 'top',
};

export const generateSimplePdf = ({
  isMeeting,
  number,
  createdAt,
  meetingDate,
  name,
  brand,
  model,
  generation,
  equipment,
  vin,
  year,
  bodyType,
  volume,
  power,
  engine,
  drive,
  transmission,
  colorName,
  colorCode,
  price,
  isCalculatedTradeIn,
  tradeInVehicleModel,
  tradeInVehicleBrand,
  tradeInVehicleGeneration,
  tradeInVehiclePrice,
  isCalculatedCredit,
  tradeInDiscount,
  creditValue,
  creditTerm,
  creditRate,
  creditMonthlyPayment,
  creditDiscount,
  address,
  office,
  officePhone,
  qrCode,
}: SimpleGenerateProps) => {
  const isMeetingB = isMeeting === 'true';
  const isCalculatedTradeInB = isCalculatedTradeIn === 'true';

  const isCalculatedCreditB = isCalculatedCredit === 'true';

  const finalPrice =
    +price - (isCalculatedTradeInB ? +tradeInDiscount : 0) - (isCalculatedCreditB ? +creditDiscount : 0);

  const ml = 170;

  // определяем нужно ли вычитать отступ для данных после кредита/трейд-ина
  const mt = !isCalculatedTradeInB ? 156 : 0;
  const mtc = mt + (!isCalculatedCreditB ? 196 : 0);
  const options: any = {
    unit: 'px',
    format: [1920, 2700 - mtc],
    precision: 1,
    compress: true,
  };
  options.hotfixes = ['px_scaling'];
  // eslint-disable-next-line
  const doc = new jsPDF(options);
  doc.setLanguage('ru');
  doc.setDisplayMode('fullwidth');

  doc.addImage(avatarImg, 'png', ml, 80, 351, 120);

  if (isMeetingB) {
    doc.setFont('OpenSans-Bold', 'bold');
    doc.setFontSize(pt(32));
    doc.setTextColor(textColor);
    doc.text('Встреча в дилерском центре', 641, 104, tOptions);

    doc.setFontSize(pt(24));
    doc.text(meetingDate, 641, 162, tOptions);

    doc.text(`от ${createdAt}`, 1228, 162, tOptions);
  }

  doc.setFont('OpenSans-Bold', 'bold');
  doc.setFontSize(pt(32));
  doc.setTextColor(textColor);
  doc.text(`Заявка №${number}`, 1228, 104, tOptions);
  doc.setFontSize(pt(24));
  doc.text(`от ${createdAt}`, 1228, 162, tOptions);

  doc.addImage(qrCode, 'png', 1570, 70, 180, 180);

  doc.setDrawColor(0);
  doc.setFillColor(rubyColor);
  doc.rect(ml, 300, 1580, 20, 'F');

  doc.setFontSize(pt(32));
  doc.setFont('OpenSans-Bold', 'bold');
  doc.text(`Уважаемый ${name}!`, ml, 380, tOptions);
  doc.setFontSize(pt(24));
  doc.setFont('OpenSans-Regular', 'normal');
  doc.text('Команда #банкавто поздравляет Вас с выбором автомобиля.', ml, 458, tOptions);
  doc.text(
    'Надеемся, что покупка принесет Вам радость в использовании, а поездки будут комфортными и приятными.',
    ml,
    528,
    tOptions,
  );

  doc.setFont('OpenSans-Bold', 'bold');
  doc.setFontSize(pt(32));
  doc.text('Информация об автомобиле', ml, 646, tOptions);

  doc.setDrawColor(textColor);
  doc.line(ml, 714, ml + 1580, 715);

  doc.setFontSize(pt(24));
  doc.text(`${brand} ${model} ${generation}`, ml, 754, tOptions);

  doc.text(`Комплектация: ${equipment}`, 1920 - ml, 754, {
    baseline: 'top',
    lineHeightFactor: 1,
    align: 'right',
    maxWidth: 800,
  });

  doc.addImage(hashImg, 'png', ml, 836, 48, 48);
  doc.setFont('OpenSans-Regular', 'normal');
  doc.setFontSize(pt(16));
  doc.text('VIN', 248, 830, tOptions);
  doc.setFontSize(pt(24));
  doc.text(`${vin}`, 248, 854, tOptions);

  doc.addImage(calendarImg, 'png', 565, 836, 48, 48);
  doc.setFont('OpenSans-Regular', 'normal');
  doc.setFontSize(pt(16));
  doc.text('Год выпуска', 643, 830, tOptions);
  doc.setFontSize(pt(24));
  doc.text(`${year}`, 643, 854, tOptions);

  doc.addImage(carIconImg, 'png', 960, 836, 48, 48);
  doc.setFont('OpenSans-Regular', 'normal');
  doc.setFontSize(pt(16));
  doc.text('Кузов', 1038, 830, tOptions);
  doc.setFontSize(pt(24));
  doc.text(`${bodyType}`, 1038, 854, tOptions);

  doc.addImage(levelImg, 'png', 1355, 836, 48, 48);
  doc.setFont('OpenSans-Regular', 'normal');
  doc.setFontSize(pt(16));
  doc.text('Двигатель', 1433, 830, tOptions);
  doc.setFontSize(pt(24));
  doc.text(`${volume} л / ${power} л.с. / ${engine}`, 1433, 854, tOptions);

  doc.addImage(driveImg, 'png', ml, 936, 48, 48);
  doc.setFont('OpenSans-Regular', 'normal');
  doc.setFontSize(pt(16));
  doc.text('Привод', 248, 930, tOptions);
  doc.setFontSize(pt(24));
  doc.text(`${drive}`, 248, 954, tOptions);

  doc.addImage(transmissionImg, 'png', 565, 936, 48, 48);
  doc.setFont('OpenSans-Regular', 'normal');
  doc.setFontSize(pt(16));
  doc.text('Коробка', 643, 930, tOptions);
  doc.setFontSize(pt(24));
  doc.text(`${transmission}`, 643, 954, tOptions);

  doc.setDrawColor('#E8E8E8');
  doc.setFillColor(colorCode);
  doc.circle(960 + 24, 936 + 24, 24, 'DF');
  doc.setFont('OpenSans-Regular', 'normal');
  doc.setFontSize(pt(16));
  doc.text('Цвет', 1038, 930, tOptions);
  doc.setFontSize(pt(24));
  doc.text(`${colorName}`, 1038, 954, tOptions);

  doc.setFont('OpenSans-Bold', 'bold');
  doc.setFontSize(pt(32));
  doc.text('Условия сделки', ml, 1070, tOptions);

  doc.setDrawColor(textColor);
  doc.line(ml, 1138, ml + 1580, 1139);

  doc.setFont('OpenSans-Regular', 'normal');
  doc.setFontSize(pt(16));
  doc.text('Первоначальная стоимость', ml, 1182, tOptions);
  doc.setFont('OpenSans-Bold', 'bold');
  doc.setFontSize(pt(32));
  doc.setTextColor('#8C9091');
  doc.text(`${(+price).toLocaleString('ru')} р.`, ml, 1206, tOptions);
  doc.setDrawColor(textColor);
  doc.line(536, 1178, 537, 1178 + 80);

  doc.setFont('OpenSans-Regular', 'normal');
  doc.setTextColor(textColor);
  doc.setFontSize(pt(16));
  doc.text('Скидка за трейд-ин', 577, 1182, tOptions);
  doc.setFont('OpenSans-Bold', 'bold');
  doc.setFontSize(pt(32));
  doc.text(`${(isCalculatedTradeInB ? +tradeInDiscount : 0).toLocaleString('ru')} р.`, 577, 1206, tOptions);
  doc.setDrawColor(textColor);
  doc.line(932, 1178, 933, 1178 + 80);

  doc.setFont('OpenSans-Regular', 'normal');
  doc.setFontSize(pt(16));
  doc.text('Скидка за кредит', 973, 1182, tOptions);
  doc.setFont('OpenSans-Bold', 'bold');
  doc.setFontSize(pt(32));
  doc.text(`${(isCalculatedCreditB ? +creditDiscount : 0).toLocaleString('ru')} р.`, 973, 1206, tOptions);
  doc.setDrawColor(textColor);
  doc.line(1328, 1178, 1329, 1178 + 80);

  doc.setFont('OpenSans-Regular', 'normal');
  doc.setFontSize(pt(16));
  doc.text('Стоимость с учетом скидки', 1369, 1182, tOptions);
  doc.setFont('OpenSans-Bold', 'bold');
  doc.setFontSize(pt(32));
  doc.setTextColor(rubyColor);
  doc.text(`${(+finalPrice).toLocaleString('ru')} р.`, 1369, 1206, tOptions);

  if (isCalculatedTradeInB) {
    doc.setTextColor(textColor);
    doc.setFontSize(pt(24));
    doc.text('Предварительный расчет трейд-ин', ml, 1298, tOptions);

    doc.setFont('OpenSans-Regular', 'normal');
    doc.setFontSize(pt(16));
    doc.text('Автомобиль', ml, 1360);
    doc.setFontSize(pt(24));
    doc.text(`${tradeInVehicleBrand} ${tradeInVehicleModel} ${tradeInVehicleGeneration}`, ml, 1390);

    doc.setFontSize(pt(16));
    doc.text('Предварительная оценка стоимости', 470, 1360);
    doc.setFontSize(pt(24));
    doc.text(`${(+tradeInVehiclePrice).toLocaleString('ru')} р.`, 470, 1390);

    doc.setFontSize(pt(16));
    doc.text('Окончательная стоимость будет определена после диагностики в ДЦ', 835, 1360);
  }

  if (isCalculatedCreditB) {
    doc.setTextColor(textColor);
    doc.setFont('OpenSans-Bold', 'bold');
    doc.setFontSize(pt(24));
    doc.text('Заявка на кредит одобрена', ml, 1454 - mt, tOptions);

    doc.setFont('OpenSans-Regular', 'normal');
    doc.setFontSize(pt(16));
    doc.text('Сумма кредита', ml, 1516 - mt);
    doc.setFontSize(pt(24));
    doc.text(`${(+creditValue).toLocaleString('ru')} р.`, ml, 1546 - mt);

    doc.setFontSize(pt(16));
    doc.text('Срок кредита', 380, 1516 - mt);
    doc.setFontSize(pt(24));
    doc.text(`${creditTerm} месяцев`, 380, 1546 - mt);

    doc.setFontSize(pt(16));
    doc.text('Ежемесячный платеж', 590, 1516 - mt);
    doc.setFontSize(pt(24));
    doc.text(`${(+creditMonthlyPayment).toLocaleString('ru')} р/месяц`, 590, 1546 - mt);

    doc.setFontSize(pt(16));
    doc.text('Процентная ставка', 845, 1516 - mt);
    doc.setFontSize(pt(24));
    doc.text(`${+creditRate * 100}%`, 845, 1546 - mt);
  }

  doc.setFont('OpenSans-Bold', 'bold');
  doc.setTextColor(textColor);
  doc.setFontSize(pt(32));
  doc.text('Контактные данные', ml, 1650 - mtc, tOptions);

  doc.setDrawColor(textColor);
  doc.line(ml, 1718 - mtc, ml + 1580, 1719 - mtc);

  doc.setFont('OpenSans-Regular', 'normal');
  doc.setFontSize(pt(24));
  doc.text('Ваш персональный менеджер', ml, 1758 - mtc, tOptions);

  doc.setDrawColor('#8C9091');
  doc.circle(ml + 80, 1834 + 80 - mtc, 80, 'S');
  doc.addImage(managerImg, 'png', ml + 7, 1841 - mtc, 146, 146);

  doc.setFontSize(pt(16));
  doc.setFont('OpenSans-Regular', 'normal');
  doc.text('Старший продавец', 358, 1856 - mtc, tOptions);
  doc.setFontSize(pt(24));
  doc.text('Лазарев Антон', 358, 1880 - mtc, tOptions);

  doc.text('+7 995 155 32 13', 358, 1936 - mtc);

  doc.setDrawColor(textColor);
  doc.line(959, 1758 - mtc, 960, 1758 + 250 - mtc);

  doc.addImage(houseImg, 'png', 1041, 1764 - mtc, 48, 48);
  doc.setFontSize(pt(16));
  doc.setFont('OpenSans-Regular', 'normal');
  doc.text('Дилерский центр', 1119, 1758 - mtc, tOptions);
  doc.setFontSize(pt(24));
  doc.text(`${office}`, 1119, 1782 - mtc, tOptions);

  doc.addImage(geoImg, 'png', 1041, 1864 - mtc, 48, 48);
  doc.setFontSize(pt(16));
  doc.text('Адрес', 1119, 1858 - mtc, tOptions);
  doc.setFontSize(pt(24));
  doc.text(`${address}`, 1119, 1882 - mtc, tOptions);

  doc.addImage(phoneImg, 'png', 1041, 1964 - mtc, 48, 48);
  doc.setFontSize(pt(16));
  doc.text('Телефон', 1119, 1958 - mtc, tOptions);
  doc.setFontSize(pt(24));
  doc.text(officePhone, 1119, 1982 - mtc, tOptions);

  doc.setFont('OpenSans-Bold', 'bold');
  doc.setFontSize(pt(32));
  doc.text('Необходимые Документы', ml, 2138 - mtc, tOptions);

  doc.setDrawColor(textColor);
  doc.line(ml, 2206 - mtc, ml + 1580, 2207 - mtc);

  doc.setFont('OpenSans-Bold', 'bold');
  doc.setFontSize(pt(24));
  doc.text('Обязательные документы', ml, 2254 - mtc, tOptions);
  doc.setFont('OpenSans-Regular', 'normal');
  doc.text('Паспорт, водительское удостоверение', ml, 2290 - mtc, tOptions);

  doc.setFont('OpenSans-Bold', 'bold');
  doc.setFontSize(pt(24));
  doc.text(
    'В случае, если вы готовы сдать автомобиль в трейд-ин возьмите на сделку следующий перечень документов:',
    ml,
    2346 - mtc,
    tOptions,
  );
  doc.setFont('OpenSans-Regular', 'normal');
  doc.text(
    'Паспорт транспортного средства, диагностическая карта, свидетельство о регистрации транспортного средства ',
    ml,
    2382 - mtc,
    tOptions,
  );

  doc.setFont('OpenSans-Bold', 'bold');
  doc.setFontSize(pt(24));
  doc.text('В случае суммы кредита больше 1 млн. руб один из документов на выбор:', ml, 2438 - mtc, tOptions);
  doc.setFont('OpenSans-Regular', 'normal');
  doc.text(
    '2-НДФЛ, справка по форме Банка, выписка из ПФР, выписка по счёту в другом Банке, 3-НДФЛ, декларация по УСН, \nдекларация по ЕНВД, декларация ЕСХН ',
    ml,
    2474 - mtc,
    {
      baseline: 'top',
      lineHeightFactor: 1.5,
    },
  );

  return doc.output('arraybuffer');
};
