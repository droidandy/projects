import styled from 'styled-components/native';

export const Container = styled.KeyboardAvoidingView({
  flex: 1,
});

export const Content = styled.View({
  flex: 1,
  justifyContent: 'center',
  marginHorizontal: 20,
});

export const Amount = styled.View({
  flex: 2,
  justifyContent: 'center',
  marginHorizontal: 20,
});

export const Title = styled.Text({
  fontWeight: 500,
  fontSize: 24,
});

export const Input = styled.TextInput({
  height: 40,
  marginVertical: 12,
  borderWidth: 1,
  borderRadius: 4,
  borderColor: '#8692a6',
});
