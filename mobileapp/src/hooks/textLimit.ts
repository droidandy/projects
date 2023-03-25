import useDimensions from './dimensions';
import { useEffect, useState } from 'react';

interface TBreakpoints {
  /**
   * Количество символов на экране меньше 350px
   */
  xs: number;

  /**
   * Количество символов на экране меньше 400px
   */
  sm: number;

  /**
   * Количество символов на экране меньше 800px
   */
  md: number;

  /**
   * Количество символов на экране меньше 1200px
   */
  lg: number;

  /**
   * Количество символов на больших экранах
   */
  xl: number;
}

/**
 * Обрезает текст в зависимости от размеров экрана устройства
 *
 * @param {string} text - обрезаемый текст
 * @param {TBreakpoints} breakpoints - точки переключения, по которым будет производиться обрезка
 * текста.
 *
 * @returns {string} обрезанный текст
 */
export const useTextLimit = (text: string, breakpoints: TBreakpoints): string => {
  const [limitedText, setLimitedText] = useState<string>(text);
  const dimensions = useDimensions();

  useEffect(() => {
    const lengthFactor = dimensions.window.width / dimensions.window.fontScale;
    let screenType: keyof TBreakpoints;

    if (lengthFactor < 350) {
      screenType = 'xs';
    } else if (lengthFactor < 400) {
      screenType = 'sm';
    } else if (lengthFactor < 800) {
      screenType = 'md';
    } else if (lengthFactor < 1200) {
      screenType = 'lg';
    } else {
      screenType = 'xl';
    }

    const lengthLimit = breakpoints[screenType];

    setLimitedText(text.length < lengthLimit ? text : text.substring(0, lengthLimit - 3) + '...');
  }, [text, dimensions, breakpoints]);

  return limitedText;
};
