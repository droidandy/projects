import { IVMapX, IVMapXList } from '@invest.wl/common';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { VStubEmpty } from './Empty';
import { VStubError } from './Error';
import { VStubLoading } from './Loading';

type IItem = IVMapX<any>;
type IList = IVMapXList<any>;

export interface IVStubProps {
  mapXList: (IItem | IList)[];
  inFocus?: boolean;
  emptySkip?: boolean;
  loading?: React.ReactNode;
  empty?: React.ReactNode;
  error?: React.ReactNode;
  errorIgnore?: boolean;
  emptyIgnore?: boolean;
  children(): React.ReactNode;
}

@observer
export class VStub extends React.Component<IVStubProps> {
  public static Loading = VStubLoading;
  public static Empty = VStubEmpty;
  public static Error = VStubError;

  public static defaultProps = {
    emptySkip: true,
  };

  constructor(props: IVStubProps) {
    super(props);
    makeObservable(this);
  }

  @computed
  private get isLoading() {
    const { mapXList, emptySkip } = this.props;
    // при emptySkip = true, нам всёравно надо дернуть isLoading чтоб запустить процесс загрузки
    return mapXList.some(m => emptySkip ? (m.source.isLoading || true) && !m.source.isLoaded : m.source.isLoading);
  }

  @computed
  private get isError() {
    return this.props.mapXList.some(m => m.source.isError);
  }

  @computed
  private get isEmpty() {
    return !this.props.mapXList.every(m => !!(m as IItem).model || !!(m as IList).list?.length);
  }

  public render() {
    if (this.props.inFocus === false) return null;
    const { children, loading, empty, error, errorIgnore, emptyIgnore } = this.props;
    if (this.isLoading) return loading || <VStubLoading />;
    if (!errorIgnore && this.isError) return error || <VStubError />;
    if (!emptyIgnore && this.isEmpty) return empty || <VStubEmpty />;
    return children();
  }
}
