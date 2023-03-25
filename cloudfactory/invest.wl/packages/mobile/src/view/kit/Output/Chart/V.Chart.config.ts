import { IVChartLayout } from '@invest.wl/view';
import { PixelRatio, Platform, processColor } from 'react-native';
import { IChart, ILineDataSetConfig, IScatterDataSetConfig, IVisibleRange } from 'react-native-charts-wrapper';

export const isAndroid = Platform.OS === 'android';

// TODO: refact to not static?
export class VChartMobileConfig {
  public static px2dp = (size: number) => isAndroid ? size * PixelRatio.get() : size;
  public static dp2px = (size: number) => isAndroid ? size / PixelRatio.get() : size;

  public static layout: IVChartLayout = {
    top: VChartMobileConfig.px2dp(10),
    bottom: VChartMobileConfig.px2dp(20),
    left: VChartMobileConfig.px2dp(0),
    right: VChartMobileConfig.px2dp(0),
  };

  public static description = { text: '' };

  public static legend = { enabled: false };

  public static lineConfigBase: ILineDataSetConfig = {
    lineWidth: 2,
    drawValues: false,
    drawCircles: false,
    highlightEnabled: true,
    highlightColor: processColor('transparent') as number,
    mode: 'HORIZONTAL_BEZIER',
    drawCubicIntensity: 0.1,
    axisDependency: 'RIGHT',
  };

  public static scatterConfigBase: IScatterDataSetConfig = {
    drawValues: false,
    scatterShape: 'CIRCLE',
    scatterShapeSize: VChartMobileConfig.px2dp(20),
    scatterShapeHoleRadius: 5,
    highlightEnabled: false,
    axisDependency: 'RIGHT',
  };

  public static marker: IChart['marker'] = {
    enabled: true,
    markerType: 'custom',
  };

  public static visibleRange: IVisibleRange = { x: { min: 2 } };
}


