import React, { FC, useEffect, useRef, useCallback } from 'react';
import { WrapperLoader } from 'components/WrapperLoader/WrapperLoader'; //TODO: Заменить в модуле
import { Title } from '../components'; //TODO: Заменить в модуле
import { EmptyLIst } from './EmptyLIst';
import { InspectionsListItem } from './InspectionsListItem';
import { useInspectionsContext } from './InspectionsContext';
import { useStyles } from './InspectionsList.styles';

export const InspectionsList: FC = () => {
  const classes = useStyles();
  const {
    state: { loading, items },
    actions: { fetchItems },
  } = useInspectionsContext();
  const initial = useRef(true);

  useEffect(() => {
    fetchItems();
    initial.current = false;
  }, [fetchItems]);

  const getInspections = useCallback(
    () =>
      items.map((item) => (
        <div key={item.id} className={classes.item}>
          <InspectionsListItem data={item} />
        </div>
      )),
    [items],
  );

  return (
    <>
      <Title text="Заявки на осмотр" />
      {!items.length && !loading && !initial.current && <EmptyLIst />}
      <WrapperLoader loading={loading}>
        <div className={classes.list}>{getInspections()}</div>
      </WrapperLoader>
    </>
  );
};
