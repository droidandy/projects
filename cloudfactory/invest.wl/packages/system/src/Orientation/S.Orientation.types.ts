export enum ESOrientationType {
  Portrait = 'PORTRAIT',
  LandscapeLeft = 'LANDSCAPE_LEFT',
  LandscapeRight = 'LANDSCAPE_RIGHT',
}

export const SOrientationStoreTid = Symbol.for('SOrientationStoreTid');

export interface ISOrientationStore {
  readonly appOrientation: ESOrientationType;
  readonly isLandscape: boolean;
  lockToPortrait(): void;
  unlockAllOrientations(): void;
}
