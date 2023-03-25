export const SKeyboardStoreTid = Symbol.for('SKeyboardStoreTid');

export interface ISKeyboardStore {
  readonly willShow: boolean;
  readonly didShow: boolean;
  init(): Promise<void>;
  dismiss(): void;
}
