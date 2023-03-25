---
to: src/view/<%= Name %>/screen/V.<%= Name %>List.screen.tsx
---
import React from 'react';
import { InjectLazy } from '_common/IoC';
import { observer } from 'mobx-react';
import { ID<%= Name %>ListCaseProps, D<%= Name %>ListCaseTid, D<%= Name %>ListCase } from '_domain/<%= Name %>';
import { VStubLoading, VStubError, VStubEmpty } from '_view/_common';

export interface IV<%= Name %>ListScreenProps extends ID<%= Name %>ListCaseProps { }

@observer
export class V<%= Name %>ListScreen extends React.Component<IV<%= Name %>ListScreenProps> {
  @InjectLazy(D<%= Name %>ListCaseTid) private _case!: D<%= Name %>ListCase;

  public render() {
    // if (isLoading) return <VStubLoading />;
    // if (isError) return <VStubError />;
    // if (isEmpty) return <VStubEmpty />;

    return <div><%= Name %> List Screen</div>;
  }
}
