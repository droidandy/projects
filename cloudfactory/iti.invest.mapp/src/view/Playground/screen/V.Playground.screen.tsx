import React from 'react';
import { observer } from 'mobx-react';
import { action, computed, makeObservable, observable } from 'mobx';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VButton, VContainer, VContent, VNavBar, VSelect, VStatusBar } from '@invest.wl/mobile/src/view/kit';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VFormatNumber } from '@invest.wl/mobile/src/view/kit/Output/Format/V.FormatNumber.component';

@observer
export class VPlaygroundScreen extends React.Component {
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);

  @observable z = 1;
  @action zz = (v: any) => this.z = v;

  private _data = [
    { name: '111', value: 1 }, { name: '112', value: 2 },
    { name: '113124214123', value: 3 }, { name: '114', value: 4 },
    { name: '115', value: 5 }, { name: '116', value: 6 },
    { name: '117', value: 7 }, { name: '1213131218', value: 8 },
    { name: '119', value: 9 }, { name: '1110', value: 10 },
  ];

  constructor(props: any) {
    super(props);
    makeObservable(this);
  }

  public render() {
    return (
      <VContainer>
        <VStatusBar translucent />
        <VNavBar middleCenter={false}>
          <VNavBar.RightIcon name={'nav-back'} />
        </VNavBar>
        <VContent pa={this._theme.space.lg}>
          {this.contentRender}
        </VContent>
      </VContainer>
    );
  }

  @computed
  private get contentRender() {
    return (
      <>
        <VSelect.Button scrollable selected={this.z} data={this._data}
          onChange={this.zz} />
        <VFormatNumber size={'lg'}>124.32</VFormatNumber>
        <VButton.Stroke onPress={() => this.zz(10)}>test</VButton.Stroke>
      </>
    );
  }
}

