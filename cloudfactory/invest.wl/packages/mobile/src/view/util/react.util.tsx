import { DisposableHolder } from '@invest.wl/common';
import { IVLayoutScreenProps } from '@invest.wl/view';
import { StackScreenProps } from '@react-navigation/stack';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { makeObservable, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

type IReactComponent<P = any> =
  | React.StatelessComponent<P>
  | React.ComponentClass<P>
  | React.ClassicComponentClass<P>;

type Decorator = <T extends IReactComponent>(target: T) => T;

const decorator = (ScreenComponent: IReactComponent): IReactComponent<IVLayoutScreenProps> => {
  @observer
  class HOC extends React.Component<StackScreenProps<any>> {
    @observable private inFocus = false;
    private dh = new DisposableHolder();

    constructor(props: StackScreenProps<any>) {
      super(props);
      makeObservable(this);
    }

    public componentDidMount() {
      if (this.props.navigation) {
        this.dh.push(
          this.props.navigation.addListener('focus', () => {
            runInAction(() => (this.inFocus = true));
          }),
        );
        this.dh.push(
          this.props.navigation.addListener('blur', () => {
            runInAction(() => (this.inFocus = false));
          }),
        );
      }
    }

    public componentWillUnmount() {
      this.dh.dispose();
    }

    public render() {
      const { route, ...rest } = this.props;
      const props = { ...route?.params, ...rest };
      return <ScreenComponent {...props} inFocus={this.inFocus} />;
    }
  }

  hoistNonReactStatics(HOC, ScreenComponent);
  return HOC as IReactComponent;
};

export const mapScreenPropsToProps = decorator as Decorator;
