import { VCol, VImage } from '@invest.wl/mobile';
import React from 'react';

export class VLaunch extends React.Component {
  public render() {
    return (
      <VCol flex justifyContent={'center'} alignItems={'center'}>
        <VImage
          source={require('../assets/logo.png')}
          resizeMode={'contain'} />
      </VCol>
    );
  }
}
