import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { AsyncStorage } from 'react-native';
import { LoaderScreen } from '../components/Loader/Loader';
import { client } from '../configs/apollo';

interface AppContextInterface {
  isAuthorized: boolean;
  logout: () => Promise<void>;
  setToken: (token: string) => Promise<void>;
}

const appContextDefaultValue: AppContextInterface = {
  isAuthorized: false,
  logout: () => {
    console.log('logout default impl');
    return Promise.resolve();
  },
  setToken: (token: string) => {
    console.log('setToken default impl', token);
    return Promise.resolve();
  },
};

const Context = createContext(appContextDefaultValue);

type TSetCtxFunc = Dispatch<SetStateAction<AppContextInterface>>;

const initializeContext = async (setCtx: TSetCtxFunc): Promise<void> => {
  await client.resetStore();
  const savedToken = await AsyncStorage.getItem('@AptStore:auth');
  const isAuthorized = !!savedToken;
  const result = {
    ...appContextDefaultValue,
    isAuthorized,
    logout: async () => {
      try {
        await AsyncStorage.multiRemove(['@AptStore:auth', '@AptStore:city']);
        await client.clearStore();
        setCtx(ctx => ({ ...ctx, isAuthorized: false }));
      } catch (e) {
        console.warn('error in logout', e);
      }
    },
    setToken: async token => {
      try {
        await AsyncStorage.setItem('@AptStore:auth', token);
        setCtx(ctx => ({ ...ctx, isAuthorized: true }));
      } catch (e) {
        console.warn('error saving token:', token, e);
      }
    },
  };
  setCtx(result);
};

type TAuthContextRenderFunc = (props: { isAuthorized: boolean }) => ReactNode;

export const AuthContext = ({ children }: { children?: ReactNode | TAuthContextRenderFunc }) => {
  const [ctx, setCtx] = useState(appContextDefaultValue);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      initializeContext(setCtx)
        .then()
        .catch(console.error)
        .finally(() => {
          setInitialized(true);
        });
    }
  }, [initialized]);

  if (!initialized) {
    return <LoaderScreen label="Инициализация приложения..." />;
  }

  if (typeof children === 'function') {
    return (
      <ApolloProvider client={client}>
        <Context.Provider value={ctx}>
          {children({ isAuthorized: ctx.isAuthorized })}
        </Context.Provider>
      </ApolloProvider>
    );
  }

  return (
    <ApolloProvider client={client}>
      <Context.Provider value={ctx}>{children}</Context.Provider>
    </ApolloProvider>
  );
};

//region hooks
export const useAppContext = () => {
  return useContext(Context);
};

export const useIsAuthorized = () => {
  const { isAuthorized } = useAppContext();
  return isAuthorized;
};

export const useLogout = () => {
  const { logout } = useAppContext();
  return logout;
};

export const useSetToken = () => {
  const { setToken } = useAppContext();
  return setToken;
};
//endregion
