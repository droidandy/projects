import { UnreachableCaseError } from 'src/common/helper';
import { ConfigureSymbol } from '../symbol';
import { createModule, useActions } from 'typeless';
import React from 'react';
import { Modal } from 'src/components/Modal';
import { useTranslation } from 'react-i18next';
import { SaveButtons } from 'src/components/SaveButtons';
import { AppStrategicMapColors, AppStrategicMapColor } from 'src/types-next';
import { DefaultStrategicMapColorMap } from 'src/const';
import { ColorPicker } from 'src/components/ColorPicker';
import styled from 'styled-components';

const colorTypes: AppStrategicMapColor[] = [
  'Container',
  'Link',
  'GenericItem',
  'KPI',
  'Operation',
  'Objective',
  'Goal',
  'DevelopmentGoal',
  'MofaGoal',
  'Enabler',
  'Outcome',
  'Theme',
];

const ColorEntry = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  ${ColorPicker} {
    margin-left: 5px;
  }
`;

const ColorSection = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.div`
  width: 120px;
`;

const Scroll = styled.div`
  max-height: 70vh;
  overflow: auto;
`;

export function ConfigureModal() {
  handle();
  const { isVisible, colors } = getConfigureState.useState();
  const { close, update, submit } = useActions(ConfigureActions);
  const { t } = useTranslation();

  const getText = (key: AppStrategicMapColor) => {
    switch (key) {
      case 'Container':
        return t('Container');
      case 'DevelopmentGoal':
        return t('Development Goal');
      case 'MofaGoal':
        return t('Mofa Goal');
      case 'Goal':
        return t('Goal');
      case 'Enabler':
        return t('Enabler');
      case 'Outcome':
        return t('Outcome');
      case 'Theme':
        return t('Mission');
      case 'Operation':
        return t('Operation');
      case 'Objective':
        return t('Objective');
      case 'KPI':
        return t('KPI');
      case 'GenericItem':
        return t('Generic Item');
      case 'Link':
        return t('Link');
      default:
        throw new UnreachableCaseError(key);
    }
  };

  return (
    <Modal
      size="md"
      isOpen={isVisible}
      title={t('Strategy Map Global Settings')}
      close={close}
    >
      <Scroll>
        {colorTypes.map(type => (
          <ColorSection key={type}>
            <strong>{getText(type)}</strong>
            <ColorEntry>
              <Label>{t('background color')}</Label>
              <ColorPicker
                color={colors[type].background}
                onChange={color => update(type, 'background', color)}
              />
            </ColorEntry>
            <ColorEntry>
              <Label>{t('font color')}</Label>
              <ColorPicker
                color={colors[type].font}
                onChange={color => update(type, 'font', color)}
              />
            </ColorEntry>
          </ColorSection>
        ))}
      </Scroll>
      <SaveButtons onCancel={close} onSave={submit} />
    </Modal>
  );
}

interface ConfigureState {
  isVisible: boolean;
  colors: AppStrategicMapColors;
}

export const [handle, ConfigureActions, getConfigureState] = createModule(
  ConfigureSymbol
)
  .withActions({
    show: (colors: AppStrategicMapColors) => ({
      payload: { colors },
    }),
    updated: (colors: AppStrategicMapColors) => ({
      payload: { colors },
    }),
    close: null,
    submit: null,
    update: (
      type: AppStrategicMapColor,
      colorType: 'font' | 'background',
      color: string
    ) => ({
      payload: {
        type,
        colorType,
        color,
      },
    }),
  })
  .withState<ConfigureState>();

handle.epic().on(ConfigureActions.submit, () => {
  return [
    ConfigureActions.close(),
    ConfigureActions.updated(getConfigureState().colors),
  ];
});

const initialState: ConfigureState = {
  isVisible: false,
  colors: DefaultStrategicMapColorMap,
};

handle
  .reducer(initialState)
  .on(ConfigureActions.show, (state, { colors }) => {
    state.isVisible = true;
    state.colors = colors;
  })
  .on(ConfigureActions.close, state => {
    state.isVisible = false;
  })
  .on(ConfigureActions.update, (state, { color, colorType, type }) => {
    state.colors[type][colorType] = color;
  });
