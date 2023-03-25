import * as React from 'react';
import styled from 'styled-components';
import { TreeItem } from 'src/components/TreeItem';
import { Button } from 'src/components/Button';
import { useTranslation } from 'react-i18next';
import { getStrategicMapsState, StrategicMapsActions } from '../interface';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { getStrategicMapFormState } from '../strategicMap-form';
import { useActions } from 'typeless';

interface StrategicMapsSidebarProps {
  className?: string;
}

const List = styled.div`
  margin-top: 20px;
`;

const _StrategicMapsSidebar = (props: StrategicMapsSidebarProps) => {
  const { className } = props;
  const { t } = useTranslation();
  const {
    strategicMaps,
    selected,
    isAddNew,
  } = getStrategicMapsState.useState();
  const { values } = getStrategicMapFormState.useState();
  const { addNew, selectStrategicMap } = useActions(StrategicMapsActions);
  return (
    <div className={className}>
      <Button block disabled={isAddNew} onClick={addNew}>
        {t('Add new strategic map')}
      </Button>
      <List>
        {isAddNew && (
          <TreeItem depth={0} active clickable>
            <DisplayTransString
              value={{
                en: values.title_en || t('New Strategic Map'),
                ar: values.title_ar || t('New Strategic Map'),
              }}
            />
          </TreeItem>
        )}
        {strategicMaps.map(item => (
          <TreeItem
            key={item.id}
            depth={0}
            active={!isAddNew && selected === item}
            clickable
            onClick={() => selectStrategicMap(item)}
          >
            <DisplayTransString value={item.title} />
          </TreeItem>
        ))}
      </List>
    </div>
  );
};

export const StrategicMapsSidebar = styled(_StrategicMapsSidebar)`
  height: 100%;
  padding: 15px 5px;
  background: white;
  text-align: center;
`;
