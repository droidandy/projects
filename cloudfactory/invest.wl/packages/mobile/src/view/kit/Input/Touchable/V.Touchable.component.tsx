import { VTouchableResponder } from './util/V.TouchableResponder.component';
import { VTouchableHighlight } from './V.TouchableHighlight.component';
import { VTouchableOpacity } from './V.TouchableOpacity.component';
import { VTouchableWithoutFeedback } from './V.TouchableWithoutFeedback.component';

export class VTouchable {
  public static Highlight = VTouchableHighlight;
  public static Opacity = VTouchableOpacity;
  public static WithoutFeedback = VTouchableWithoutFeedback;

  // util
  public static Responder = VTouchableResponder;
}
