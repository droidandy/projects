import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, ImageRequireSource, ImageStyle, ImageURISource, StyleSheet } from 'react-native';
import imageCacheHoc from 'react-native-image-cache-hoc';

type BgImageName = 'intro' | 'login';

interface Props {
  name: BgImageName;
  image?: ImageURISource | ImageURISource[] | ImageRequireSource;
  style?: ImageStyle;
  onLoadEnd?: () => void;
  onLoadError?: (err: any) => void;
}

const CacheableImage = imageCacheHoc(Image, {
  fileDirName: 'background',
});

@observer
export class VImageBackground extends React.Component<Props> {
  @observable private hasError: boolean = false;

  constructor(props: Props) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const { props } = this;
    const uri = props.image && (props.image as any).uri;
    const isValidUrl = this._isUriValid(uri);
    // TODO: refact
    const defaultImage = undefined as any;

    if (props.image && isValidUrl && !this.hasError) {
      return (
        <CacheableImage
          permanent={true}
          onLoadEnd={props.onLoadEnd}
          onError={this._handleImageLoadError}
          source={{ uri }}
          style={[SS.image, props.style]}
          resizeMode='cover' />
      );
    } else {
      return (
        <Image onLoadEnd={props.onLoadEnd} onError={props.onLoadError} source={defaultImage}
          style={[SS.image, props.style]} resizeMode='cover' />
      );
    }
  }

  @action
  private _handleImageLoadError = (error: { nativeEvent: any }) => {
    this.hasError = true;
    this.props.onLoadError?.(error);
  };

  private _isUriValid(uri?: string) {
    if (!uri) return false;
    if (!uri.trim().startsWith('https://')) return false;
    return !uri.includes(' ');
  }
}

const SS = StyleSheet.create({
  image: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    width: undefined,
    height: undefined,
    zIndex: -1,
  },
});
