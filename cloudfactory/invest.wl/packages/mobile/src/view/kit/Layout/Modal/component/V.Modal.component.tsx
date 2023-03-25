import { Observer } from '@effectivetrade/effective-mobile/src/view/ObserverDecorator/Observer.decorator';
import { ReactUtils } from '@effectivetrade/effective-mobile/src/view/reactUtils/reactUtils.helper';
import { IVModalModel, VModalModel } from '@invest.wl/common';
import { BlurView } from '@react-native-community/blur';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { KeyboardAvoidingView as RNKeyboardAvoidingView, KeyboardAvoidingViewProps, Platform, StyleSheet } from 'react-native';
import { ReactNativeModal } from 'react-native-modal';
import { VButton } from '../../../Input/Button/V.Button.component';
import { VTouchable } from '../../../Input/Touchable/V.Touchable.component';
import { VModalPortal } from '../V.Modal.portal';
import { IVModalInternalProps } from '../V.Modal.types';

export interface IVModalProps<T = any> extends IVModalInternalProps<T> {
  readonly model?: IVModalModel<T, IVModalProps<T>>;
}

@observer
export class VModal<T = any> extends React.Component<IVModalProps<T>> {
  public static KeyboardAvoidingView = (_: KeyboardAvoidingViewProps) => null;

  public static defaultProps: Partial<IVModalProps<any>> = {
    useNativeDriver: true,
    hideModalContentWhileAnimating: true,
    // Ранее был включен, поэтому включен и тут, чтобы не переделывать существующие диалоги
    avoidKeyboard: true,
    // Используем такие параметры, при которых не используется нативный RN Modal
    coverScreen: false,
  };

  // модалка хотябы частично видима, с начала анимаци открытия до конца анимации закрытия
  @observable private _isShowing = false;

  @computed
  private get _props() {
    const { onModalHide, onModalWillShow, ...props } = this.props;
    return { onModalHide: this._onModalHide, onModalWillShow: this._onModalWillShow, ...props };
  }

  @observable.ref private _model!: IVModalModel<T, IVModalProps<T>>;

  constructor(props: IVModalProps<T>) {
    super(props);
    makeObservable(this);
    if (this.props.model) this._model = this.props.model;
    else if (!this._model) this._model = new VModalModel<T, IVModalProps<T>>();
    this._model.setProps(() => this._props);
  }

  public componentWillUnmount() {
    this._model.setProps(undefined);
  }

  public render() {
    // чтобы порядок модалок менялся согластно выставлению isVisible, нужно рендерить ModalPortal.Site только
    // тогда когда isVisible=true. При этом нужно подождать анимацию закрытия модалки, чтобы она резко не исчезала.
    if (!this._isNeedRenderSite) return null;
    const { children, avoidKeyboard, ...props } = this._props;

    const isAvoidKeyboard = avoidKeyboard || !!this._propsInner.keyboardAvoidingView;
    const KeyboardAvoidingView = this._renderKeyboardAvoidingView;

    return (
      <VModalPortal.Site>
        <ReactNativeModal avoidKeyboard={false}
          onSwipeComplete={this._model.props.onClose}
          animationIn={'slideInUp'} animationOut={'slideOutDown'}
          animationOutTiming={props.animationDuration} animationInTiming={props.animationDuration}
          customBackdrop={this._customBackdrop}
          {...props} {...this._model.props}>
          {props.showCloseButton && <VButton.Close alignSelf={'flex-end'} onPress={this._model.props.onClose} />}
          {!isAvoidKeyboard ? (children) : (<KeyboardAvoidingView>{children}</KeyboardAvoidingView>)}
        </ReactNativeModal>
      </VModalPortal.Site>
    );
  }

  @computed
  private get _customBackdrop() {
    return (
      <VTouchable.Opacity flex onPress={this._model.props.onClose}>
        <BlurView style={SS.customBackdrop} blurType={'dark'} blurAmount={1} />
        {/* <VNotificationList /> */}
      </VTouchable.Opacity>
    );
  };

  @computed
  private get _isNeedRenderSite() {
    const isVisible = !!this.props.model?.isVisible || this.props.isVisible;
    return isVisible || this._isShowing;
  }

  @action.bound
  private _onModalWillShow() {
    this._isShowing = true;
    this.props.onModalWillShow?.();
  }

  @action.bound
  private _onModalHide() {
    this._isShowing = false;
    this.props.onModalHide?.();
  }

  @computed
  private get _propsInner() {
    let keyboardAvoidingView: Parameters<typeof VModal.KeyboardAvoidingView>[0] | undefined;
    for (const el of ReactUtils.filterElements(this.props.children)) {
      if (el.type === VModal.KeyboardAvoidingView) keyboardAvoidingView = el.props;
    }
    return { keyboardAvoidingView };
  }

  @Observer()
  private _renderKeyboardAvoidingView(props: { children?: React.ReactNode }) {
    // KeyboardAvoidingView реализован отдельно, так как калечный react-native-modal его не добавляет при coverScreen=false
    // ⚠️ Если нужно будет поправить отступ контента, рассмотреть возможность использования Content, но не копипастить!
    return (
      <RNKeyboardAvoidingView
        style={[SS.keyboardAvoidingView, this.props.style]}
        pointerEvents={'box-none'}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        {...this._propsInner.keyboardAvoidingView}>
        {props.children}
      </RNKeyboardAvoidingView>
    );
  }
}

const SS = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    // Такой layout по-умолчанию для всей модалки, поэтому тут повторяется
    justifyContent: 'center',
  },
  customBackdrop: {
    flex: 1,
  },
});

