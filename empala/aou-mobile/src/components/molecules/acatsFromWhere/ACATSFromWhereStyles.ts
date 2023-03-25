import { StyleSheet, ViewStyle } from 'react-native';
import styled from 'styled-components/native';

export const MainContainer = styled.TouchableWithoutFeedback({
  flexGrow: 2,
});

export const ViewForMainContainer = styled.View({
  flexGrow: 2,
});

export const Content = styled.View({
  flex: 1,
  marginLeft: 15,
  marginRight: 15,
});

export const NormalText = styled.Text({
  justifyContent: 'center',
  marginTop: 20,
  marginLeft: 15,
  marginRight: 15,
  marginBottom: 0,
  fontWeight: 300,
  fontSize: 16,
  color: '#243841',
});

export const DropdownItem = styled.Text({
  fontSize: 14,
  paddingTop: 4,
  paddingBottom: 4,
});

export const TopBrokersItem = styled.TouchableOpacity((props) => ({
  height: 50,
  flexGrow: 1,
  marginTop: 10,
  marginRight: (props.style as ViewStyle).marginRight,
  padding: 5,
  borderWidth: StyleSheet.hairlineWidth,
  borderRadius: 5,
  backgroundColor: 'white',
}));

export const TopBrokersLogo = styled.Image({
  width: '100%',
  height: '100%',
});
