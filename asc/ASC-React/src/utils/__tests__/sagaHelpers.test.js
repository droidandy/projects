import { delay } from 'redux-saga';
import { call } from 'redux-saga/effects';
import { retry } from '../sagaHelpers';

const retryTest = retry({ delay: 1000, attempt: 2 });
const mockFn = jest.fn();

test('retry', () => {
  expect(typeof retryTest).toBe('function');
});

test('retry generator success flow', () => {
  const generator = retryTest(mockFn, 'foo', 'baz');

  expect(generator.next().value).toEqual(call(mockFn, 'foo', 'baz'));
});

test('retry generator failure flow', () => {
  const err = { message: 'foo' };

  try {
    const generator = retryTest(mockFn, 'foo', 'baz');

    expect(generator.next().value).toEqual(call(mockFn, 'foo', 'baz'));
    expect(generator.throw(err).value).toEqual(call(delay, 1000));
    expect(generator.throw(err).value).toEqual(call(delay, 1000));
  } catch (error) {
    expect(error).toEqual(err);
  }
});
