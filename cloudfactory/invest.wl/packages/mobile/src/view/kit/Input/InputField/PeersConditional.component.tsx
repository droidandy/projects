import { ReactUtils } from '@effectivetrade/effective-mobile/src/view/reactUtils/reactUtils.helper';
import * as React from 'react';
import { ViewProps } from 'react-native';

interface Props extends ViewProps {
  peers?: React.ReactNode;
  predicate?: ((e?: React.ReactElement) => boolean) | boolean;
  peerType?: React.ComponentType<any>;
}

/**
 * Рендерит children, если соблюдается условие:
 * - задано свойство peers
 * - в peers найден компонент с типом peerType ИЛИ выполняется условие predicate.
 */
export class PeersConditional extends React.Component<Props> {
  public render() {
    const { peers, predicate, peerType, children } = this.props;
    if (peers && (predicate || peerType)) {
      const p1 = !!predicate && ((c: any) => predicate === true || predicate(c)) || undefined;
      const p2 = !!peerType && ((c: any) => c && c.type === peerType) || undefined;
      const _predicate = (c: any) => (p1 && p1(c)) || (p2 && p2(c));
      const isCustomPresented = ReactUtils.findElement(peers, c => c && !!_predicate(c));
      if (isCustomPresented) {
        return children;
      }
    }

    return null;
  }
}
