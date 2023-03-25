import { IVThemeColor, IVThemeFont, IVThemeKit, IVThemeModel, IVThemeModelProps, IVThemeSpace } from '../V.Theme.types';

export class VThemeModel implements IVThemeModel {
  public readonly name: string;
  public readonly color: IVThemeColor;
  public readonly space: IVThemeSpace;
  public readonly font: IVThemeFont;
  public readonly kit: IVThemeKit;

  constructor(props: IVThemeModelProps) {
    this.name = props.name;
    this.color = props.color;
    this.space = props.space;
    this.font = props.font;
    this.kit = props.kit;
  }
}
