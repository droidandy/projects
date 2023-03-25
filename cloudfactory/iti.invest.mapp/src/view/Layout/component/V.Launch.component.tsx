import React from 'react';
import { VCol, VImage } from '@invest.wl/mobile/src/view/kit';

export class VLaunch extends React.Component {
  public render() {
    return (
      <VCol flex justifyContent={'center'} alignItems={'center'}>
        <VImage
          style={{ width: '75%' }}
          source={require('../assets/logo.png')}
          resizeMode={'contain'} />
      </VCol>
    );
  }
}
