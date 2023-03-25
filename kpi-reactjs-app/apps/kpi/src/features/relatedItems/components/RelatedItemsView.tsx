import React from 'react';
import { WidgetTitle } from 'src/components/WidgetTitle';
import { useTranslation } from 'react-i18next';
import { Card } from 'src/components/Card';
import { getRelatedItemsState } from '../interface';
import { DetailsSkeleton } from 'src/components/DetailsSkeleton';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { Link } from 'src/components/Link';
import { Button } from 'src/components/Button';
import { RelatedItemModal, RelatedItemActions } from './RelatedItemModal';
import { useActions } from 'typeless';
import { RelatedItem } from 'src/types-next';

function getLink(item: RelatedItem) {
  if (item.toObjectType === 'InitiativeItem') {
    return `/initiatives/${item.toObjectId}`;
  }
  return `/scorecards/${item.toObjectType}/${item.toObjectId}`;
}

export const RelatedItemsView = () => {
  const { t } = useTranslation();
  const { isLoaded, items } = getRelatedItemsState.useState();
  const { show: showAdd } = useActions(RelatedItemActions);
  const renderDetails = () => {
    if (!isLoaded) {
      return <DetailsSkeleton />;
    }
    if (!items.length) {
      return <div>{t('No Related Items')}</div>;
    }
    return (
      <div>
        {items.map(item => (
          <div key={item.id}>
            <Link href={getLink(item)}>
              <DisplayTransString value={item.toObjectTitle} />
            </Link>
          </div>
        ))}
      </div>
    );
  };
  return (
    <>
      <RelatedItemModal />
      <Card>
        <WidgetTitle
          buttons={
            <Button small onClick={showAdd}>
              {t('add')}
            </Button>
          }
        >
          {t('Related Items')}
        </WidgetTitle>
        {renderDetails()}
      </Card>
    </>
  );
};
