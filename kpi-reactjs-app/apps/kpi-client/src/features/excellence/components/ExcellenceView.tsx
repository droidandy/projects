import React from 'react';
import * as R from 'remeda';
import { getExcellenceState, ExcellenceActions } from '../interface';
import { useTranslation } from 'react-i18next';
import { TableView } from 'src/components/TableView';
import { ExcellenceTableColumns } from './ExcellenceTableColumns';
import { UnitAccordion } from 'src/components/UnitAccordion';
import { ExcellenceRow } from './ExcellenceRow';
import { ExcellenceFilter } from './ExcellenceFilter';
import { CommentsSidePanel } from 'src/features/comments/components/CommentsSidePanel';
import { AttachmentsSidePanel } from 'src/features/attachments/components/AttachmentsSidePanel';
import { useActions } from 'typeless';
import { FilterToggle } from 'src/components/FilterToggle';
import styled from 'styled-components';
import { Button } from 'src/components/Button';

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  > ${Button} {
    margin-left: 30px;
  }
`;

export const ExcellenceView = () => {
  const { t } = useTranslation();
  const {
    items,
    isLoading,
    filter,
    isFilterExpanded,
  } = getExcellenceState.useState();
  const { setIsFilterExpanded } = useActions(ExcellenceActions);
  const groups = React.useMemo(() => {
    return R.pipe(
      items,
      R.filter(item => {
        if (filter.status.length) {
          return filter.status.some(status => item.calcStatus === status);
        } else {
          return true;
        }
      }),
      R.groupBy(x => x.responsibleUnitId),
      x => Object.values(x)
    );
  }, [items, filter]);
  return (
    <>
      <CommentsSidePanel />
      <AttachmentsSidePanel />
      <TableView
        title={t('Excellence Requirements')}
        titleAppend={
          <TitleWrapper>
            <Button href="/create-excellence" styling="primary">
              + {t('Create New Excellence')}
            </Button>
            <FilterToggle
              isFilterExpanded={isFilterExpanded}
              setIsFilterExpanded={setIsFilterExpanded}
            />
          </TitleWrapper>
        }
        header={
          <>
            <ExcellenceFilter />
            <ExcellenceTableColumns />
          </>
        }
        isLoading={isLoading}
      >
        {groups.map(group => (
          <UnitAccordion
            unit={group[0].responsibleUnit}
            key={group[0].responsibleUnit.id}
          >
            {group.map(item => (
              <ExcellenceRow key={item.id} item={item} />
            ))}
          </UnitAccordion>
        ))}
      </TableView>
    </>
  );
};
