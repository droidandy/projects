import { VContainer } from '@invest.wl/mobile';
import React from 'react';
import { VLaunch } from '../../component/V.Launch.component';
import { IVLaunchScreenProps } from './V.Launch.types';

export class VLaunchScreen extends React.Component<IVLaunchScreenProps> {
  public render() {
    return (
      <VContainer bg={'transparent'}>
        <VLaunch />
      </VContainer>
    );
  }
}
