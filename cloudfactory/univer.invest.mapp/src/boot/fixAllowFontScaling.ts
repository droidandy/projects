// не разрешает масштабировать текст на iOS
import { Text, TextInput } from 'react-native';

export function fixAllowFontScaling() {
  if (!(Text as any).defaultProps) {
    (Text as any).defaultProps = {};
  }
  (Text as any).defaultProps.allowFontScaling = false;

  if (!(TextInput as any).defaultProps) {
    (TextInput as any).defaultProps = {};
  }
  (TextInput as any).defaultProps.allowFontScaling = false;
}
