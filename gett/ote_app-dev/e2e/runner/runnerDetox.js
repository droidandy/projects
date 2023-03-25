import tape from 'tape';
import detox from 'detox';
import fs from 'fs';
import pkg from '../../package.json';
import runTestSuite from '../suite';
import createReporter from '../reporter';

import { clearScreenshots } from '../helpers/screenshotsUtils';

const reporter = createReporter((res) => {
  // generate json
  const jsonFile = 'tests_log.json';
  fs.writeFileSync(jsonFile, JSON.stringify(res, null, 2));

  // generate html or something else
});

function waitTapeFinish() {
  return new Promise(resolve => tape.onFinish(resolve));
}

export default async function runnerDetox() {
  process.on('SIGINT', async () => {
    await detox.cleanup();
    process.exit(0);
  });

  await detox.init(pkg.detox, { launchApp: false });

  clearScreenshots();

  await device.launchApp({
    permissions: {
      notifications: 'YES',
      location: 'always'
    }
  });

  tape.createStream()
    .pipe(reporter)
    .pipe(process.stdout);

  runTestSuite();

  await waitTapeFinish();

  await detox.cleanup();

  process.exit(0);
}
