import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useTranslation } from 'react-i18next';
import React from 'react';

export interface WriteCommentEditorProps {
  editorState?: EditorState | undefined;
  onEditorStateChange?(editorState: EditorState): void;
  editorRef?(editor: Editor | null): void;
}

export function WriteCommentEditor(props: WriteCommentEditorProps) {
  const { t } = useTranslation();
  const { editorState, onEditorStateChange, editorRef } = props;
  const fullHeight = 230;

  return (
    <Editor
      placeholder={t('Write a comment')}
      textAlignment="right"
      editorStyle={{
        padding: '5px 20px',
        height: `70%`,
      }}
      wrapperStyle={{
        height: fullHeight - 38 - 20,
      }}
      toolbar={{
        options: ['fontSize', 'list', 'inline'],
        inline: {
          options: ['bold', 'italic', 'underline'],
        },
        list: {
          options: ['unordered', 'ordered'],
        },
      }}
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
      ref={editorRef}
    />
  );
}
