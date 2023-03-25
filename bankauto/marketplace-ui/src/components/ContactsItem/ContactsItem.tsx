import React, { FC } from 'react';
import { OmniLink, Typography } from '@marketplace/ui-kit';
import cx from 'classnames';
import { useStyles } from './ContactsItem.styles';

type Classes = {
  root?: string;
  icon?: string;
  textBlock?: string;
};

interface ContactsItemProps {
  icon: React.ReactNode;
  text: string;
  contactType: string | number;
  link: string;
  classNames?: Classes;
}

export const ContactsItem: FC<ContactsItemProps> = ({ icon, text, contactType, link, classNames }) => {
  const s = useStyles();
  return (
    <OmniLink href={link} className={s.link}>
      <div className={cx(s.itemContainer, classNames?.root)}>
        {icon}
        <div className={cx(s.infoContainer, classNames?.textBlock)}>
          <Typography style={{ fontSize: '0.75rem' }} color="textSecondary">
            {text}
          </Typography>
          <Typography variant="body1" color="textPrimary">
            {contactType}
          </Typography>
        </div>
      </div>
    </OmniLink>
  );
};
