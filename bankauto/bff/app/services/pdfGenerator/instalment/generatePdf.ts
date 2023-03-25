import { jsPDF, TextOptionsLight } from 'jspdf';
import '../fonts/OpenSans-Regular-normal';
import '../fonts/OpenSans-Bold-bold';
import {
  approvedImg,
  avatarImg,
  geoImg,
  gray,
  houseImg,
  managerImg,
  phoneImg,
  rubyColor,
  textColor,
  white,
} from '../data';
import { InstalmentGenerateProps } from '../../../types/pdf';

const pt = (px: number) => px * 0.75;

const tOptions: TextOptionsLight = {
  lineHeightFactor: 1,
  baseline: 'top',
};

export const generateInstalmentPdf = ({
  number,
  createdAt,
  userFirstName,
  userPatronymicName,
  creditMonthlyPayment,
  creditTerm,
  vehicleBrandName,
  vehicleModelName,
  vehicleEquipmentName,
  vehicleColorName,
  vehicleBodyTypeName,
  vehicleYear,
  vehicleTransmissionName,
  vehicleDriveName,
  vehicleEngineName,
  vehicleEquipmentVolume,
  vehicleEquipmentPower,
  salesOfficeName,
  salesOfficeAddress,
  vehicleImage,
  salesOfficePhones,
  qrCode,
}: InstalmentGenerateProps) => {
  const options: any = {
    unit: 'px',
    format: [1920, 2700],
    precision: 1,
    compress: true,
  };
  options.hotfixes = ['px_scaling'];
  // eslint-disable-next-line
  const doc = new jsPDF(options);
  doc.setLanguage('ru');
  doc.setDisplayMode('fullwidth');

  doc.addImage(avatarImg, 'png', 170, 80, 321, 120);

  doc.setFont('OpenSans-Bold', 'bold');
  doc.setFontSize(pt(48));
  doc.setTextColor(textColor);
  doc.text('Сертификат на покупку \nавтомобиля в рассрочку', 648, 64, {
    baseline: 'top',
    lineHeightFactor: 1.5,
  });

  doc.setFontSize(pt(32));
  doc.text(`Заявка №${number} от ${createdAt}`, 712, 248);

  doc.addImage(qrCode, 'png', 1570, 70, 180, 180);

  doc.setDrawColor(0);
  doc.setFillColor(rubyColor);
  doc.rect(170, 300, 1580, 20, 'F');

  doc.setFontSize(pt(36));
  doc.text(`Уважаемый ${userFirstName} ${userPatronymicName}!`, 1920 / 2, 358, {
    lineHeightFactor: 1,
    baseline: 'top',
    align: 'center',
  });
  doc.text('Команда #банкавто поздравляет Вас с выбором автомобиля', 370, 415, tOptions);

  doc.setFont('OpenSans-Regular', 'normal');
  doc.text('Рассрочка – это одобренный кредит, расходы на который', 450, 486, tOptions);
  doc.text('компенсируются за счет специальных условий от дилерского центра.', 340, 550, tOptions);

  doc.setFont('OpenSans-Bold', 'bold');
  doc.text('Ваш ежемесячный платеж за автомобиль', 482, 634, tOptions);
  doc.setTextColor(rubyColor);
  doc.text(`${(+creditMonthlyPayment).toLocaleString('ru')} р.`, 1297, 634, tOptions);

  doc.setTextColor(textColor);
  doc.text('Срок рассрочки', 700, 690, tOptions);
  doc.setTextColor(rubyColor);
  doc.text(`${creditTerm} месяцев`, 1010, 690, tOptions);

  doc.addImage(vehicleImage, 'png', 666, 766, 592, 363);
  doc.addImage(approvedImg, 'png', 1170, 796, 381, 243);

  doc.setTextColor(textColor);
  doc.setFontSize(pt(64));
  doc.text('Первоначальный взнос', 485, 1179, tOptions);
  doc.setTextColor(rubyColor);
  doc.text('0%', 1300, 1179, tOptions);

  doc.roundedRect(170, 1286, 1580, 160, 8, 8, 'F');

  doc.setTextColor(white);
  doc.setFontSize(pt(30));
  doc.text(`${vehicleBrandName} ${vehicleModelName}`, 1920 / 2, 1326, {
    lineHeightFactor: 1,
    baseline: 'top',
    align: 'center',
  });

  doc.setFontSize(pt(20));
  doc.text(
    `${vehicleEquipmentName}  •  ${vehicleColorName}  •  ${vehicleBodyTypeName}  •  ${vehicleYear} год  •  ${vehicleTransmissionName}  •  ${vehicleDriveName}  •  ${vehicleEngineName}  •  ${vehicleEquipmentVolume} л.  •  ${vehicleEquipmentPower} л.с.`,
    1920 / 2,
    1376,
    {
      lineHeightFactor: 1,
      baseline: 'top',
      align: 'center',
    },
  );

  doc.setFontSize(pt(36));
  doc.setTextColor(textColor);
  doc.text('Автомобиль уже забронирован и ждет вас в дилерском центре.', 345, 1486, tOptions);

  doc.text('Осталось', 517, 1562, tOptions);
  doc.setTextColor(rubyColor);
  doc.text('3 шага', 704, 1562, tOptions);
  doc.setTextColor(textColor);
  doc.text(', чтобы стать владельцем!', 832, 1562, tOptions);

  doc.setFillColor(rubyColor);
  doc.circle(170 + 24, 1642 + 14, 24, 'F');
  doc.setFont('OpenSans-Regular', 'normal');
  doc.setFontSize(pt(24));
  doc.setTextColor(white);
  doc.text('1', 187, 1646, tOptions);
  doc.setTextColor(textColor);
  doc.setFontSize(pt(36));
  doc.text('Подготовьте ваши документы', 241, 1638, tOptions);
  doc.setTextColor(gray);
  doc.setFontSize(pt(24));
  doc.text('Паспорт, водительское удостоверение, справка о доходах', 241, 1694 + 14, tOptions);

  doc.setFillColor(rubyColor);
  doc.circle(170 + 24, 1794 + 14, 24, 'F');
  doc.setFont('OpenSans-Regular', 'normal');
  doc.setFontSize(pt(24));
  doc.setTextColor(white);
  doc.text('2', 187, 1798, tOptions);
  doc.setTextColor(textColor);
  doc.setFontSize(pt(36));
  doc.text('Приезжайте в дилерский центр в назначенное время', 241, 1790, tOptions);
  doc.setTextColor(gray);
  doc.setFontSize(pt(24));
  doc.text('Подпишите документы на покупку автомобиля и кредитную документацию', 241, 1845, tOptions);

  doc.setFillColor(rubyColor);
  doc.circle(170 + 24, 1945 + 14, 24, 'F');
  doc.setFont('OpenSans-Regular', 'normal');
  doc.setFontSize(pt(24));
  doc.setTextColor(white);
  doc.text('3', 187, 1949, tOptions);
  doc.setTextColor(textColor);
  doc.setFontSize(pt(36));
  doc.text('Заберите свой автомобиль в тот же день!', 241, 1941, tOptions);
  doc.setTextColor(gray);
  doc.setFontSize(pt(24));
  doc.text('Первоначальный взнос не требуется', 241, 1996, tOptions);

  doc.setFontSize(pt(32));
  doc.setTextColor(textColor);
  doc.setFont('OpenSans-Bold', 'bold');
  doc.text(
    'Срок действия предложения: 2 дня (для продления срока бронирования обратитесь к \nвашему персональному менеджеру #банкавто)',
    173,
    2092,
    {
      baseline: 'top',
      lineHeightFactor: 1.5,
    },
  );
  doc.setDrawColor(textColor);
  doc.line(959, 2258, 960, 2258 + 250);

  doc.setFont('OpenSans-Regular', 'normal');
  doc.setFontSize(pt(24));
  doc.text('Ваш персональный менеджер', 170, 2258, tOptions);

  doc.setDrawColor('#8C9091');
  doc.circle(230 + 80, 2331 + 80, 80, 'S');
  doc.addImage(managerImg, 'png', 237, 2338, 146, 146);

  doc.setFontSize(pt(16));
  doc.text('Старший продавец', 418, 2356, tOptions);
  doc.setFontSize(pt(24));
  doc.text('Лазарев Антон', 418, 2380, tOptions);
  doc.text('+7 995 155 32 13', 422, 2450);

  doc.addImage(houseImg, 'png', 1041, 2254, 48, 48);
  doc.setFontSize(pt(16));
  doc.text('Дилерский центр', 1119, 2248, tOptions);
  doc.setFontSize(pt(24));
  doc.text(salesOfficeName, 1119, 2272, tOptions);

  doc.addImage(geoImg, 'png', 1041, 2354, 48, 48);
  doc.setFontSize(pt(16));
  doc.text('Адрес', 1119, 2348, tOptions);
  doc.setTextColor(textColor);
  doc.setFontSize(pt(24));
  doc.text(salesOfficeAddress, 1119, 2372, tOptions);

  doc.addImage(phoneImg, 'png', 1041, 2454, 48, 48);
  doc.setFontSize(pt(16));
  doc.text('Телефон', 1119, 2448, tOptions);
  doc.setFontSize(pt(24));
  doc.text(salesOfficePhones, 1119, 2472, tOptions);

  doc.setFont('OpenSans-Bold', 'bold');
  doc.setFontSize(pt(32));
  doc.text('Своевременно вносите ежемесячные платежи и получите спецпредложение от #банкавто.', 160, 2591, tOptions);

  return doc.output('arraybuffer');
};
