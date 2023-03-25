import * as Rx from 'src/rx';
import * as R from 'remeda';
import { searchComment, uploadFile, createComment } from 'shared/API';
import { catchErrorAndShowModal } from 'src/common/utils';
import {
  AttachmentsActions,
  AttachmentsState,
  handle,
  getAttachmentsState,
} from './interface';

// --- Epic ---

handle
  .epic()
  .on(AttachmentsActions.show, () => {
    const { baseCommentProps } = getAttachmentsState();
    return searchComment({
      kpiSeriesId: baseCommentProps.kpiDataSeriesId,
      excellenceRequirementId: baseCommentProps.excellenceRequirementId,
      pageSize: 1e5,
      type: 'Evidence',
    }).pipe(
      Rx.map(ret =>
        AttachmentsActions.loaded(
          R.flatMap(ret.items, item => item.files.map(x => x.document))
        )
      ),
      catchErrorAndShowModal()
    );
  })
  .on(AttachmentsActions.uploadFiles, ({ files }) => {
    if (!files.length) {
      return Rx.empty();
    }
    const { baseCommentProps } = getAttachmentsState();
    return Rx.concatObs(
      Rx.of(AttachmentsActions.setIsSubmitting(true)),
      Rx.from(files).pipe(
        Rx.mergeMap(file => uploadFile(file)),
        Rx.toArray(),
        Rx.mergeMap(created =>
          createComment({
            ...baseCommentProps,
            text: 'dummy',
            type: 'Evidence',
            files: created.map(x => ({
              documentId: x.id,
            })),
          }).pipe(Rx.map(() => AttachmentsActions.filesCreated(created)))
        ),
        catchErrorAndShowModal()
      ),
      Rx.of(AttachmentsActions.setIsSubmitting(false))
    );
  });

// --- Reducer ---
const initialState: AttachmentsState = {
  isVisible: false,
  isLoading: true,
  isSubmitting: false,
  entity: null,
  baseCommentProps: null!,
  files: [],
};

handle
  .reducer(initialState)
  .on(AttachmentsActions.show, (state, { entity, baseCommentProps }) => {
    Object.assign(state, initialState);
    state.entity = entity;
    state.baseCommentProps = baseCommentProps;
    state.isVisible = true;
  })
  .on(AttachmentsActions.close, state => {
    state.isVisible = false;
  })
  .on(AttachmentsActions.loaded, (state, { files }) => {
    state.files = files;
    state.isLoading = false;
  })
  .on(AttachmentsActions.setIsSubmitting, (state, { isSubmitting }) => {
    state.isSubmitting = isSubmitting;
  })
  .on(AttachmentsActions.filesCreated, (state, { files }) => {
    state.files.push(...files);
  });

export const useAttachments = () => handle();
