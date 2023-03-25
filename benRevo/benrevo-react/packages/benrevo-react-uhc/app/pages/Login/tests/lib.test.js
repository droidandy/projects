import {
  createLock,
  createNonce,
  randomLength,
  createAndShow,
} from '@benrevo/benrevo-react-core';

describe('Login lib createAndShow', () => {
  it('createAndShow', () => {
    expect(typeof createLock('path')).toEqual('object');
  });
  it('createAndShow', () => {
    expect(typeof createNonce()).toEqual('string');
  });
  it('createAndShow', () => {
    expect(typeof randomLength()).toEqual('number');
  });
  it('createAndShow defined', () => {
    expect(createAndShow).toBeDefined();
  });
});
