import * as React from 'react';
import styled from 'styled-components';
import { NoDataPlaceholder } from 'src/components/NoDataPlaceholder';
import { useTranslation } from 'react-i18next';
import { Lookup } from 'src/types';
import { AddRootItemButton } from './AddRootItemButton';
import { AddInlineType } from './AddInlineType';

interface NoItemsViewProps {
  className?: string;
}

const AddWrapper = styled.div`
  width: 100%;
`;

const _NoItemsView = (props: NoItemsViewProps) => {
  const { className } = props;
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = React.useState<Lookup | null>(null);
  return (
    <div className={className}>
      <NoDataPlaceholder>{t('You have no strategic items!')}</NoDataPlaceholder>

      {selectedType ? (
        <AddWrapper>
          <AddInlineType
            types={[]}
            preselectedType={selectedType}
            parent={null}
            onDone={() => setSelectedType(null)}
          />
        </AddWrapper>
      ) : (
        <AddRootItemButton setSelectedType={setSelectedType} />
      )}
    </div>
  );
};

export const NoItemsView = styled(_NoItemsView)`
  display: flex;
  margin-top: 90px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${AddRootItemButton} {
    margin-top: 40px;
  }
`;
