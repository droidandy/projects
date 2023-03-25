import * as React from 'react';
import styled from 'styled-components';
import { getGlobalState, GlobalActions } from 'src/features/global/interface';
import { useActions } from 'typeless';
import { rtlRight } from 'shared/rtl';
import { Trans } from 'react-i18next';

const Wrapper = styled.div`
  position: absolute;
  top: 40px;
  ${rtlRight('40px')}
  z-index: 10000;
`;

interface NotificationProps {
  type: 'error' | 'success';
}

const Notification = styled.div<NotificationProps>`
  min-width: 300px;
  padding: 1rem 2rem;
  border-radius: 3px;
  ${props =>
    props.type === 'error' &&
    `
    background: #fd397a;
    color: #ffffff;`}
  ${props =>
    props.type === 'success' &&
    `
    background: #0abb87;
    color: #ffffff;`}
`;

export function Notifications() {
  const { notifications } = getGlobalState.useState();
  const { removeNotification } = useActions(GlobalActions);

  return (
    <Wrapper>
      {notifications.map(item => (
        <Notification
          key={item.id}
          type={item.type}
          onClick={() => {
            removeNotification(item.id);
          }}
        >
          <Trans>{item.text}</Trans>
        </Notification>
      ))}
    </Wrapper>
  );
}
