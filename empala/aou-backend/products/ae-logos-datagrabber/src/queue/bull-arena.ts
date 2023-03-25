import Arena from 'bull-arena';
import { Queue } from 'bullmq';
import config from 'config';
import { logger } from '../lib/logger';
import { connection, AEApiRequestQueue } from './queue';

const { host, port } = config.get('bullmq.arena');

const arenaApp = Arena(
  {
    BullMQ: Queue,
    queues: [
      {
        type: 'bullmq',
        // Name of the bullmq queue, this name must match up exactly with what you've defined in bullmq.
        name: AEApiRequestQueue.name,
        // Hostname or queue prefix, you can put whatever you want.
        hostId: 'ae-logos-datagrabber',
        redis: connection,
      },
    ],
  },
  {
    host,
    port,
    // Make the arena dashboard become available at {my-site.com}/arena.
    basePath: '/arena',
    // Let express handle the listening.
    disableListen: true,
  },
) as any;

arenaApp.listen(port, host, () => {
  logger.info(`Arena is running on port ${port} at host ${host}`);
});

export default arenaApp;
