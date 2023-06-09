---
to: src/view/<%= Name %>/screen/V.<%= Name %>Form.screen.tsx
---
import React from 'react';
import { InjectLazy } from '_common/IoC';
import { observer } from 'mobx-react';
import { ID<%= Name %>CaseProps, D<%= Name %>CaseTid, D<%= Name %>Case } from '_domain/<%= Name %>';
import { VStubLoading, VStubError, VStubEmpty } from '_view/_common';

export interface IV<%= Name %>EditScreenProps extends ID<%= Name %>CaseProps { }

@observer
export class V<%= Name %>FormScreen extends React.Component<IV<%= Name %>FormScreenProps> {
  @InjectLazy(D<%= Name %>CaseTid) private _case!: D<%= Name %>Case;

  public render() {
    // if (isLoading) return <VStubLoading />;
    // if (isError) return <VStubError />;
    // if (isEmpty) return <VStubEmpty />;

    return <div><%= Name %> Form Screen</div>;
  }
}
