import { TransString } from 'src/types';
import { useLanguage } from 'src/hooks/useLanguage';
import React from 'react';

interface DisplayTransStringProps {
  value: TransString | null | undefined;
}

export function DisplayTransString(props: DisplayTransStringProps) {
  const { value } = props;
  const lang = useLanguage();
  if (!value) {
    return null;
  }
  if (lang === 'ar') {
    return <>{value.ar}</>;
  }
  return <>{value.en}</>;
}
