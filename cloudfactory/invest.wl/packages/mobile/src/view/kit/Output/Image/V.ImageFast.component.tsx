import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, ImageSourcePropType, ImageStyle as RNImageStyle, Platform, StyleProp } from 'react-native';
import FastImageRN, { FastImageProps, ImageStyle, Source } from 'react-native-fast-image';
import { VCol } from '../../Layout/Flex';

const IS_IOS = Platform.OS === 'ios';

export interface IVImageFastProps extends FastImageProps {
  uri?: string;
  // Изображение по умолчанию пока картинка грузится (Для Thumbnail)
  stub?: ImageSourcePropType;
  // Изображение по умолчанию, если изображение не загрузилось (Для BackgroundImage)
  defaultImage?: ImageSourcePropType;
  style?: StyleProp<RNImageStyle & ImageStyle>;
  preload?: boolean;
  onError?: () => void;
}

@observer
export class VImageFast extends React.Component<IVImageFastProps> {
  public static defaultProps: Partial<IVImageFastProps> = {
    resizeMode: 'contain',
  };

  private static _isUriValid(uri?: string) {
    if (!uri) return false;
    if (!uri.trim().startsWith('https://')) return false;
    return !uri.includes(' ');
  }

  @observable private _isImageLoaded = false;
  @observable private _isImageError = false;

  constructor(props: IVImageFastProps) {
    super(props);
    makeObservable(this);
    if (this._isValid && !!this.props.preload) FastImageRN.preload([{ uri: this.props.uri }]);
  }

  public render() {
    const { style, stub, preload, uri, defaultImage, onError, onLoadEnd, source, ...props } = this.props;
    const showImage = (this._isValid || !!source) && !this._isImageError;
    const isShowStubImage = !!stub && !this._isImageLoaded;

    return (
      <>
        {isShowStubImage && (
          <VCol absoluteFill>
            <Image style={style} resizeMode='contain' source={stub as ImageSourcePropType} />
          </VCol>
        )}
        {showImage ? (
          <FastImageRN
            source={this._source as Source}
            onError={this._onErrorImage}
            onLoadEnd={this._onLoadEnd}
            fallback={IS_IOS}
            style={style}
            {...props} />
        ) : !!defaultImage ? (
          <Image
            style={style}
            source={defaultImage}
            resizeMode={props.resizeMode} />
        ) : null}
      </>
    );
  }

  @computed
  private get _source() {
    let uri = this.props.uri;
    const source = this.props.source;

    if (source) {
      if (typeof source === 'number' || (source?.uri && VImageFast._isUriValid(source.uri))) return source;
    }
    if (this._isValid) {
      uri = encodeURI(uri!);
      if (IS_IOS) return { uri, cache: 'force-cache' };
      return { uri, cache: FastImageRN.cacheControl.web };
    }
    return undefined;
  }

  @computed
  private get _isValid() {
    return VImageFast._isUriValid(this.props.uri);
  }

  @action.bound
  private _onErrorImage() {
    this.props.onError?.();
    this._isImageError = true;
  }

  @action.bound
  private _onLoadEnd() {
    this.props.onLoadEnd?.();
    this._isImageLoaded = true;
  }
}
