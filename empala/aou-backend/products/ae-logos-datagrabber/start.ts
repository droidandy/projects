import './src/init/init';

import { main } from './src/main';

main().then((exitCode) => {
  process.exit(exitCode);
});
