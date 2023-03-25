import { AppLoading } from 'expo';
import React, { useState } from 'react';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { fetchFonts } from './helpers/fonts';
import { AuthorizedRoutes } from './AuthorizedRoutes';
import { UnauthorizedRoutes } from './UnauthorizedRoutes';
import { AuthContext } from './contexts/auth-context';

//region HACK: 💪🏻 Prevent "Expo pasted from CoreSimulator" notification from spamming continuously
import { Clipboard, Modal } from 'react-native';
import { CommonDataProvider, usePhoto } from './contexts/common-data-provider';
import ImageViewer from 'react-native-image-zoom-viewer';

if (__DEV__) {
  Clipboard.setString('');
}
//endregion

const App = () => {
  const [initialized, setInitialized] = useState(false);

  if (!initialized) {
    return <AppLoading startAsync={fetchFonts} onFinish={() => setInitialized(true)} />;
  }

  return (
    <ActionSheetProvider>
      <AuthContext>
        {({ isAuthorized }) => {
          return !isAuthorized ? (
            <UnauthorizedRoutes />
          ) : (
            <CommonDataProvider key="common-data-provider">
              <ImageViewerModal />
              <AuthorizedRoutes />
            </CommonDataProvider>
          );
        }}
      </AuthContext>
    </ActionSheetProvider>
  );
};

export default App;

const ImageViewerModal = () => {
  const { photo, setPhoto } = usePhoto();
  const visible = !!photo.trim();
  return (
    <Modal visible={visible} transparent={true}>
      <ImageViewer
        imageUrls={[{ url: photo }]}
        onClick={() => setPhoto('')}
        onSwipeDown={() => setPhoto('')}
        backgroundColor="#000e"
        enableSwipeDown={true}
        saveToLocalByLongPress={false}
      />
    </Modal>
  );
};
