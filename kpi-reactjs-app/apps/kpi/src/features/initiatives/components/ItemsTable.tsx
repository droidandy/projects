import * as React from 'react';
import styled from 'styled-components';
import { Card } from 'src/components/Card';
import { Button } from 'src/components/Button';
import { useTranslation } from 'react-i18next';
import { getInitiativesState } from '../interface';
import { Table, Th, Td } from 'src/components/Table';
import { formatDate } from 'src/common/utils';
import { ItemModal, ItemActions } from './ItemModal';
import { useActions } from 'typeless';
import { Link } from 'src/components/Link';

interface ItemsTableProps {
  className?: string;
  currencySymbol: string;
}

const Title = styled.div`
  font-size: 1.1rem;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const _ItemsTable = (props: ItemsTableProps) => {
  const { className, currencySymbol } = props;
  const { t } = useTranslation();
  const { items: allItems, initiativeId } = getInitiativesState.useState();
  const { show } = useActions(ItemActions);
  const items = React.useMemo(() => {
    return allItems.filter(x => x.initiativeItemId === initiativeId);
  }, [allItems, initiativeId]);
  return (
    <>
      <ItemModal />
      <Card className={className}>
        <Top>
          <Title>{t('Status Update')}</Title>
          <Button small onClick={() => show(null)}>
            {t('Add update')}
          </Button>
        </Top>

        <Table>
          <thead>
            <tr>
              <Th>{t('Date')}</Th>
              <Th>{t('Percent Complete')}</Th>
              <Th>{t('Budget Spent To Date')}</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <Td>{formatDate(item.date, false)}</Td>
                <Td>{item.progressPercentage}%</Td>
                <Td>
                  {currencySymbol} {item.budgetSpent}
                </Td>
                <td>
                  <Link onClick={() => show(item)}>{t('Edit')}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </>
  );
};

export const ItemsTable = styled(_ItemsTable)`
  display: block;
`;
