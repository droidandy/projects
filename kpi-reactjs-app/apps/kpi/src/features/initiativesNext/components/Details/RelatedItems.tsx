import { getInitiativesState } from '../../interface';
import React from 'react';
import { Portlet } from 'src/components/Portlet';
import { useTranslation } from 'react-i18next';
import { RelatedItem } from 'src/types-next';
import { Link } from 'src/components/Link';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { Button } from 'src/components/Button';
import { useActions } from 'typeless';
import { RelatedItemActions } from '../RelatedItemModal';

function getLink(item: RelatedItem) {
  if (item.toObjectType === 'InitiativeItem') {
    return `/initiatives-next/${item.toObjectId}`;
  }
  return `/scorecards/${item.toObjectType}/${item.toObjectId}`;
}

export function RelatedItems() {
  const { relatedItems } = getInitiativesState.useState();
  const { t } = useTranslation();
  const { show: showRelatedItem } = useActions(RelatedItemActions);

  const renderDetails = () => {
    if (!relatedItems.length) {
      return <div>{t('No Related Items')}</div>;
    }
    return (
      <div>
        {relatedItems.map(item => (
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
    <Portlet
      maxHeight
      padding
      title={t('Related Items')}
      buttons={
        <Button small onClick={() => showRelatedItem()}>
          {t('Add')}
        </Button>
      }
    >
      {renderDetails()}
    </Portlet>
  );
}
