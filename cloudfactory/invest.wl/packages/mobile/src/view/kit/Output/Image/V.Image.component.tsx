import hoistNonReactStatics from 'hoist-non-react-statics';
import isFunction from 'lodash/isFunction';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image as RNImage, ImageBackground, ImageLoadEventData, ImageProps, LayoutChangeEvent, NativeSyntheticEvent } from 'react-native';
import { ReactEntity } from '../../../types/react.types';
import { flexView, IFlexProps } from '../../Layout/Flex/V.Flex.util';

interface ImageState {
  readonly isLoading: boolean;
}

interface ImageSize {
  width: number;
  height: number;
}

interface Props extends Omit<ImageProps, 'source' | 'height' | 'width'>, Omit<IFlexProps, 'height' | 'width'> {
  children?: React.ReactNode | ((state: ImageState) => React.ReactNode);
  height?: number | string;
  width?: number | string;
  onAutoHeight?: (size: ImageSize) => void;
  onLoading?: (loading: boolean) => void;
  source: ImageProps['source'] | string;
}

@flexView()
@observer
export class VImage extends React.Component<Props> {
  @observable private _isLoading = false;
  private _imageViewWidth = 0;
  private _imageLoadEventData?: ImageLoadEventData;
  private _autoHeightValue?: number;

  constructor(props: Props) {
    super(props);
    makeObservable(this);
  }

  @computed
  private get source(): ImageProps['source'] {
    const { source } = this.props;
    return typeof source === 'string' ? { uri: source } : source;
  }

  public render() {
    const { style, flex, onLoadStart, onLoadEnd, children, onAutoHeight, source, ...props } = this.props;
    const ImageComponent: ReactEntity = this._children !== undefined ? ImageBackground : RNImage;
    const ahProps: Partial<ImageProps> = !onAutoHeight ? {} : {
      onLayout: this._imageOnLayout,
      onLoad: this._imageOnLoadEnd,
    };

    return (
      <ImageComponent
        style={style}
        onLoadStart={this._onLoadStart}
        onLoadEnd={this._onLoadEnd}
        source={this.source}
        {...ahProps}
        {...props}>
        {this._children}
      </ImageComponent>
    );
  }

  @computed
  private get _state(): ImageState {
    return { isLoading: this._isLoading };
  }

  @computed
  private get _children() {
    const children = this.props.children;
    if (children && isFunction(children)) {
      return (children as any)(this._state);
    }

    return children;
  }

  @action.bound
  private _onLoadStart() {
    this._isLoading = true;
    this.props.onLoadStart?.();
    this.props.onLoading?.(this._isLoading);
  }

  @action.bound
  private _onLoadEnd() {
    this._isLoading = false;
    this.props.onLoadEnd?.();
    this.props.onLoading?.(this._isLoading);
  }

  @action.bound
  private _imageOnLayout(event: LayoutChangeEvent) {
    this._imageViewWidth = event.nativeEvent.layout.width;
    this.props.onLayout?.(event);
    this._updateAutoHeightValue();
  }

  @action.bound
  private _imageOnLoadEnd(event: NativeSyntheticEvent<ImageLoadEventData>) {
    this._imageLoadEventData = event.nativeEvent;
    this.props.onLoad?.(event);
    this._updateAutoHeightValue();
  }

  private _updateAutoHeightValue() {
    let value;
    if (this._imageViewWidth && this._imageLoadEventData && this._imageLoadEventData.source.width) {
      value = this._imageViewWidth / this._imageLoadEventData.source.width * this._imageLoadEventData.source.height;
    }

    if (this._autoHeightValue !== value) {
      this._autoHeightValue = value;
      this.props.onAutoHeight?.({ width: this._autoHeightValue || 0, height: value || 0 });
    }
  }
}

hoistNonReactStatics(VImage, RNImage);
