import { GraphQLResolveInfo } from 'graphql';
import { RequestId, ResolverData } from '../utils/middlewares/request-id';

describe('RequestId', () => {
  it('will set requestId to context', async () => {
    const context: ResolverData = {context: {}, info: {} as GraphQLResolveInfo, args: {}, root: {}};
    const fnMock = jest.fn();
    await RequestId(context, fnMock);
    expect(context.context.requestId).toEqual(expect.any(String));
    expect(context.context.requestId.length).toBeGreaterThan(0);
    expect(fnMock).toBeCalled();
  });
});
