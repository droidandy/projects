export interface ISClipboardService {
  stringGet(): Promise<string>;
  stringSet(value: string): Promise<void>;
}

export const SClipboardServiceTid = Symbol.for('SClipboardService');
