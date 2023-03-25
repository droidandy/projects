import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';

export const BadgesContainer = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  maxHeight: '100px',
});

export const Title = styled.Text({
  flexGrow: 1,
  fontSize: 13,
  fontWeight: 500,
  color: 'white',
});

export type ItemContainerProps = {
  active: boolean;
};

export const ItemContainer = styled.View<ItemContainerProps>(({ active }) => ({
  flexShrink: 1,
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: 96,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: 'white',
  padding: 8,
  margin: 4,
  backgroundColor: active ? '#0E2D5D4D' : 'transparent',
}));

export const Dash = styled.View({
  width: 6,
  height: 1,
  marginRight: 5,
  opacity: 0.5,
  backgroundColor: 'white',
});

export const Check = styled.View`
  width: 4px;
  height: 7px;
  margin-right: 8px;
  transform: rotate(45deg);
`;

export const CheckmarkPart1 = styled.View({
  position: 'absolute',
  width: 1,
  height: 9,
  backgroundColor: 'white',
  left: 3,
  top: -3,
});

export const CheckmarkPart2 = styled.View({
  position: 'absolute',
  width: 3,
  height: 1,
  backgroundColor: 'white',
  left: 0,
  top: 5,
});
