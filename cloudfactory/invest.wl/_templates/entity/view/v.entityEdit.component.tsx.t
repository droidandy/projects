---
to: src/view/<%= Name %>/component/V.<%= Name %>Form.component.tsx
---
import React from 'react';
import { observer } from 'mobx-react';
import { D<%= Name %>Model } from '_domain/<%= Name %>'

export interface IV<%= Name %>FormProps {
  model?: D<%= Name %>Model;
}

@observer
export class V<%= Name %>Edit extends React.Component<IV<%= Name %>FormProps> {
  public render() {
    const { model } = this.props;

    return <div><%= Name %> {model ? 'Edit' : 'Create'}</div>;
  }
}
