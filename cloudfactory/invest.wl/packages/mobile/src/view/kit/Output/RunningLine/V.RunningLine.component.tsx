import * as React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import MarqueeText from 'react-native-marquee';

// Логика работы бегущей строки:
// 1. При открытии экрана с бегущей строкой сразу начинается движение строки слева-направо.
// 2. По достижении конца строки пауза 2 секунды
// 3. После паузы в 2 секунды строка возвращается обратно в начало (съезжает справа-налево)
// 4. По достижении начала строки пауза 7 секунд
// 5. После паузы в 3 секунд строка двигается слева-направо

// Известные баги
// https://github.com/facebook/react-native/issues/12057
// Когда бегущая строка выходит за границы своего view

const isRunImmediately = true;
const endDelay = 2000;
const startDelay = 3000;
const duration = 3000;

interface Props {
  style?: StyleProp<TextStyle>;
  duration?: number;
  endDelay?: number;
  startDelay?: number;
}

export class VRunningLine extends React.Component<Props> {
  private _marqueeTextRef!: MarqueeText;

  public componentDidMount() {
    if (isRunImmediately) {
      this._marqueeTextRef.startAnimation();
    }
  }

  public render() {
    const props = this.props;
    return (
      <MarqueeText
        style={props.style}
        ref={(r: MarqueeText) => this._marqueeTextRef = r}
        marqueeOnStart
        loop
        duration={this.props.duration ? this.props.duration : duration}
        marqueeResetDelay={this.props.endDelay ? this.props.endDelay : endDelay}
        marqueeDelay={this.props.startDelay ? this.props.startDelay : startDelay}>
        {props.children as any}
      </MarqueeText>
    );
  }
}
