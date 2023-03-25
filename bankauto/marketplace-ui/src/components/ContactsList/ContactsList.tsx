import React from 'react';
import { managerPhone } from 'helpers/analytics/constants';
import { ReactComponent as PhoneCallIcon } from 'icons/phoneCallRed.svg';
import { ReactComponent as IconWhatsApp } from 'icons/iconWhatsApp.svg';
import { useBreakpoints } from '@marketplace/ui-kit';
import { ContactsItem } from '../ContactsItem';
import { useStyles } from './ContactsList.styles';

const contacts = [
  {
    href: `tel:${managerPhone}`,
    text: 'Телефон менеджера',
    mobileText: 'Связаться с менеджером',
    contactType: managerPhone,
    icon: <PhoneCallIcon width="2rem" height="2rem" viewBox="0 0 32 32" />,
  },
  {
    href: 'https://wa.me/79651207365',
    text: 'Онлайн',
    contactType: 'Консультация',
    icon: <IconWhatsApp width="2rem" height="2rem" viewBox="0 0 32 32" />,
  },
];
export const ContactsList = () => {
  const { isMobile } = useBreakpoints();
  const s = useStyles();
  return (
    <>
      {contacts.map((item) => (
        <div className={s.contactItem} key={item.text}>
          <ContactsItem
            text={isMobile && item.mobileText ? item.mobileText : item.text}
            contactType={item.contactType}
            icon={item.icon}
            link={item.href}
            classNames={{ icon: s.icon }}
          />
        </div>
      ))}
    </>
  );
};
