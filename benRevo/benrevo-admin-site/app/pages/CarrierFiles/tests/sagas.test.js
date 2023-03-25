import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import request from 'utils/request';
import * as sagas from '../sagas';
import * as types from '../constants';
import { BENREVO_API_PATH } from '../../../config';

describe('CarrierFiles saga', () => {
  describe('getCarriers', () => {
    const url = `${BENREVO_API_PATH}/admin/carriers/all/`;

    describe('success', () => {
      const it = sagaHelper(sagas.getCarriers());

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.LOAD_CARRIERS_SUCCESS, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.getCarriers());

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.LOAD_CARRIERS_ERROR, payload: new Error('test') }));
      });
    });
  });

  describe('getFiles', () => {
    const action = { payload: { showLoading: 'test' } };

    describe('success with tag all', () => {
      const it = sagaHelper(sagas.getFiles(action));

      const search = { fileName: 'name', tag: 'All' };
      const info = { carrier: { carrierId: 1 } };
      const data = { data: 1 };

      it('selectSearch', (result) => {
        expect(typeof result).toEqual('object');

        return search;
      });

      it('selectInfo', (result) => {
        expect(typeof result).toEqual('object');

        return info;
      });

      it('call api', (result) => {
        const url = `${BENREVO_API_PATH}/admin/documents/search?fileName=${search.fileName}&tag=${search.tag === 'All' ? '' : search.tag}&carrierId=${info.carrier.carrierId}`;

        expect(result).toEqual(call(request, url));

        return data;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.FILES_GET_SUCCESS, payload: { data, showLoading: action.payload.showLoading } }));
      });
    });

    describe('success with custom tag', () => {
      const it = sagaHelper(sagas.getFiles(action));

      const search = { fileName: 'name', tag: 'tag' };
      const info = { carrier: { carrierId: 1 } };
      const data = { data: 1 };

      it('selectSearch', (result) => {
        expect(typeof result).toEqual('object');

        return search;
      });

      it('selectInfo', (result) => {
        expect(typeof result).toEqual('object');

        return info;
      });

      it('call api', (result) => {
        const url = `${BENREVO_API_PATH}/admin/documents/search?fileName=${search.fileName}&tag=${search.tag === 'All' ? '' : search.tag}&carrierId=${info.carrier.carrierId}`;

        expect(result).toEqual(call(request, url));

        return data;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.FILES_GET_SUCCESS, payload: { data, showLoading: action.payload.showLoading } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.getFiles(action));

      const err = new Error('test');

      it('selectSearch', (result) => {
        expect(typeof result).toEqual('object');

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.FILES_GET_ERROR, payload: err }));
      });
    });
  });

  describe('getTags', () => {
    const url = `${BENREVO_API_PATH}/admin/documents/tags`;

    describe('success', () => {
      const it = sagaHelper(sagas.getTags());

      const data = { data: 1 };

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return data;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.TAGS_GET_SUCCESS, payload: data }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.getTags());

      const err = new Error('test');

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.TAGS_GET_ERROR, payload: err }));
      });
    });
  });

  describe('uploadFiles', () => {
    describe('success', () => {
      const it = sagaHelper(sagas.uploadFiles());

      const files = [{ name: 'name' }];
      const tags = [{ id: 1 }];

      it('selectBlobs', (result) => {
        expect(typeof result).toEqual('object');

        return files;
      });

      it('selectTags', (result) => {
        expect(typeof result).toEqual('object');

        return tags;
      });

      it('uploadFile', (result) => {
        expect(result).toEqual(sagas.uploadFile({ file: files[0], tags: tags[0], index: 0 }));
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.UPLOAD_FILES_SUCCESS }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.uploadFiles());

      const err = new Error('test');

      it('selectBlobs', (result) => {
        expect(typeof result).toEqual('object');

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.UPLOAD_FILES_ERROR, payload: err }));
      });
    });
  });

  describe('uploadFile', () => {
    const action = { file: { name: 'test' }, tags: ['tag'], index: 0 };

    describe('success', () => {
      const it = sagaHelper(sagas.uploadFile(action));

      const info = { carrier: { carrierId: 1 } };
      const data = { documentId: 2 };

      it('selectInfo', (result) => {
        expect(typeof result).toEqual('object');

        return info;
      });

      it('call api file', (result) => {
        const url = `${BENREVO_API_PATH}/admin/documents/upload/${info.carrier.carrierId}`;
        const ops = {
          method: 'POST',
        };
        const form = new FormData();
        form.append('file', action.file);
        ops.body = form;

        expect(result).toEqual(call(request, url, ops, true));

        return data;
      });

      it('call api tags', (result) => {
        const url = `${BENREVO_API_PATH}/admin/documents/tags/create?documentId=${data.documentId}&tags=${action.tags.join(',')}`;
        const ops = {
          method: 'POST',
        };

        expect(result).toEqual(call(request, url, ops));
      });

      it('notificationOpts', (result) => {
        expect(typeof result).toEqual('object');
      });

      it('getFiles', (result) => {
        expect(typeof result).toEqual('object');
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.UPLOAD_FILE_SUCCESS, payload: { index: action.index } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.uploadFile(action));

      const err = new Error('test');

      it('selectInfo', (result) => {
        expect(typeof result).toEqual('object');

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.UPLOAD_FILE_ERROR, payload: { error: err, index: action.index } }));
      });
    });
  });

  describe('deleteFile', () => {
    const action = { payload: { fileId: 1 } };
    const url = `${BENREVO_API_PATH}/admin/documents/${action.payload.fileId}`;
    const ops = {
      method: 'DELETE',
    };

    describe('success', () => {
      const it = sagaHelper(sagas.deleteFile(action));

      const data = { data: 1 };

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return data;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.DELETE_FILE_SUCCESS, payload: data }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.deleteFile(action));

      const err = new Error('test');

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.DELETE_FILE_ERROR, payload: err }));
      });
    });
  });

  describe('downloadFile', () => {
    const action = { payload: { documentId: 1 } };
    const url = `${BENREVO_API_PATH}/admin/documents/${action.payload.documentId}/download`;

    describe('error', () => {
      const it = sagaHelper(sagas.downloadFile(action));

      const err = new Error('test');

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, null, true));

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.DOWNLOAD_FILE_ERROR, payload: action.payload }));
      });
    });
  });

  describe('watchFetchData', () => {
    const it = sagaHelper(sagas.watchFetchData());

    it('getCarriers', (result) => {
      expect(result).toEqual(takeLatest(types.LOAD_CARRIERS, sagas.getCarriers));
    });

    it('getFiles', (result) => {
      expect(result).toEqual(takeLatest(types.FILES_GET, sagas.getFiles));
    });

    it('uploadFiles', (result) => {
      expect(result).toEqual(takeLatest(types.UPLOAD_FILES, sagas.uploadFiles));
    });

    it('uploadFile', (result) => {
      expect(result).toEqual(takeEvery(types.UPLOAD_FILE, sagas.uploadFile));
    });

    it('deleteFile', (result) => {
      expect(result).toEqual(takeLatest(types.DELETE_FILE, sagas.deleteFile));
    });

    it('downloadFile', (result) => {
      expect(result).toEqual(takeLatest(types.DOWNLOAD_FILE, sagas.downloadFile));
    });

    it('getTags', (result) => {
      expect(result).toEqual(takeLatest(types.TAGS_GET, sagas.getTags));
    });
  });
});
