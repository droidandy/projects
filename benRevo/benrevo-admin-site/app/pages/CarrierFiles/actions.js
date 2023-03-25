/*
 *
 * CarrierFiles actions
 *
*/

import * as types from './constants';

export function changeCarrier(carrier) {
  return {
    type: types.CHANGE_CARRIERS,
    payload: carrier,
  };
}

export function getCarrier() {
  return {
    type: types.LOAD_CARRIERS,
  };
}

export function changeSearchTag(tag) {
  return {
    type: types.CHANGE_SEARCH_TAG,
    payload: { tag },
  };
}

export function getFiles(tag) {
  const showLoading = true;
  return {
    type: types.FILES_GET,
    payload: { showLoading, tag },
  };
}

export function changeSearch(search) {
  return {
    type: types.CHANGE_SEARCH,
    payload: search,
  };
}

export function deleteFile(fileId, index) {
  return {
    type: types.DELETE_FILE,
    payload: { fileId, index },
  };
}

export function uploadFiles() {
  return {
    type: types.UPLOAD_FILES,
  };
}

export function uploadFile(file, tags) {
  return {
    type: types.UPLOAD_FILE,
    payload: { file, tags },
  };
}

export function downloadFile(file) {
  return {
    type: types.DOWNLOAD_FILE,
    payload: file,
  };
}

export function getTags() {
  return {
    type: types.TAGS_GET,
  };
}

export function addFiles(files) {
  return {
    type: types.ADD_FILES,
    payload: { files },
  };
}

export function removeFile(index) {
  return {
    type: types.REMOVE_FILE,
    payload: { index },
  };
}


export function changeTags(index, tags) {
  return {
    type: types.CHANGE_TAGS,
    payload: { index, tags },
  };
}
