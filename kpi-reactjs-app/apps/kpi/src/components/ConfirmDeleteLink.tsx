import React from 'react';
import { Popconfirm } from './Popconfirm';
import { useTranslation } from 'react-i18next';
import { Link } from './Link';

interface ConfirmDeleteLinkProps {
  onYes: () => any;
}

export function ConfirmDeleteLink(props: ConfirmDeleteLinkProps) {
  const { t } = useTranslation();
  return (
    <Popconfirm text="Are you sure to delete?" {...props}>
      <Link>{t('Delete')}</Link>
    </Popconfirm>
  );
}
