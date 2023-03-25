import styled from 'styled-components/native';

export const Container = styled.View({
  justifyContent: 'center',
  marginHorizontal: 20,
});

export const BankAccountItem = styled.TouchableOpacity({
  paddingVertical: 20,
  fontWeight: 500,
  fontSize: 24,
});

export const BankDetails = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

export const BankLogo = styled.Image({
  width: 48,
  height: 48,
});

export const BankName = styled.Text({
  marginLeft: 20,
});

export const Amount = styled.Text({
  marginTop: 10,
});
