import { AVAILABLE_SYMBOL_REGEXP } from './constants';
import { convertMaskToArray, isWrongChar } from './helpers';
import { InputData, MaskData } from './types';

type ProcessedData = InputData | null;

const getDataAfterTyping =
  (prevInputData: InputData, maskData: MaskData) =>
  (input: HTMLInputElement): ProcessedData => {
    if (input.selectionStart === null) {
      return null;
    }

    const maskChars = convertMaskToArray(maskData.mask);
    const newInputValue = prevInputData.value
      .split('')
      .map((char, index) => {
        if (char === maskData.maskSymbol && !isWrongChar(input.value[index], maskChars[index])) {
          return input.value[index];
        }

        return char;
      })
      .join('');

    return {
      value: newInputValue,
      caretPosition: newInputValue.indexOf(maskData.maskSymbol),
      touched: true,
    };
  };

const getDataAfterRemoving =
  (inputData: InputData, maskData: MaskData) =>
  (input: HTMLInputElement): ProcessedData => {
    if (input.selectionStart === null) {
      return null;
    }

    const chars = inputData.value.split('');

    for (let i = input.selectionStart; i < input.selectionStart + inputData.value.length - input.value.length; i++) {
      if (chars[i].match(AVAILABLE_SYMBOL_REGEXP)) {
        chars[i] = maskData.maskSymbol;
      }
    }

    return { value: chars.join(''), caretPosition: input.selectionStart, touched: true };
  };

const getDataAfterReplacing =
  (inputData: InputData, maskData: MaskData) =>
  (input: HTMLInputElement): ProcessedData => {
    if (input.selectionStart === null) {
      return null;
    }

    const maskChars = convertMaskToArray(maskData.mask);
    const typedCharacterIndex = input.selectionStart - 1;
    const typedCharacter = input.value[typedCharacterIndex];
    const wrongChar = typedCharacter ? isWrongChar(typedCharacter, maskChars[typedCharacterIndex]) : true;

    if (wrongChar) {
      return { ...inputData, caretPosition: input.selectionStart };
    }

    return null;
    // return { ...inputData, value: input.value, caretPosition: input.selectionStart };
  };

export { getDataAfterTyping, getDataAfterRemoving, getDataAfterReplacing };
