import * as Rx from 'src/rx';
import * as R from 'remeda';
import {
  CommentsActions,
  CommentsState,
  handle,
  getCommentsState,
} from './interface';
import { catchErrorAndShowModal } from 'src/common/utils';
import {
  searchComment,
  uploadFile,
  createComment,
  updateComment,
} from 'shared/API';
import { CommentType } from 'src/types';

// --- Epic ---

handle
  .epic()
  .on(CommentsActions.show, () => {
    const { baseCommentProps } = getCommentsState();
    const criteria = {
      kpiId: baseCommentProps.kpiId,
      kpiSeriesId: baseCommentProps.kpiDataSeriesId,
      excellenceRequirementId: baseCommentProps.excellenceRequirementId,
      pageSize: 1e5,
    };
    return Rx.forkJoin(
      searchComment({
        ...criteria,
        type: 'Comment' as CommentType,
      }),
      searchComment({
        ...criteria,
        type: 'ToDo' as CommentType,
      })
    ).pipe(
      Rx.map(([comments, todos]) =>
        CommentsActions.loaded([...comments.items, ...todos.items])
      ),
      catchErrorAndShowModal()
    );
  })
  .on(CommentsActions.createComment, ({ callback, type, file, html }) => {
    const { baseCommentProps } = getCommentsState();
    return Rx.defer(() => {
      if (file) {
        return uploadFile(file);
      } else {
        return Rx.of(null);
      }
    }).pipe(
      Rx.mergeMap(document =>
        createComment({
          ...baseCommentProps,
          text: html,
          type,
          files: document
            ? [
                {
                  documentId: document.id,
                },
              ]
            : undefined,
        }).pipe(
          Rx.map(comment => {
            if (document) {
              comment.files = [
                {
                  commentId: comment.id,
                  document,
                  documentId: document.id,
                },
              ];
            } else {
              comment.files = [];
            }
            callback('clear');
            return CommentsActions.commentCreated(comment);
          }),
          Rx.catchError(err => {
            callback('error');
            throw err;
          })
        )
      ),
      catchErrorAndShowModal()
    );
  })
  .on(CommentsActions.makeCommentAction, ({ comment, commentAction }) => {
    return Rx.concatObs(
      Rx.of(CommentsActions.setCommentIsLoading(comment.id, commentAction)),
      updateComment(comment.id, {
        ...R.pick(comment, ['id', 'text', 'type', 'kpiDataSeriesId']),
        status:
          commentAction === 'cancel'
            ? 'Canceled'
            : commentAction === 'resolve'
            ? 'Resolved'
            : 'Open',
      }).pipe(
        Rx.map(ret => CommentsActions.commentUpdated(ret)),
        catchErrorAndShowModal()
      ),
      Rx.of(CommentsActions.setCommentIsLoading(comment.id, null))
    );
  });

// --- Reducer ---
const initialState: CommentsState = {
  isVisible: false,
  isLoading: true,
  isSubmitting: false,
  entity: null,
  baseCommentProps: null!,
  comments: [],
};

handle
  .reducer(initialState)
  .on(CommentsActions.show, (state, { entity, baseCommentProps }) => {
    Object.assign(state, initialState);
    state.entity = entity;
    state.baseCommentProps = baseCommentProps;
    state.isVisible = true;
  })
  .on(CommentsActions.close, state => {
    state.isVisible = false;
  })
  .on(CommentsActions.loaded, (state, { comments }) => {
    state.comments = comments;
    state.isLoading = false;
  })
  .on(CommentsActions.setIsSubmitting, (state, { isSubmitting }) => {
    state.isSubmitting = isSubmitting;
  })
  .on(CommentsActions.commentCreated, (state, { comment }) => {
    state.comments.push(comment);
  })
  .on(CommentsActions.setCommentIsLoading, (state, { id, isLoading }) => {
    state.comments.forEach(comment => {
      if (comment.id === id) {
        comment.isLoading = isLoading;
      }
    });
  })
  .on(CommentsActions.commentUpdated, (state, { comment }) => {
    state.comments = state.comments.map(item => {
      if (comment.id === item.id) {
        return comment;
      } else {
        return item;
      }
    });
  });

export const useComments = () => handle();
