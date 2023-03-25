import React from 'react';
import { useLookupOptions } from 'src/hooks/useLookupOptions';
import { getGlobalState } from 'src/features/global/interface';
import { FormItem } from 'src/components/FormItem';
import { FormSelect } from 'src/components/FormSelect';

interface TypeFieldProps {
  isEditing: boolean;
  isAdding: boolean;
}

export function TypeField(props: TypeFieldProps) {
  const { isEditing, isAdding } = props;
  const { lookups } = getGlobalState.useState();
  const typeOptions = useLookupOptions(lookups, 'BalancedScorecardItemType');
  return (
    <FormItem label="Type" required={isEditing}>
      <FormSelect
        name="type"
        isDisabled={!isAdding}
        options={typeOptions}
        readOnlyText={!isEditing}
      />
    </FormItem>
  );
}
