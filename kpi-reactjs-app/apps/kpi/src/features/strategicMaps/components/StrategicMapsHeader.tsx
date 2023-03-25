import * as React from 'react';
import styled from 'styled-components';
import { Button } from 'src/components/Button';
import { useTranslation } from 'react-i18next';
import { Link } from 'src/components/Link';
import { ContainerActions } from './ContainerModal';
import { useActions, useMappedState } from 'typeless';
import { ItemActions } from './ItemModal';
import { getStrategicMapsState, StrategicMapsActions } from '../interface';
import { FormInput } from 'src/components/ReduxInput';
import {
  StrategicMapFormProvider,
  StrategicMapFormActions,
} from '../strategicMap-form';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { TextActions } from './TextModal';
import { ConfigureActions } from './ConfigureModal';

interface StrategicMapsHeaderProps {
  className?: string;
}

const Left = styled.div`
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  padding: 0 20px;
`;
const Right = styled.div`
  margin-left: auto;
  ${Button} + ${Button} {
    margin-left: 10px;
  }
`;

const Actions = styled.div`
  padding: 15px 0;

  a + a {
    margin-left: 20px;
  }
`;

const _StrategicMapsHeader = (props: StrategicMapsHeaderProps) => {
  const { className } = props;
  const { t } = useTranslation();
  const { show: showAddContainer } = useActions(ContainerActions);
  const { show: showAddItem } = useActions(ItemActions);
  const { show: showAddText } = useActions(TextActions);
  const { show: showConfigure } = useActions(ConfigureActions);
  const {
    hasGroups,
    isEditMode,
    canCancel,
    title,
    isSaving,
    colors,
  } = useMappedState([getStrategicMapsState], state => ({
    hasGroups: !!state.groups.length,
    isEditMode: state.isEditMode,
    canCancel: !!state.strategicMaps.length,
    title: state.selected && state.selected.title,
    isSaving: state.isSaving,
    colors: state.colors,
  }));
  const { submit } = useActions(StrategicMapFormActions);
  const { edit, cancel, uploadDocument } = useActions(StrategicMapsActions);
  const [fileKey, setFileKey] = React.useState(1);
  const fileRef = React.useRef(null as HTMLInputElement | null);
  return (
    <div className={className}>
      <input
        ref={fileRef}
        type="file"
        key={fileKey}
        style={{ display: 'none' }}
        onChange={e => {
          const file = e.target.files![0];
          uploadDocument(file)
          setFileKey(fileKey + 1);
        }}
      />
      <StrategicMapFormProvider>
        <Left>
          {isEditMode ? (
            <FormInput
              name="title"
              langSuffix
              placeholder="New Strategic Map"
              required
            />
          ) : (
            <h1>
              <DisplayTransString value={title} />
            </h1>
          )}
          {isEditMode && (
            <Actions>
              <Link onClick={() => showAddContainer(null)}>
                <i className="flaticon2-plus" /> {t('add container')}
              </Link>
              {hasGroups && (
                <Link onClick={showAddItem}>
                  <i className="flaticon-app" /> {t('add item')}
                </Link>
              )}
              <Link
                onClick={() => {
                  fileRef.current!.click();
                }}
              >
                <i className="flaticon2-image-file" /> {t('add image')}
              </Link>
              <Link onClick={() => showAddText(null)}>
                <i className="flaticon2-writing" /> {t('add text')}
              </Link>
              <Link onClick={() => showConfigure(colors)}>
                <i className="flaticon2-gear" /> {t('configure')}
              </Link>
            </Actions>
          )}
        </Left>
        <Right>
          {isEditMode ? (
            <>
              <Button small onClick={submit} loading={isSaving}>
                {t('Save')}
              </Button>
              {canCancel && (
                <Button small styling="secondary" onClick={cancel}>
                  {t('Cancel')}
                </Button>
              )}
            </>
          ) : (
            <Button small onClick={edit}>
              {t('Edit')}
            </Button>
          )}
        </Right>
      </StrategicMapFormProvider>
    </div>
  );
};

export const StrategicMapsHeader = styled(_StrategicMapsHeader)`
  display: flex;
  h1 {
    margin: 0;
    text-align: center;
    width: 100%;
  }
`;
