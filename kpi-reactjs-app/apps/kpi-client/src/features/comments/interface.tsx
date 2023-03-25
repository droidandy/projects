import { CommentType, Comment, BaseCommentProps, BaseNamed } from 'src/types';
import { createModule } from 'typeless';
import { CommentsSymbol } from './symbol';

// --- Actions ---
export const [handle, CommentsActions, getCommentsState] = createModule(
  CommentsSymbol
)
  .withActions({
    show: (entity: BaseNamed, baseCommentProps: BaseCommentProps) => ({
      payload: { entity, baseCommentProps },
    }),
    close: null,
    setIsSubmitting: (isSubmitting: boolean) => ({ payload: { isSubmitting } }),
    createComment: (
      html: string,
      type: CommentType,
      file: File | null,
      callback: (result: 'clear' | 'error') => any
    ) => ({
      payload: { html, callback, type, file },
    }),
    commentCreated: (comment: Comment) => ({
      payload: { comment },
    }),
    loaded: (comments: Comment[]) => ({ payload: { comments } }),
    makeCommentAction: (comment: Comment, commentAction: CommentAction) => ({
      payload: { comment, commentAction },
    }),
    setCommentIsLoading: (id: number, isLoading: CommentAction | null) => ({
      payload: { id, isLoading },
    }),
    commentUpdated: (comment: Comment) => ({
      payload: { comment },
    }),
  })
  .withState<CommentsState>();

// --- Types ---
export interface CommentsState {
  isVisible: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  entity: BaseNamed | null;
  baseCommentProps: BaseCommentProps;
  comments: CommentWithState[];
}

export type CommentAction = 'cancel' | 'resolve' | 'reopen';

export interface CommentWithState extends Comment {
  isLoading?: CommentAction | null;
}
