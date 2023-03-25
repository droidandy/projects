import * as React from 'react';
import { VButtonBase } from './base/V.ButtonBase.component';
import { VButtonClose } from './ButtonClose';
import { VButtonSetting } from './ButtonSetting';
import { IVButtonProps } from './V.Button.types';

export class VButton {
  public static Close = VButtonClose;
  public static Fill = (props: IVButtonProps) => <VButtonBase {...props} />;
  public static Stroke = (props: IVButtonProps) => <VButtonBase coloring={{ border: true, text: true }} {...props} />;
  public static Text = (props: IVButtonProps) => <VButtonBase coloring={{ text: true }} {...props} />;
  public static Setting = VButtonSetting;
}
