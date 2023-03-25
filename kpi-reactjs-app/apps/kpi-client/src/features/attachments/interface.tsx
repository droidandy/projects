import { FileDocument, BaseNamed, BaseCommentProps } from 'src/types';
import { createModule } from 'typeless';
import { AttachmentsSymbol } from './symbol';

// --- Actions ---
export const [handle, AttachmentsActions, getAttachmentsState] = createModule(
  AttachmentsSymbol
)
  .withActions({
    show: (entity: BaseNamed, baseCommentProps: BaseCommentProps) => ({
      payload: { entity, baseCommentProps },
    }),
    close: null,
    setIsSubmitting: (isSubmitting: boolean) => ({ payload: { isSubmitting } }),
    loaded: (files: FileDocument[]) => ({ payload: { files } }),
    filesCreated: (files: FileDocument[]) => ({ payload: { files } }),
    uploadFiles: (files: File[]) => ({ payload: { files } }),
  })
  .withState<AttachmentsState>();

// --- Types ---
export interface AttachmentsState {
  isVisible: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  entity: BaseNamed | null;
  baseCommentProps: BaseCommentProps;
  files: FileDocument[];
}
