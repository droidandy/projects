import { IconBodyType, IconWrench, IconShieldCheck, IconClipboardText, IconShield, IconTimer } from 'icons/inspections';
import { Chip } from 'containers/PersonalArea/components';
import { INSPECTION_STATUS } from 'types/Inspection';

export const INSPECTION_CHIP_RECORD: Record<INSPECTION_STATUS, Chip[]> = {
  [INSPECTION_STATUS.NEW]: [{ text: 'Ожидает оплаты', bgcolor: 'warning.main' }],
  [INSPECTION_STATUS.PAID]: [
    { text: 'Оплачена', bgcolor: 'success.main' },
    { text: 'ожидает осмотра', bgcolor: 'warning.main' },
  ],
  [INSPECTION_STATUS.CANCELED]: [{ text: 'Отменена заказчиком', bgcolor: 'warning.dark' }],
  [INSPECTION_STATUS.FAILED]: [{ text: 'Отменена продавцом', bgcolor: 'warning.dark' }],
  [INSPECTION_STATUS.SUCCEEDED]: [{ text: 'Осмотр завершен', bgcolor: 'success.main' }],
  [INSPECTION_STATUS.REDEEMED]: [{ text: 'Денежные средства возвращены', bgcolor: 'primary.main' }],
};

export const INFO_DATA = [
  {
    icon: <IconBodyType />,
    title: 'Кузов',
    text: 'Оценит состояние кузова и зафиксирует все дефекты — следы ремонта, ржавчину \n' + 'и повреждения на краске.',
  },
  {
    icon: <IconWrench />,
    title: 'Техническое состояние',
    text: 'Проверит работу всех важных систем и узлов автомобиля, его ходовые качества.',
  },
  {
    icon: <IconShieldCheck />,
    title: 'Юридическая чистота',
    text: 'Изучит историю машины — пробег, записи о ремонтах и ДТП, данные о залогах и юридических ограничениях.',
  },
];

export const INSPECTIONS_RESULTS = [
  {
    icon: <IconClipboardText />,
    title: 'Детальный отчет',
    text: 'Эксперт даст комплексный отчет о состоянии автомобиля по 124 пунктам, отправит его на почту, WhatsApp или Telegram. Он также оценит критичность найденных недостатков и приложит фотографии, чтобы вы все могли увидеть сами.',
  },
  {
    icon: <IconShield />,
    title: 'Финансовые гарантии',
    text: 'Мы вернем деньги, если автомобиль найдет владельца до осмотра или продавец откажется показывать машину. Вы платите только за готовый отчет.',
  },
  {
    icon: <IconTimer />,
    title: 'Экономия времени и средств',
    text: 'Вы экономите время на звонках и осмотрах. Вовремя замеченные проблемы защитят от проблем в будущем.',
  },
];
