import { IAreaPoint } from '@invest.wl/core';
import { IVFlexProps, themeStyle, VCol } from '@invest.wl/mobile';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { LayoutChangeEvent, LayoutRectangle, Platform, processColor } from 'react-native';
import { IPieChartProps, PieChart as PieChartNative } from 'react-native-charts-wrapper';
import { IVChartPieEventSelect, IVChartPieItem } from './V.ChartPie.types';
import { IVChartPieCursorProps, VChartPieCursor } from './V.ChartPieCursor.component';

export interface IVChartPieProps extends IVFlexProps {
  list: (number | IVChartPieItem)[];
  colorList: string[];
  contentCoef: number;
  selectedShift: number;
  touchEnabled: boolean;
  sliceSpace: number;
  selectedIndex?: number;
  onSelect?(event: IVChartPieEventSelect): void;
}

const COLOR_LIST_DEFAULT = [
  '#CD7147', '#DC9B7D', '#EBC5B4',
  '#F5982E', '#F8B76C', '#FBD5A9',
  '#8BAB63', '#ADC491', '#D0DDBF',
  '#26A6C2', '#66C0D4', '#A6DBE6',
  '#A8A099', '#CBC6C2', '#E1DEDC',
];

@observer
export class VChartPie extends React.Component<IVChartPieProps> {
  public static defaultProps: Partial<IVChartPieProps> = {
    list: [],
    colorList: COLOR_LIST_DEFAULT,
    contentCoef: 0.7,
    touchEnabled: true,
    sliceSpace: 0,
    selectedShift: 5,
  };

  constructor(props: IVChartPieProps) {
    super(props);
    makeObservable(this);
  }

  @observable public layout?: LayoutRectangle;

  @computed
  private get colorList() {
    return this.props.colorList.concat(this.props.colorList, this.props.colorList, this.props.colorList);
  }

  @computed
  public get layoutCenter(): IAreaPoint | undefined {
    if (!this.layout) return;
    const { x, y, width, height } = this.layout;
    return { x: x + (width / 2), y: y + (height / 2) };
  }

  @computed
  private get _contentPosition() {
    if (!this.layout || !this.layoutCenter) return;
    const { height: diameter } = this.layout;
    const { x, y } = this.layoutCenter;
    const cfc = ((diameter / 2) - this.props.selectedShift) * this.props.contentCoef;
    return { left: x - cfc, width: cfc * 2, top: y - cfc, height: cfc * 2, radius: cfc };
  }

  public render() {
    const props = this.props;
    const { list, children, onSelect, ...flexProps } = props;

    return (
      <VCol flex {...flexProps} onLayout={this._onLayout}>
        <PieChartNative style={themeStyle.flex1} {...this._chartProps} onSelect={this._onSelect} />
        {!!children && !!this._contentPosition && (
          <VCol justifyContent={'center'} alignItems={'center'} absolute
            pointerEvents='box-none' {...this._contentPosition}>
            {children}
          </VCol>
        )}
        {!!this._cursorProps && <VChartPieCursor {...this._cursorProps} />}
      </VCol>
    );
  }

  @action
  private _onLayout = (e: LayoutChangeEvent) => this.layout = e.nativeEvent.layout;

  @computed
  private get _chartProps(): IPieChartProps {
    const { list, selectedIndex, touchEnabled, contentCoef, selectedShift, sliceSpace } = this.props;
    const highlights = selectedIndex !== undefined ? [{ x: selectedIndex }] : [];

    return {
      data: {
        dataSets: [{
          values: list,
          label: '',
          config: {
            colors: this.colorList.map(c => processColor(c) as number),
            drawValues: false,
            selectionShift: selectedShift,
            sliceSpace,
          },
        }],
      },
      // @ts-ignore | rotationEnabled ошибочная типизация самого чарта, должно быть boolean
      rotationEnabled: false,
      drawEntryLabels: false,
      highlights,
      touchEnabled,
      legend: { enabled: false },
      chartDescription: { text: '' },
      holeRadius: contentCoef * 100,
      // @ts-ignore
      holeColor: processColor('transparent'),
      transparentCircleRadius: 0,
    };
  }

  private _onSelect = (event: { nativeEvent: IVChartPieEventSelect }) => this.props.onSelect?.(event.nativeEvent);

  // Cursor calc
  @computed
  private get _cursorProps(): Omit<IVChartPieCursorProps, 'height' | 'width'> | undefined {
    const { selectedIndex } = this.props;
    if (!this.layoutCenter || !this.layout || !this._cursorOrbital || selectedIndex == null) return;
    const color = this.colorList[selectedIndex];
    const angle = this._getAngle(selectedIndex);
    const deltaX = this._deltaX(angle);
    const deltaY = this._deltaY(angle);
    return { color, angle, x: this.layoutCenter.x + deltaX, y: this.layoutCenter.y + deltaY };
  }

  @computed
  private get _cursorOrbital() {
    if (!this.layout) return 0;
    const isIOS = Platform.OS === 'ios';
    return this.props.contentCoef * 100 - (isIOS ? 14 : 20);
  }

  @computed
  private get _valueNumberList() {
    return this.props.list.map(i => typeof i === 'number' ? i : i.value || 0);
  }

  @computed
  private get _total(): number {
    return this._valueNumberList.reduce((acc: number, v: number) => acc + v);
  }

  private _getAngle = (index: number) => this._getItemStartAngle(index) + this._getItemCenterAngle(index);

  private _getItemStartAngle = (index: number) => {
    if (this._total === 0) return 0;
    let valueBeforeItem = 0;
    this._valueNumberList.forEach((v, i) => {
      if (i < index) valueBeforeItem += v;
    });

    return 360.0 * valueBeforeItem / this._total;
  };

  private _getItemCenterAngle = (index: number) => {
    if (this._total === 0) return 0;
    const value = this._valueNumberList[index];
    return 360.0 * value / (this._total * 2);
  };

  private _deltaX = (angle: number): number => {
    const rad = (angle - 90) * 2 * Math.PI / 360.0;
    return this._cursorOrbital * Math.cos(rad);
  };

  private _deltaY = (angle: number): number => {
    const rad = (angle - 90) * 2 * Math.PI / 360.0;
    return this._cursorOrbital * Math.sin(rad);
  };
}
