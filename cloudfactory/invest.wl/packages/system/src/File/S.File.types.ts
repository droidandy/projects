export const SFileServiceTid = Symbol.for('SFileServiceTid');
export const SFileConfigTid = Symbol.for('SFileConfigTid');

export interface ISFileService {
  download(url: string): Promise<any>;
}

export interface ISFileConfig {
}
