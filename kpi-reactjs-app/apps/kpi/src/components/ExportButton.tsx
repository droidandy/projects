import React from 'react';
import { Trans } from 'react-i18next';
import { Button } from './Button';

interface ExportButtonProps {
  onClick: () => any;
}

export function ExportButton(props: ExportButtonProps) {
  const { onClick } = props;
  return (
    <Button iconSize="lg" onClick={onClick}>
      <i className="flaticon2-download" />
      <Trans>Export</Trans>
    </Button>
  );
}
