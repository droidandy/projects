import { ReactUtils } from '@effectivetrade/effective-mobile/src/view/reactUtils/reactUtils.helper';
import { memoizeDeep } from '@invest.wl/common';
import { IoC } from '@invest.wl/core';
import { TVThemeSize, VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import isFinite from 'lodash/isFinite';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { FastImageProps } from 'react-native-fast-image';
import { IVFlexProps, VCol } from '../../Layout/Flex';
import { flexView } from '../../Layout/Flex/V.Flex.util';
import { VIcon } from '../Icon';
import { IVIconProps } from '../Icon/V.Icon.types';
import { VImageFast } from '../Image/V.ImageFast.component';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const stub = require('./assets/Nologo.png');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const stubWithBg = require('./assets/Nologo.png');

export interface ThumbnailProps extends IVFlexProps {
  size?: TVThemeSize;
  uri?: string;
  withBg?: boolean;
}

type Props = ThumbnailProps;

@flexView()
@observer
export class VThumbnail extends React.Component<Props> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  // Рендерится только в случае ошибки загрузки картинки, а не во время ее загрузки
  // в случае когда необходимо отобразить иконку вместо дефолтной картинки stub
  public static DefaultIcon = (_: IVIconProps) => null;
  public static Image = (_: FastImageProps) => null;

  @observable private _isError: boolean = false;
  @observable private _isLoading: boolean = true;

  constructor(props: Props) {
    super(props);
    makeObservable(this);
  }

  @computed
  private get style() {
    const { size = 'md', style } = this.props;
    const { sWidth, sRadius } = this.theme.kit.Thumbnail;
    return getStyle(sWidth?.[size], sRadius?.[size], style);
  }

  public render() {
    const { size, style, withBg, uri, ...flexProps } = this.props;
    const stubImage = !this.defaultRender ? (withBg ? stubWithBg : stub) : undefined;

    return (
      <VCol style={this.style.thumbnailContainer} {...flexProps}>
        {this.defaultRender}
        <VCol absoluteFill>
          <VImageFast
            uri={uri} stub={stubImage} style={this.style.image as any} onError={this._onError}
            onLoadEnd={this._onLoadEnd} {...this._props.image} />
        </VCol>
      </VCol>
    );
  }

  @computed
  public get defaultRender() {
    const { sFont } = this.theme.kit.Thumbnail;
    const isShowIcon = !!this._props.defaultIcon?.name;
    const isRenderIcon = isShowIcon && (this._isLoading || this._isError);
    if (!isRenderIcon) return;
    return (
      <VCol absoluteFill centerContent>
        <VIcon fontSize={sFont?.md} {...this._props.defaultIcon!} />
      </VCol>
    );
  }

  @action.bound
  private _onError() {
    this._isError = true;
  }

  @action.bound
  private _onLoadEnd() {
    this._isLoading = false;
  }

  @computed
  private get _props() {
    let defaultIcon: Parameters<typeof VThumbnail.DefaultIcon>[0] | undefined;
    let image: Parameters<typeof VThumbnail.Image>[0] | undefined;
    for (const el of ReactUtils.filterElements(this.props.children)) {
      if (el.type === VThumbnail.DefaultIcon) defaultIcon = el.props;
      if (el.type === VThumbnail.Image) image = el.props;
    }

    return {
      defaultIcon,
      image,
    };
  }
}

const getStyle = memoizeDeep((dimension?: number, radius?: number, style?: StyleProp<ViewStyle>) => {
  dimension = isFinite(dimension) ? dimension : undefined;
  const cSize: ViewStyle = { width: dimension, height: dimension };

  return StyleSheet.create({
    thumbnailContainer: {
      overflow: 'hidden',
      borderRadius: radius,
      ...cSize,
      ...(style ? StyleSheet.flatten(style) : undefined),
    },
    image: {
      flex: 1,
      width: undefined,
      height: undefined,
    },
  });
});
