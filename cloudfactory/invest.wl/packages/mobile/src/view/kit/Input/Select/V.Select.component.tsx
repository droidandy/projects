import { VSelectButton } from './Button';
import { VSelectDate } from './Date';
import { VSelectDropdown } from './Dropdown/V.SelectDropdown.component';
import { VSelectPeriod } from './Period';
import { VSelectRadio, VSelectRadioItem } from './Radio';
import { VSelectTab } from './Tab';
import { VSelectTag } from './Tag';
import { VSelectBase } from './V.SelectBase.component';
import { VSelectBodyScrollable } from './V.SelectBodyScrollable.component';

export class VSelect {
  public static Base = VSelectBase;
  public static BodyScrollable = VSelectBodyScrollable;
  public static Button = VSelectButton;
  public static Date = VSelectDate;
  public static Dropdown = VSelectDropdown;
  public static Period = VSelectPeriod;
  public static Radio = VSelectRadio;
  public static RadioItem = VSelectRadioItem;
  public static Tab = VSelectTab;
  public static Tag = VSelectTag;
}
