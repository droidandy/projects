import { createContext, useContext } from 'react';

export type ContainerOrientation = 'album' | 'book';

interface LoaderInputConfig {
  accept: string | string[];
  maxSize: number;
  maxFiles: number;
  multiple?: boolean;
}

interface LoaderViewConfig {
  orientation?: ContainerOrientation;
}

export interface LoaderConfigProps extends LoaderInputConfig, LoaderViewConfig {}

const LoaderConfigContext = createContext<LoaderConfigProps>({
  accept: 'image/*',
  maxSize: 33554432,
  maxFiles: 10,
  orientation: 'album',
});
LoaderConfigContext.displayName = 'LoaderConfigContext';

export const LoaderConfigProvider = LoaderConfigContext.Provider;
export const useLoaderConfig = () => useContext(LoaderConfigContext);
