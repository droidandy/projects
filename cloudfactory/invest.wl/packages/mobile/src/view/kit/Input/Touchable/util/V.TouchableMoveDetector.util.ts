import { IAreaPoint } from '@invest.wl/core';
import { Touchable as ITouchable } from 'react-native';

const TAP_THRESHOLD = 10;
const distance = (a: IAreaPoint, b: IAreaPoint) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

export class VTouchableMoveDetectorUtil {
  private _touchStartLocation?: IAreaPoint;
  public isTouchMoveDetected: boolean = false;
  public touchableEvents: ITouchable = {
    onTouchStart: event => {
      this.isTouchMoveDetected = false;
      this._touchStartLocation = { x: event.nativeEvent.locationX, y: event.nativeEvent.locationY };
    },
    onTouchMove: event => {
      if (!this.isTouchMoveDetected && this._touchStartLocation) {
        const touchEndLocation = { x: event.nativeEvent.locationX, y: event.nativeEvent.locationY };
        const dist = distance(this._touchStartLocation, touchEndLocation);
        this.isTouchMoveDetected = dist > TAP_THRESHOLD;
      }
    },
    onTouchEnd: event => {
      this.isTouchMoveDetected = false;
    },
    onTouchCancel: event => {
      this.isTouchMoveDetected = false;
    },
    onTouchEndCapture: event => {
      this.isTouchMoveDetected = false;
    },
  };
}
