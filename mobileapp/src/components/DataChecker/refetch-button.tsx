import { Button } from '../buttons/Button/Button';
import { styles } from './DataChecker.styles';
import React from 'react';

interface RefetchButtonProps {
  label?: string;

  refetch?(...args: any[]): Promise<any>;
}

export const RefetchButton = ({ label, refetch }: RefetchButtonProps) => {
  if (!refetch) {
    return null;
  }
  return (
    <Button
      key="refetch-button"
      style={styles.refetchButton}
      title={label ? label : 'Попробовать ещё раз'}
      onPress={() => refetch().catch(console.error)}
    />
  );
};
