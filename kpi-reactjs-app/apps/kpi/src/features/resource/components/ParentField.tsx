import React from 'react';
import { FormItem } from 'src/components/FormItem';
import { FormSelect } from 'src/components/FormSelect';
import { useLoadScorecards } from 'src/features/referencesNext/hooks';
import { getReferencesNextState } from 'src/features/referencesNext/interface';
import { convertToOption } from 'src/common/utils';
import { useTranslation } from 'react-i18next';
import { useLanguage } from 'src/hooks/useLanguage';

interface ParentFieldProps {
  isEditing: boolean;
  isAdding: boolean;
}

export function ParentField(props: ParentFieldProps) {
  const { isEditing } = props;
  useLoadScorecards();
  const { t } = useTranslation();
  const lang = useLanguage();
  const { scorecards } = getReferencesNextState.useState();
  const options = React.useMemo(() => {
    if (!scorecards.scorecards) {
      return [];
    }
    return scorecards.scorecards.map(scorecard => ({
      label: (
        <>
          {`${scorecard.name[lang]} - ${
            scorecard.unitId ? t('Unit Scorecard') : t('Organization Scorecard')
          }`}{' '}
        </>
      ),
      options: [
        {
          label: scorecard.name[lang],
          value: `root_${scorecard.id}`,
        },
        ...scorecard.scorecardItems.map(convertToOption),
      ],
    }));
  }, [scorecards, lang]);
  return (
    <FormItem label="Parent">
      <FormSelect
        name="parent"
        options={options}
        readOnlyText={!isEditing}
        isLoading={scorecards.isLoading}
      />
    </FormItem>
  );
}
