import test from 'tape-async';
import prometheus from '../prometheus';

test.onFailure(async () => {
  await prometheus.cleanup();
});

export default function tape(name, callback) {
  return test(name, async (t) => {
    try {
      const driver = await prometheus.init(t);
      process.env.TEST_NAME = name;
      await callback(t, driver);
    } catch (error) {
      t.fail(error);
    }
  });
}
