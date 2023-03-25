import { connect } from 'react-redux';
import CarrierFiles from './CarrierFiles';
import { getFiles, changeSearch, uploadFiles, deleteFile, downloadFile, getTags, addFiles, removeFile, changeTags, changeCarrier, getCarrier, changeSearchTag } from './actions';
import { selectTagList } from './selectors';

function mapStateToProps(state) {
  const overviewState = state.get('carrierFiles');
  const blobState = state.get('carrierFilesBlob');
  return {
    loading: overviewState.get('loading'),
    uploadingFiles: overviewState.get('uploadingFiles'),
    search: overviewState.get('search'),
    files: overviewState.get('files').toJS(),
    tagList: selectTagList(state),
    blobs: blobState.get('files').toJS(),
    tags: blobState.get('tags').toJS(),
    tag: overviewState.get('tag'),
    selectedCarrier: overviewState.get('selectedCarrier').toJS(),
    carriers: overviewState.get('carriers').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getCarrier: () => { dispatch(getCarrier()); },
    changeCarrier: (carrier) => { dispatch(changeCarrier(carrier)); },
    getFiles: (tag) => { dispatch(getFiles(tag)); },
    changeSearchTag: (taglist, tag) => { dispatch(changeSearchTag(taglist, tag)); },
    getTags: () => { dispatch(getTags()); },
    changeSearch: (search) => { dispatch(changeSearch(search)); },
    addFiles: (files) => { dispatch(addFiles(files)); },
    removeFile: (index) => { dispatch(removeFile(index)); },
    changeTags: (index, tags) => { dispatch(changeTags(index, tags)); },
    uploadFiles: () => { dispatch(uploadFiles()); },
    downloadFile: (file) => { dispatch(downloadFile(file)); },
    deleteFile: (fileId, index) => { dispatch(deleteFile(fileId, index)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CarrierFiles);
