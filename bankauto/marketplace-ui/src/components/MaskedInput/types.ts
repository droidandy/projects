export type MaskChar = string | string[] | null;

export type MaskData = { mask: string; maskSymbol: string };

export type InputData = {
  value: string;
  caretPosition: number;
  touched?: boolean;
};

export enum TypeOfProcess {
  TYPING,
  REMOVING,
  REPLACING,
}
