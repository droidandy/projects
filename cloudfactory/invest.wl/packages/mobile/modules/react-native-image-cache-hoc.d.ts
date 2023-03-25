declare module 'react-native-image-cache-hoc' {
  import * as React from 'react';
  import { ImageProps } from 'react-native';

  interface Options<Props> {
    validProtocols?: string[];
    fileHostWhitelist?: string[];
    cachePruneTriggerLimit?: number;
    fileDirName?: string;
    defaultPlaceholder?: {
      component?: React.ComponentType<Props>;
      props?: Props;
    };
  }

  interface CacheProps extends ImageProps {
    permanent?: boolean;
  }

  type OutputComponent = React.ComponentClass<CacheProps>;

  function imageCacheHoc<Comp extends React.ComponentClass<ImageProps>>(component: Comp, options?: Options<ImageProps>): OutputComponent;

  export default imageCacheHoc;
}
