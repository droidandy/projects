import { divide } from '@invest.wl/common';
import { IoC } from '@invest.wl/core';
import { IVChartLocation, VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { action, computed, makeObservable, observable } from 'mobx';
import { Observer, observer } from 'mobx-react';
import React from 'react';
import { LayoutChangeEvent, LayoutRectangle, StyleSheet, ViewStyle } from 'react-native';
import { VThemeUtil } from '../../../Theme/V.Theme.util';
import { VCol } from '../../Layout';
import { VText } from '../Text';
import { EVChartMarkerPosition } from './V.Chart.types';

export interface IVChartMarkerProps {
  pointX?: string;
  pointY?: string;
  size: LayoutRectangle;
  location: IVChartLocation;
  position?: EVChartMarkerPosition;
}

@observer
export class VChartMarker extends React.Component<IVChartMarkerProps> {
  public static defaultProps = {
    position: EVChartMarkerPosition.Horizontal,
  };

  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
  @observable private _boxSize?: LayoutRectangle = undefined;

  constructor(props: IVChartMarkerProps) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const { size, location, pointX, pointY, position } = this.props;
    if (!size || !location || !pointX || !pointY) return null;
    const theme = this.theme.kit.Chart.Marker;
    const margin = theme.sMargin?.md || 0;
    const offsetY = theme.offsetY.sMargin?.md || 0;

    const { locationX, locationY } = location;
    const { width: chartWidth, height: chartHeight } = size;

    const isPositionTop = position === EVChartMarkerPosition.Top;
    const isSideRight = locationX < (chartWidth / 2);

    const dashLineHeight = chartHeight - locationY;

    const leftBody = isPositionTop ? locationX - (this._boxWidth / 2) : (
      isSideRight
        ? locationX + this._arrow.width + margin
        : locationX - this._arrow.width - this._boxWidth - margin
    );

    const topBody = isPositionTop ?
      locationY - this._boxHeight - this._circle.radius - offsetY :
      locationY - this._boxHeight / 2;

    const arrowStyle: ViewStyle = {
      borderRightColor: VThemeUtil.colorPick(theme.cBg),
      borderTopWidth: divide(this._arrow.height, 2),
      borderBottomWidth: divide(this._arrow.height, 2),
      borderRightWidth: this._arrow.width,
    };

    return (
      <>
        {/* Calculate marker size */}
        {this.hiddenView}
        {/* Line */}
        <VCol absolute left={locationX - 0.5} top={locationY}>
          <VCol width={theme.line.sWidth?.md} height={dashLineHeight} bg={VThemeUtil.colorPick(theme.line.cBg)} />
        </VCol>
        {/* Circle */}
        <VCol absolute left={locationX - this._circle.radius} top={locationY - this._circle.radius}
          width={this._circle.width} height={this._circle.width}
          radius={this._circle.radius} bg={this._circle.color}
          borderWidth={this._circle.border} borderColor={this._circle.colorBorder}
        />
        {/* Body */}
        <VCol absolute width={this._boxWidth} height={this._boxHeight} left={leftBody} top={topBody}
          bg={VThemeUtil.colorPick(theme.cBg)} radius={theme.sRadius?.md} elevation={25}
        >
          {this._MarkerBox()}
        </VCol>
        {/* Arrow */}
        {!isPositionTop && (
          <VCol absolute width={0} height={0} elevation={25} bg={'transparent'}
            left={isSideRight ? locationX + margin : locationX - this._arrow.width - margin}
            top={locationY - divide(this._arrow.height, 2)}
            style={[SS.arrow, arrowStyle, isSideRight ? undefined : SS.arrowRotated]}
          />
        )}
      </>
    );
  }

  private _MarkerBox = () => (
    <Observer>
      {() => {
        const { pointX, pointY } = this.props;
        const theme = this.theme.kit.Chart.Marker;

        return (
          <VCol flex justifyContent={'center'} padding={theme.sPadding?.md}>
            <VText color={VThemeUtil.colorPick(theme.x.cText)} style={theme.x.fText}>
              {pointX}
            </VText>
            <VText color={VThemeUtil.colorPick(theme.y.cText)} style={theme.y.fText}>
              {pointY}
            </VText>
          </VCol>
        );
      }}
    </Observer>
  );

  @computed
  private get hiddenView() {
    const { pointX, pointY } = this.props;
    const theme = this.theme.kit.Chart.Marker;

    return (
      <VCol style={SS.hiddenView} onLayout={this._layoutBox}>
        <VText style={[theme.x.fText, SS.hiddenText]}>
          {pointX}
        </VText>
        <VText style={[theme.y.fText, SS.hiddenText]}>
          {pointY}
        </VText>
      </VCol>
    );
  }

  @action
  private _layoutBox = (event: LayoutChangeEvent) => {
    this._boxSize = event.nativeEvent.layout;
  };

  @computed
  private get _boxHeight() {
    const theme = this.theme.kit.Chart.Marker;
    return this._boxSize ? this._boxSize.height + 2 * (theme.sPadding?.md ?? 8) : 0;
  }

  @computed
  private get _boxWidth() {
    const theme = this.theme.kit.Chart.Marker;
    return this._boxSize ? this._boxSize.width + 2 * (theme.sPadding?.md ?? 8) : 0;
  }

  @computed
  private get _arrow() {
    const theme = this.theme.kit.Chart.Marker.arrow;
    return {
      height: theme.sHeight?.md || 0,
      width: theme.sWidth?.md || 0,
    };
  }

  @computed
  private get _circle() {
    const theme = this.theme.kit.Chart.Marker.circle;
    return {
      color: VThemeUtil.colorPick(theme.cBg),
      colorBorder: VThemeUtil.colorPick(theme.cBorder),
      width: theme.sWidth?.md || 0,
      radius: divide(theme.sWidth?.md, 2),
      border: theme.sBorder?.md || 0,
    };
  }
}

const SS = StyleSheet.create({
  arrow: {
    borderStyle: 'solid',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  arrowRotated: {
    transform: [{ rotate: '180deg' }],
  },
  hiddenView: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  hiddenText: {
    color: 'transparent',
  },
});
