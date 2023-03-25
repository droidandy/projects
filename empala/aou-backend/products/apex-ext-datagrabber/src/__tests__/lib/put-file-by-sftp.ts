import util from 'util';
import { Client, ConnectConfig, SFTPWrapper } from 'ssh2';
import config from '../../lib/config';
import { logger } from '../../lib/logger';

const exists = (sftp: SFTPWrapper, dir: string) => new Promise(resolve => sftp.exists(dir, resolve));

const mkdir = async (sftp: SFTPWrapper, dir: string) => {
  if (!(await exists(sftp, dir))) {
    await util.promisify(sftp.mkdir).bind(sftp)(dir);
  }
};

const createFolders = async (sftp: SFTPWrapper, targetPath: string) => {
  const folders = targetPath.split(/[\\/]/).filter(v => v.trim() && v.trim() !== '.');
  let createdPath = '.';
  for (const folder of folders) {
    createdPath += `/${folder}`;
    await mkdir(sftp, createdPath);
  }
};

export const putFile = async (fileContent: string, targetFilePath: string): Promise<boolean> => {
  const client = new Client();
  const { host, port, username } = config.apexExtracts.sftp;
  const connectConfig: ConnectConfig = { ...config.apexExtracts.sftp, readyTimeout: 15_000 };
  logger.debug(`SFTP: Connecting to ${username}@${host}:${port} ...`);

  return new Promise(async (resolve, reject) => {
    const resume = (err: any, result?: boolean) => {
      try {
        client.end();
      } catch (e) { //
      }
      if (err) {
        return reject(err);
      }
      resolve(result);
    };

    try {
      client
        .on('ready', async () => {
          client.sftp(async (err: any, sftp: SFTPWrapper) => {
            if (err) {
              return resume(err);
            }
            const targetDir = targetFilePath.replace(/^(.+)\/[^\/]+$/, '$1');
            try {
              await createFolders(sftp, targetDir);
              logger.silly(`SFTP: Successfully created directory ${targetDir}`);
            } catch (error) {
              return resume(error);
            }
            const fileStream = sftp.createWriteStream(targetFilePath);
            fileStream.write(fileContent);
            fileStream.end();
            logger.info(`SFTP: Successfully uploaded file ${targetFilePath}`);
            fileStream.on('error', (error: any) => {
              logger.error(error);
              resume(error);
            });
            fileStream.on('close', () => {
              client.end();
              resume(null, true);
            });
          });
        })
        .on('error', err => {
          err.message = `SSH connection failed with error: ${err.message}`;
          resume(err);
        })
        .connect(connectConfig);
    } catch (err) {
      resume(err);
    }
  });
};

