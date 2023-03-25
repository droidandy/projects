import { AsyncAction } from 'types/AsyncAction';
import { getQrCode } from 'api/application/getQrCode';
import { actions } from './reducers';

function getSimpleOuterQrCode(qrCodeUrl: string, params: string): AsyncAction {
  return async function (dispatch) {
    try {
      const { data } = await getQrCode(`${qrCodeUrl}/certificate/download/simple?${params}`);
      dispatch(actions.setQrCodeUrl(data));
    } catch (err) {
      dispatch(actions.setError(err));
    }
  };
}

export { getSimpleOuterQrCode };
