import styled from 'styled-components/native';

import layout from '~/constants/Layout';

const PADDING = 16;
const CIRCLE_SIZE = 6;
const CIRCLE_MARGIN = 8;

export const MainContainer = styled.View({
  position: 'absolute',
  width: layout.width - PADDING * 2 - CIRCLE_SIZE - CIRCLE_MARGIN,
  height: CIRCLE_SIZE,
  top: 52,
  left: PADDING,
  right: PADDING,
  flexDirection: 'row',
  alignItems: 'center',
});

export const StepsContainer = styled.View({
  height: 2,
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginLeft: 8
});

export const ItemContainer = styled.View({
  flex: 1,
  flexDirection: 'row',
  height: 2,
});

export const Dash = styled.View((props: { active: boolean }) => ({
  flex: 48,
  height: 2,
  borderRadius: 2,
  opacity: props.active ? 0.8 : 0.3,
  backgroundColor: 'white',
}));

export const Margin = styled.View({
  flex: 8,
  color: 'transparent',
});
