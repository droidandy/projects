import { useNavigation, useRoute } from '@react-navigation/native';
import React, {
  useCallback, useContext, useMemo, useState,
} from 'react';
import { LayoutRectangle, StyleProp, ViewProps } from 'react-native';
import Orientation from 'react-native-orientation';
import {
  VictoryAxis, VictoryCandlestick, VictoryChart, VictoryLine,
} from 'victory-native';

import * as s from './styles';

import * as RootNavigation from '~/app/home/navigation/RootNavigation';
import { Routes } from '~/app/home/navigation/routes';
import { chartGateName } from '~/components/molecules/chart/constants';
import { PeriodSelect } from '~/components/molecules/chart/periodSelect';
import { ChartMode, Period } from '~/components/molecules/chart/types';
import { usePrices } from '~/components/molecules/chart/usePrices';
import { Modals } from '~/constants/modalScreens';
import { PortalContext } from '~/providers/Portal';

const PERIODS_HEIGHT = 50;

type FullscreenPressArguments = {
  period: Period;
  chartMode: ChartMode;
  overlayEnabled: boolean;
};

type Props = {
  companyId: number;
  initialPeriod?: Period;
  initialChartMode?: ChartMode;
  initialOverlayEnabled?: boolean;
  hidePrice?: boolean;
  hidePeriodsPanel?: boolean;
  hideOverlay?: boolean;
  style?: StyleProp<ViewProps>;
  onCloseFullscreen?: (props: FullscreenPressArguments) => void;
};

export const Chart = ({
  companyId,
  initialPeriod = Period.d,
  initialChartMode = ChartMode.line,
  initialOverlayEnabled = false,
  hidePeriodsPanel,
  hideOverlay,
  hidePrice,
  style,
  onCloseFullscreen,
}: Props): JSX.Element => {
  const navigation = useNavigation();
  const route = useRoute();
  const [wrapperSizes, setWrapperSizes] = useState<LayoutRectangle>();
  const periodsPanelHeight = useMemo(
    () => (hidePeriodsPanel ? 0 : PERIODS_HEIGHT),
    [hidePeriodsPanel],
  );
  const overlaySizes = useMemo(() => {
    if (wrapperSizes) {
      return {
        ...wrapperSizes,
        height: wrapperSizes ? wrapperSizes.height - periodsPanelHeight : 0,
      };
    }

    return wrapperSizes;
  }, [wrapperSizes, periodsPanelHeight]);

  const [period, setPeriod] = useState<Period>(initialPeriod);
  const [chartMode, setChartMode] = useState<ChartMode>(initialChartMode);
  const onToggleChartMode = useCallback(() => {
    setChartMode(chartMode === ChartMode.line ? ChartMode.candle : ChartMode.line);
  }, [chartMode]);

  const [overlayEnabled, setOverlayEnabled] = useState(initialOverlayEnabled);
  const onToggleOverlayEnabled = useCallback(() => {
    setOverlayEnabled(!overlayEnabled);
  }, [overlayEnabled]);

  const { teleport } = useContext(PortalContext);

  const onToggleFullscreen = useCallback(() => {
    if (onCloseFullscreen) {
      onCloseFullscreen({ chartMode, period, overlayEnabled });
    } else {
      const backScreen = RootNavigation.getRouteName() as Routes;
      navigation?.navigate(Routes.FullScreen, { activeModal: Modals.Chart });

      Orientation.unlockAllOrientations();
      const onFullscreenPress = ({
        period: newPeriod,
        chartMode: newChartMode,
        overlayEnabled: newOverlayEnabled,
      }: FullscreenPressArguments) => {
        Orientation.lockToPortrait();
        navigation.navigate(backScreen, route.params);
        setPeriod(newPeriod);
        setChartMode(newChartMode);
        setOverlayEnabled(newOverlayEnabled);
      };

      teleport(chartGateName, (
        <Chart
          companyId={companyId}
          initialPeriod={period}
          initialChartMode={chartMode}
          initialOverlayEnabled={overlayEnabled}
          onCloseFullscreen={onFullscreenPress}
        />
      ));
    }
  }, [
    teleport,
    companyId,
    navigation,
    route,
    onCloseFullscreen,
    period,
    chartMode,
    overlayEnabled,
  ]);

  const rawData = usePrices(companyId, period);

  const data = useMemo(() => {
    if (chartMode === ChartMode.candle) {
      const candleData = rawData.map(({
        ts_date,
        price_open,
        price_close,
        price_high,
        price_low,
      }) => ({
        x: new Date(ts_date),
        open: price_open,
        close: price_close,
        high: price_high,
        low: price_low,
      }));

      return candleData;
    }

    const lineData = rawData.map(({ ts_date, price_close }) => ({
      date: new Date(ts_date),
      price: price_close,
    }));
    return lineData;
  }, [chartMode, rawData]);

  const fullscreen = useMemo(() => !!onCloseFullscreen, [onCloseFullscreen]);

  return (
    <s.Wrapper
      fullscreen={fullscreen}
      style={style}
      onLayout={(event) => setWrapperSizes(event.nativeEvent.layout)}
    >
      {wrapperSizes && (
        <>
          {!fullscreen && (
            <s.ChartBackdrop
              height={wrapperSizes.height - periodsPanelHeight}
              width={wrapperSizes.width}
            />
          )}
          <VictoryChart
            height={wrapperSizes.height - periodsPanelHeight}
            width={wrapperSizes.width}
            padding={{
              top: 100,
              bottom: 50,
              left: 0,
              right: 0,
            }}
          >
            {chartMode === ChartMode.line && (
              <VictoryLine
                data={data}
                x="date"
                y="price"
              />
            )}
            {chartMode === ChartMode.candle && (
              <VictoryCandlestick
                data={data}
                candleColors={{
                  positive: '#0F172A',
                  negative: '#BE123C',
                }}
              />
            )}
            <VictoryAxis
              style={{
                axis: { stroke: 'transparent' },
                ticks: { stroke: 'transparent' },
                tickLabels: { fill: 'transparent' },
              }}
            />
          </VictoryChart>
        </>
      )}
      {overlaySizes && !hideOverlay && (
        <s.ChatOverlayWrapper sizes={overlaySizes}>
          {!hidePrice && <s.Price companyId={companyId} />}
          <s.OverlaySwitcher
            enabled={overlayEnabled}
            onToggle={onToggleOverlayEnabled}
          />
          <s.ChartModeSwitcher onToggle={onToggleChartMode} />
          <s.FullscreenSwitcher onToggle={onToggleFullscreen} />
        </s.ChatOverlayWrapper>
      )}
      {!hidePeriodsPanel && (
        <PeriodSelect
          period={period}
          fullscreen={fullscreen}
          height={periodsPanelHeight}
          onSelect={setPeriod}
        />
      )}
    </s.Wrapper>
  );
};
