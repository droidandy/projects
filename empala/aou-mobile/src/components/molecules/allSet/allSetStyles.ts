import styled from 'styled-components/native';

export const Container = styled.KeyboardAvoidingView({
  flex: 1,
});

export const Content = styled.View({
  flex: 1,
  justifyContent: 'center',
  marginHorizontal: 20,
});

export const Content2 = styled.View({
  flex: 2,
  alignItems: 'flex-start',
  justifyContent: 'center',
});

export const Title = styled.Text({
  fontSize: 22,
  fontWeight: 500,
});

export const Amount = styled.Text({
  fontSize: 22,
  fontWeight: 300,
});
