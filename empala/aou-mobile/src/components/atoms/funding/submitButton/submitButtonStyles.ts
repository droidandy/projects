import { ViewStyle } from 'react-native';
import styled from 'styled-components/native';

export const ContinueContainer = styled.View({
  flex: 1,
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginHorizontal: 20,
  marginBottom: 40,
});

export const Continue = styled.TouchableOpacity((props) => ({
  backgroundColor: (props.style as ViewStyle).backgroundColor?.toString(),
  width: '90%',
  borderRadius: 6,
}));

export const ContinueText = styled.Text({
  fontSize: 18,
  fontWeight: 800,
  color: '#243841',
  margin: 15,
  textAlign: 'center',
});
