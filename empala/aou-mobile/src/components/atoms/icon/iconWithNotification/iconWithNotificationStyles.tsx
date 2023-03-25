import styled from 'styled-components/native';

const NOTIFICATION_SIZE = 18;

export const NotificationContainer = styled.View`
  position: absolute;
  top: ${-NOTIFICATION_SIZE / 2 + 2}px;
  right: ${-NOTIFICATION_SIZE / 2 + 2}px;
  width: ${NOTIFICATION_SIZE}px;
  height: ${NOTIFICATION_SIZE}px;
  border-radius: ${NOTIFICATION_SIZE / 2}px;
  background-color: ${({ theme }) => theme.colors.UIErrorDark};
  align-items: center;
  justify-content: center;
`;

export const Notification = styled.Text`
  font-weight: bold;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.White};
`;
