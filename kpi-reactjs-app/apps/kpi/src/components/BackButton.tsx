import React from 'react';
import { Trans } from 'react-i18next';
import { Button } from './Button';
import { Link } from 'src/components/Link';
import { usePrevLocation } from 'src/hooks/usePrevLocation';

interface BackButtonProps {
  href: string;
}

export function BackButton(props: BackButtonProps) {
  const { href } = props;
  const prevLocation = usePrevLocation(href);
  return (
    <Link href={prevLocation}>
      <Button>
        <i className="flaticon2-back" />
        <Trans>Back</Trans>
      </Button>
    </Link>
  );
}
