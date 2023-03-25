import { TVThemeColorValue } from '@invest.wl/view';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

export interface IVChartPieCursorProps {
  angle: number;
  color: TVThemeColorValue;
  x: number;
  y: number;
  width: number;
  height: number;
}

export class VChartPieCursor extends React.PureComponent<IVChartPieCursorProps> {
  public static defaultProps = {
    width: 10,
    height: 5,
  };

  public render() {
    const { color, angle, x, y, width, height } = this.props;

    return (
      <View
        style={[this._SS.container, {
          top: y - (height / 2), left: x - (width / 2), borderBottomColor: color, transform: [{ rotate: `${angle}deg` }],
        }]} />
    );
  }

  private get _SS() {
    const { height, width } = this.props;
    return StyleSheet.create({
      container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        width: 0,
        height: 0,
        borderTopWidth: 0,
        borderTopColor: 'transparent',
        borderLeftWidth: width / 2,
        borderLeftColor: 'transparent',
        borderRightWidth: width / 2,
        borderRightColor: 'transparent',
        borderBottomWidth: height,
        position: 'absolute',
        borderStyle: 'solid',
      },
    });
  }
}


