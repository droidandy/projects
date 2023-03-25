import React from 'react';
import { ReactComponent as IconCreditCard } from 'icons/iconCreditCard2.svg';
import { ReactComponent as IconOnline } from 'icons/iconOnline.svg';
import { ReactComponent as IconCalendarPay } from 'icons/iconCalendarPay.svg';
import { Box } from '@marketplace/ui-kit';
import { InstalmentInfoItem } from '../components/InstalmentInfoItem/InstalmentInfoItem';

const infoData = [
  { text: 'Без первоначального\n взноса', icon: IconCreditCard },
  { text: 'Одобрение\n онлайн', icon: IconOnline },
  { text: 'Фиксированный\n платеж', icon: IconCalendarPay },
];

export const InstalmentInfoContainer = () => {
  return (
    <Box display="flex">
      <Box display="flex" flexDirection="row">
        {infoData.map((item) => (
          <InstalmentInfoItem icon={item.icon} text={item.text} key={item.text} />
        ))}
      </Box>
    </Box>
  );
};
