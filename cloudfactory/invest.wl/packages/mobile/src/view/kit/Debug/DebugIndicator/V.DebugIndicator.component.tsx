import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface Props {
  isActive?: boolean;
  style?: StyleProp<ViewStyle>;
}

export class VDebugIndicator extends React.PureComponent<Props> {
  public render() {
    const props = this.props;

    if (!__DEV__) return null;

    return (
      <View style={SS.container}>
        {props.isActive === true || props.isActive === false &&
        <View style={[SS.isActive, props.isActive ? SS.isActiveActive : SS.isActiveInactive]} />}
      </View>
    );
  }
}

const SS = StyleSheet.create({
  container: { position: 'absolute', left: 4, top: 4 },
  isActive: { width: 6, height: 6, backgroundColor: 'green', borderRadius: 3 },
  isActiveActive: { backgroundColor: 'green' },
  isActiveInactive: { backgroundColor: 'red' },
});
