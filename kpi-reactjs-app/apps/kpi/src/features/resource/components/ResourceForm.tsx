import React from 'react';
import { useTranslation } from 'react-i18next';
import { SectionTitle } from 'src/components/SectionTitle';
import { Row, Col } from 'src/components/Grid';
import { FormItem } from 'src/components/FormItem';
import { FormInput } from 'src/components/ReduxInput';
import { FormSelect } from 'src/components/FormSelect';
import { ResourceFormProvider } from '../resource-form';
import { useLoadUsers } from 'src/features/referencesNext/hooks';
import { BalancedScorecardItemType } from 'src/types-next';
import { getReferencesNextState } from 'src/features/referencesNext/interface';
import { KPIFormFields } from './KPIFormFields';
import { convertToOption } from 'src/common/utils';
import { TypeField } from './TypeField';
import { getResourceState } from '../interface';
import { ParentField } from './ParentField';
import { getDataSourceState } from 'src/features/dataSource/interface';
import { getGlobalState } from 'src/features/global/interface';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { useLanguage } from 'src/hooks/useLanguage';

interface ResourceFormProps {
  isEditing: boolean;
  isAdding: boolean;
}

export function ResourceForm(props: ResourceFormProps) {
  const { isEditing, isAdding } = props;
  const { t } = useTranslation();
  const { scorecards } = getReferencesNextState.useState();
  const { type } = getDataSourceState.useState();
  const lang = useLanguage();
  useLoadUsers();
  const scoreCardOptions = React.useMemo(() => {
    const items = scorecards.scorecards;
    if (!items) {
      return [];
    }
    const unitScorecards = items.filter(item => !!item.unitId);
    const orgScorecards = items.filter(item => !item.unitId);
    const unitScorecardOptions = {
      label: t('Unit Scorecards'),
      options: unitScorecards.map(convertToOption),
    };
    const orgScorecardOptions = {
      label: t('Organization Scorecards'),
      options: orgScorecards.map(convertToOption),
    };
    return [orgScorecardOptions, unitScorecardOptions];
  }, [scorecards]);
  const { name, parentRequired } = getResourceState.useState();
  const { organizationUnits } = getGlobalState.useState();
  const unitIdOptions = (organizationUnits || []).map(unit => ({
    label: <DisplayTransString value={unit.name} />,
    value: unit.id,
    filterName: unit.name[lang],
  }));

  return (
    <ResourceFormProvider>
      <SectionTitle>{t('Basic Info')}:</SectionTitle>
      <Row>
        <Col>
          <FormItem label="Name" required={isEditing}>
            <FormInput name="name" langSuffix readOnlyText={!isEditing} />
          </FormItem>
        </Col>
        <Col>
          {parentRequired ? (
            <ParentField isEditing={isEditing} isAdding={isAdding} />
          ) : (
            <TypeField isEditing={isEditing} isAdding={isAdding} />
          )}
        </Col>
      </Row>
      {name === 'dataSource' && (
        <Row>
          <Col>
            <FormItem label="Scorecard" required={isEditing}>
              <FormSelect
                isLoading={!scorecards.isLoaded}
                name="scorecard"
                options={scoreCardOptions}
                readOnlyText={!isEditing}
              />
            </FormItem>
          </Col>
          <Col />
        </Row>
      )}
      <FormItem label="Description" required={isEditing}>
        <FormInput
          multiline
          name="description"
          langSuffix
          readOnlyText={!isEditing}
        />
      </FormItem>

      {type === BalancedScorecardItemType.KPI && (
        <KPIFormFields isEditing={isEditing} />
      )}
      <SectionTitle>{t('Responsible Unit')}:</SectionTitle>
      <FormItem label="Responsible Unit" required>
        <FormSelect name="unit" options={unitIdOptions} />
      </FormItem>
    </ResourceFormProvider>
  );
}
