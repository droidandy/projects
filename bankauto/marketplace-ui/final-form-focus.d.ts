declare module 'final-form-focus' {
  import { Decorator } from 'final-form';

  export interface FocusableInput {
    name: string;
    focus: () => void;
  }

  export type GetInputs = () => FocusableInput[];

  export type FindInput = (inputs: FocusableInput[], errors: object) => FocusableInput | undefined;

// tslint:disable:no-unnecessary-generics
  export default function createDecorator<FormValues = object>(
    getInputs?: GetInputs,
    findInput?: FindInput,
  ): Decorator<FormValues>;
// tslint:enable:no-unnecessary-generics

  export function getFormInputs(formName: string): GetInputs;
}