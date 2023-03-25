import { IDInputModel, IDInputModelProps } from '../D.Input.types';
import { DInputValidator } from '../D.Input.validator';
import { DInputModel } from './D.Input.model';

export interface IDInputCodeModel extends IDInputModel {
  readonly length: number;
}

interface IDInputSmsCodeModelProps extends IDInputModelProps {
  length: number;
}

/**
 * ввод кода (например SMS)
 */

export class DInputCodeModel extends DInputModel implements IDInputCodeModel {
  public length: number;

  constructor(props: IDInputSmsCodeModelProps) {
    super(props);
    this.length = props.length;
    this.errorsSet(() => this.errorsValidator ?? DInputValidator.lengthMin(this.value, this.length));
  }
}
