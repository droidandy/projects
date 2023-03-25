import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import ConfigProvider from 'antd/es/config-provider';
import enUS from 'antd/es/locale-provider/en_US';
import SC from 'styled-components';

import 'styles/master.less';

const Container = SC.div`
    padding-bottom: 10px;
`;

const Header = SC.header`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

const queryClient = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
        <ConfigProvider locale={enUS}>
            <Container>
                <Header>
                    <p>
                        Edit <code>src/App.tsx</code> and save to reload.
                    </p>
                </Header>
            </Container>
        </ConfigProvider>
        <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
