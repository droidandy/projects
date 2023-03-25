import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const FS_WIDTH_CFC = 0.7; // коэффициент fontSize по отношению к ширине буквы

export class MeasureUtil {
  public static charWidth(fontSize: number) {
    return fontSize * FS_WIDTH_CFC;
  }

  public static textWidth(text: string, fontSize: number) {
    return text.length * this.charWidth(fontSize);
  }

  public static textWidthInWindowPercent(text: string, fontSize = 14, space = 0) {
    return this.textWidth(text, fontSize) / (width - space);
  }
}
