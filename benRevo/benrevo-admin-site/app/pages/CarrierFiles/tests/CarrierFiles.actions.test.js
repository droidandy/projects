import * as actions from '../actions';
import * as types from './../constants';

describe('Carrier Files actions', () => {
  describe('changeCarrier', () => {
    it('has a type of CHANGE_CARRIERS', () => {
      const carrier = 'ANTHEM';
      const expected = {
        type: types.CHANGE_CARRIERS,
        payload: carrier,
      };
      expect(actions.changeCarrier(carrier)).toEqual(expected);
    });
  });

  describe('getCarrier', () => {
    it('has a type of LOAD_CARRIERS', () => {
      const expected = {
        type: types.LOAD_CARRIERS,
      };
      expect(actions.getCarrier()).toEqual(expected);
    });
  });

  describe('changeSearchTag', () => {
    it('has a type of CHANGE_SEARCH_TAG', () => {
      const tag = '123';
      const expected = {
        type: types.CHANGE_SEARCH_TAG,
        payload: { tag },
      };
      expect(actions.changeSearchTag(tag)).toEqual(expected);
    });
  });

  describe('getFiles', () => {
    it('has a type of FILES_GET', () => {
      const showLoading = true;
      const tag = '123';
      const expected = {
        type: types.FILES_GET,
        payload: { showLoading, tag },
      };
      expect(actions.getFiles(tag)).toEqual(expected);
    });
  });

  describe('changeSearch', () => {
    it('has a type of CHANGE_SEARCH', () => {
      const search = '123';
      const expected = {
        type: types.CHANGE_SEARCH,
        payload: search,
      };
      expect(actions.changeSearch(search)).toEqual(expected);
    });
  });

  describe('deleteFile', () => {
    it('has a type of DELETE_FILE', () => {
      const fileId = '123';
      const index = '234';
      const expected = {
        type: types.DELETE_FILE,
        payload: { fileId, index },
      };
      expect(actions.deleteFile(fileId, index)).toEqual(expected);
    });
  });

  describe('uploadFiles', () => {
    it('has a type of UPLOAD_FILES', () => {
      const expected = {
        type: types.UPLOAD_FILES,
      };
      expect(actions.uploadFiles()).toEqual(expected);
    });
  });

  describe('uploadFile', () => {
    it('has a type of UPLOAD_FILE', () => {
      const file = {};
      const tags = [];
      const expected = {
        type: types.UPLOAD_FILE,
        payload: { file, tags },
      };
      expect(actions.uploadFile(file, tags)).toEqual(expected);
    });
  });

  describe('downloadFile', () => {
    it('has a type of DOWNLOAD_FILE', () => {
      const file = {};
      const expected = {
        type: types.DOWNLOAD_FILE,
        payload: file,
      };
      expect(actions.downloadFile(file)).toEqual(expected);
    });
  });

  describe('getTags', () => {
    it('has a type of TAGS_GET', () => {
      const expected = {
        type: types.TAGS_GET,
      };
      expect(actions.getTags()).toEqual(expected);
    });
  });

  describe('addFiles', () => {
    it('has a type of ADD_FILES', () => {
      const files = [];
      const expected = {
        type: types.ADD_FILES,
        payload: { files },
      };
      expect(actions.addFiles(files)).toEqual(expected);
    });
  });

  describe('removeFile', () => {
    it('has a type of REMOVE_FILE', () => {
      const index = '123';
      const expected = {
        type: types.REMOVE_FILE,
        payload: { index },
      };
      expect(actions.removeFile(index)).toEqual(expected);
    });
  });

  describe('changeTags', () => {
    it('has a type of CHANGE_TAGS', () => {
      const index = '123';
      const tags = [];
      const expected = {
        type: types.CHANGE_TAGS,
        payload: { index, tags },
      };
      expect(actions.changeTags(index, tags)).toEqual(expected);
    });
  });
});
