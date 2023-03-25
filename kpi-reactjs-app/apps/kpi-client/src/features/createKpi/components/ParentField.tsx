import React from 'react';
import { FormSelect } from 'src/components/FormSelect';
import { convertToOption } from 'src/common/utils';
import { useTranslation } from 'react-i18next';
import { useLanguage } from 'src/hooks/useLanguage';
import { getCreateKpiState } from '../interface';

export function ParentField() {
  const { t } = useTranslation();
  const lang = useLanguage();
  const { scorecards } = getCreateKpiState.useState();
  const options = React.useMemo(() => {
    if (!scorecards) {
      return [];
    }
    return scorecards.map(scorecard => ({
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
    <FormSelect
      name="parent"
      options={options}
      isLoading={scorecards === null}
    />
  );
}
