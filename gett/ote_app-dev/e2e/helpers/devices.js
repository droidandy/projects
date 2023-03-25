export default async function testOnIOS(fn) {
  if (this.getPlatform() === 'ios') {
    await fn();
  } else {
    this.t.pass('Can\'t be tested on Android');
  }
}
