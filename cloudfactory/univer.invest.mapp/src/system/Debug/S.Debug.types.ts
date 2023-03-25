export type TSDebugCommandHandler = () => void;
export type TSDebugCommandRemover = () => void;

export interface ISDebugCommand {
  title: string;
  handler: TSDebugCommandHandler;
}

export const SDebugStoreTid = Symbol.for('SDebugStoreTid');
export const SDebugServiceTid = Symbol.for('SDebugServiceTid');

export interface ISDebugStore {
  readonly commands: ISDebugCommand[];
  add(command: ISDebugCommand): TSDebugCommandRemover;
}
