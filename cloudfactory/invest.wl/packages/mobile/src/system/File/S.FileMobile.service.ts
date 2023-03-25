import { Injectable, IoC, ISErrorHttpDTO } from '@invest.wl/core';
import { ISAuthStore, ISFileService, SAuthStoreTid, SErrorService, SErrorServiceTid } from '@invest.wl/system';
import { PermissionsAndroid, Platform } from 'react-native';
import RNFetchBlob, { FetchBlobResponse, RNFetchBlobConfig } from 'rn-fetch-blob';

const IS_ANDROID = Platform.OS === 'android';
const IS_IOS = Platform.OS === 'ios';

export interface ISFileDownloadProps extends RNFetchBlobConfig {
  cb?(res: FetchBlobResponse): Promise<FetchBlobResponse>;
}

@Injectable()
export class SFileMobileService implements ISFileService {
  private _authStore = IoC.get<ISAuthStore>(SAuthStoreTid);
  private _errorService = IoC.get<SErrorService>(SErrorServiceTid);

  public async download(url: string, props?: ISFileDownloadProps): Promise<any> {
    const token = this._authStore.token;
    const headers = {
      'Authorization': `Bearer ${token}`,
    };
    const { fs } = RNFetchBlob;
    const fileName = url.split('/').pop();
    const downloadDir = IS_ANDROID ? fs.dirs.DownloadDir : fs.dirs.DocumentDir;
    const path = `${downloadDir}/${fileName}`;
    const configDefault: RNFetchBlobConfig = {
      indicator: true, overwrite: true, fileCache: true, timeout: 15000, path,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: fileName,
        description: 'Загрузка файла',
        path,
      },
    };

    try {
      if (await this._requestExternalStoragePermissions()) {
        return RNFetchBlob
          .config({ ...configDefault, ...props })
          .fetch('GET', encodeURI(url), headers)
          .then(res => props?.cb ? props.cb(res) : res)
          .catch(this._errorHandle)
          .finally(() => {
            if (IS_IOS) RNFetchBlob.ios.previewDocument(path);
          });
      }
    } catch (err: any) {
      this._errorHandle(err);
    }
  }

  private _requestExternalStoragePermissions = async () => {
    if (IS_IOS) return true;
    const read = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
    const write = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    return (
      read === PermissionsAndroid.RESULTS.GRANTED &&
      write === PermissionsAndroid.RESULTS.GRANTED
    );
  };

  private _errorHandle = (err: ISErrorHttpDTO) => {
    err.fn = 'Download::pdf';
    err.message = 'Ошибка загрузки документов';
    throw this._errorService.httpHandle(err);
  };
}
