import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useActions } from 'typeless';
import { NoLabelItem } from 'src/components/NoLabelItem';
import { Table, Th, Td } from 'src/components/Table';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { Link } from 'src/components/Link';
import { ConfirmDeleteLink } from 'src/components/ConfirmDeleteLink';
import { LinkKpiActions } from './LinkKpi';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { getResourceFormState, ResourceFormActions } from '../resource-form';
import { getLinkedKpiProp } from '../utils';

interface LinkKpiTableProps {
  isEditing: boolean;
}
export function LinkKpiTable(props: LinkKpiTableProps) {
  const { isEditing } = props;
  const { values, errors, touched } = getResourceFormState.useState();
  const { t } = useTranslation();
  const { change: changeInfo } = useActions(ResourceFormActions);
  const { show } = useActions(LinkKpiActions);
  const linkedKpis = values.linkedKpis || [];
  const total = React.useMemo(
    () =>
      linkedKpis.reduce(
        (sum, id) => sum + Number(values[getLinkedKpiProp(id, 'weight')]),
        0
      ),
    [linkedKpis, values]
  );

  if (!linkedKpis.length) {
    return null;
  }

  return (
    <NoLabelItem>
      <Table>
        <thead>
          <tr>
            <Th>{t('ID')}</Th>
            <Th>{t('Name')}</Th>
            <Th>{t('Weight')}</Th>
            {isEditing && <Th></Th>}
          </tr>
        </thead>
        <tbody>
          {linkedKpis.map(id => {
            const name = values[getLinkedKpiProp(id, 'name')];
            const weight = values[getLinkedKpiProp(id, 'weight')];
            return (
              <tr key={id}>
                <Td>{id}</Td>
                <Td>
                  <DisplayTransString value={name} />
                </Td>
                <Td>{weight}</Td>
                {isEditing && (
                  <Td>
                    <Link
                      onClick={() =>
                        show({
                          kpi: id,
                          name,
                          weight,
                        })
                      }
                    >
                      {t('View')}
                    </Link>
                    {' | '}
                    <ConfirmDeleteLink
                      onYes={() => {
                        changeInfo(
                          'linkedKpis',
                          linkedKpis.filter(x => x !== id)
                        );
                      }}
                    />
                  </Td>
                )}
              </tr>
            );
          })}
          <tr>
            <Td />
            <Td />
            <Td>
              {t('total')}: {total}%
              {errors.linkedKpis && touched.linkedKpis && (
                <div>
                  <ErrorMessage>{errors.linkedKpis}</ErrorMessage>
                </div>
              )}
            </Td>
            {isEditing && <Td />}
          </tr>
        </tbody>
      </Table>
    </NoLabelItem>
  );
}
