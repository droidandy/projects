import React from 'react';
import { VContainer } from '@invest.wl/mobile/src/view/kit';
import { IVLaunchScreenProps } from './V.Launch.types';
import { VLaunch } from '../../component/V.Launch.component';


export class VLaunchScreen extends React.Component<IVLaunchScreenProps> {
  public render() {
    return (
      <VContainer bg={'transparent'}>
        <VLaunch />
      </VContainer>
    );
  }
}
