import util from 'util';
import { Client, ConnectConfig, SFTPWrapper } from 'ssh2';
import pRetry, { FailedAttemptError } from 'p-retry';
import { logger } from './logger';
import config from './config';
import { ISO2YMD } from './utils';
import AError from './a-error';

const connectToSsh = (connectConfig: ConnectConfig): Promise<Client> => new Promise((resolve, reject) => {
  const connection = new Client();
  /* istanbul ignore next */
  connection
    .on('ready', () => {
      resolve(connection);
    })
    .on('error', (err) => {
      err.message = `SSH connection failed with error: ${err.message}`;
      reject(err);
    })
    .connect(connectConfig);
});

export const getFileFromSftp = async (remoteFilePath: string, localFilePath: string):
// eslint-disable-next-line no-async-promise-executor,@typescript-eslint/no-misused-promises
Promise<boolean> => new Promise(async (resolve, reject) => {
  let sshConnection: Client;

  const resume = (err?: any, severity?: number): void => {
    try {
      sshConnection.end();
    } catch (e) { //
    }
    if (!err) {
      return resolve(true);
    }
    return reject(severity ? new AError(err, severity) : err);
  };

  try {
    sshConnection = await connectToSsh(config.apexExtracts.sftp);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const sftpClient: SFTPWrapper = await util.promisify(sshConnection.sftp).bind(sshConnection)();
    sftpClient.fastGet(remoteFilePath, localFilePath, { concurrency: 1 }, (err: Error | any) => {
      if (!err) {
        resume();
        return;
      }
      const msg = `Error download file ${remoteFilePath} over sftp: `;
      /* istanbul ignore next */
      if (err instanceof Error) {
        if (err.message === 'No such file') {
          // Abort retrying if the resource doesn't exist
          resume(new pRetry.AbortError(`No such file: ${remoteFilePath}`));
          return;
        }
        err.message = msg + err.message;
      } else {
        err = new Error(msg + String(err));
      }
      /* istanbul ignore next */
      resume(err, 1);
    });
  } catch (err) {
    resume(err, 1);
  }
});

export const getSODFileName = (reportDate: ISODateString): string => `EXT747_MPLA_${ISO2YMD(reportDate)}.txt`;

export const getRemoteFilePath = (reportDate: ISODateString): string => `/download/${ISO2YMD(reportDate)}/EXT747/${getSODFileName(reportDate)}`;

export const downloadSODFile = async (reportDate: ISODateString): Promise<string> => {
  const startTime = Date.now();

  const localFilePath = getSODFileName(reportDate);
  const remoteFilePath = getRemoteFilePath(reportDate);

  logger.info(`Downloading file: ${remoteFilePath} ...`);
  let isFileDownloaded;
  const getFileWithRetries = async () => {
    isFileDownloaded = await getFileFromSftp(remoteFilePath, localFilePath);
  };
  const retriesOptions = {
    ...config.apexExtracts.sftp.retriesOptions,
    onFailedAttempt: (err: FailedAttemptError) => {
      logger.debug(`SOD file ${remoteFilePath} downloading: attempt ${err.attemptNumber
      } failed. There are ${err.retriesLeft} retries left.`);
    },
  };
  await pRetry(getFileWithRetries, retriesOptions);
  if (isFileDownloaded) {
    logger.info(`File ${remoteFilePath} downloaded from SFTP in [${Date.now() - startTime} ms]`);
    return localFilePath;
  }
  /* istanbul ignore next */
  throw new AError(`failed to download file ${remoteFilePath}`, 1);
};
