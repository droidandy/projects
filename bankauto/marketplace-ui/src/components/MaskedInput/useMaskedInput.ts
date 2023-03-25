import { useState } from 'react';
import { getDataAfterRemoving, getDataAfterReplacing, getDataAfterTyping } from './process';
import { InputData, MaskData, TypeOfProcess } from './types';

const PROCESS_MAP = {
  [TypeOfProcess.TYPING]: getDataAfterTyping,
  [TypeOfProcess.REMOVING]: getDataAfterRemoving,
  [TypeOfProcess.REPLACING]: getDataAfterReplacing,
};

const useMaskedInput = (value: string, maskData: MaskData) => {
  const [inputData, setInputData] = useState<InputData>({ value: value ?? '', caretPosition: 0, touched: false });

  const getInputData = (typeOfProcess: TypeOfProcess) => {
    return PROCESS_MAP[typeOfProcess](inputData, maskData);
  };

  return {
    inputData,
    setInputData,
    getInputData,
  };
};

export { useMaskedInput };
