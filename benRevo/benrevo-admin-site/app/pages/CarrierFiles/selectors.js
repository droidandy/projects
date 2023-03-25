import { createSelector } from 'reselect';

const selectCarrierFiles = (state) => state.get('carrierFiles');
const selectCarrierFilesBlob = (state) => state.get('carrierFilesBlob');

const selectInfo = createSelector(
  selectCarrierFiles,
  (substate) => {
    const carrier = substate.get('selectedCarrier').toJS();
    if (!carrier.carrierId) {
      throw new Error('No Carrier Id found');
    }
    return { carrier };
  }
);

const selectSearch = createSelector(
  selectCarrierFiles,
  (substate) => {
    const fileName = substate.get('search');
    const tag = substate.get('tag');
    return { fileName, tag };
  },
);

const selectUploadingFiles = createSelector(
  selectCarrierFiles,
  (substate) => substate.get('uploadingFiles'),
);

const selectBlobs = createSelector(
  selectCarrierFilesBlob,
  (substate) => substate.get('files').toJS(),
);

const selectTags = createSelector(
  selectCarrierFilesBlob,
  (substate) => substate.get('tags').toJS(),
);

const selectTagList = createSelector(
  selectCarrierFiles,
  (substate) => {
    const brokerages = substate.get('tagList').toJS();
    const final = [];

    for (let i = 0; i < brokerages.length; i += 1) {
      const item = brokerages[i];
      final.push({
        key: item,
        value: item,
        text: item,
      });
    }
    return final;
  }
);

export {
  selectBlobs,
  selectTags,
  selectSearch,
  selectTagList,
  selectInfo,
  selectUploadingFiles,
};
