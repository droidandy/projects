import React, { FC, forwardRef, memo } from 'react';
import { Icon } from '@marketplace/ui-kit';
import { ReactComponent as IconDeleteRed } from '@marketplace/ui-kit/icons/iconCloseRed';
import { Preview, PreviewProps, PreviewVariant } from './components/preview';
import { FileObject, FileStatus } from './types';

export const statusVariants: Record<FileStatus, PreviewVariant> = {
  initial: 'processing',
  loading: 'processing',
  accepted: 'default',
  rejected: 'error',
};

interface LoaderPreviewItemProps extends Pick<PreviewProps, 'containerRef' | 'orientation'> {
  onRemove: (id: string) => void;
  item: FileObject;
}

const LoaderPreviewItemRoot: FC<LoaderPreviewItemProps> = memo(
  ({ onRemove, item: { id, status = 'initial', message, src }, ...viewProps }) => {
    const variant = statusVariants[status];
    return (
      <Preview
        variant={variant}
        actions={<Icon component={IconDeleteRed} onClick={() => onRemove(id)} style={{ cursor: 'pointer' }} />}
        message={message}
        src={src}
        {...viewProps}
      />
    );
  },
);

export const LoaderPreviewItem = forwardRef<HTMLDivElement, LoaderPreviewItemProps>((props, ref) => {
  return <LoaderPreviewItemRoot containerRef={ref} {...props} />;
});
LoaderPreviewItem.displayName = 'LoaderPreviewItem';
