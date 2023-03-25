import React from 'react';
import { Modal } from 'src/components/Modal';
import { useTranslation } from 'react-i18next';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import { createModule, useActions } from 'typeless';
import { EditorState, convertToRaw } from 'draft-js';
import { CommentModalSymbol } from '../symbol';
import { Button } from 'src/components/Button';
import styled from 'styled-components';

const EditorWrapper = styled.div`
  border: 1px solid #e8eaf0;

  .rdw-editor-toolbar {
    border-top: none;
    border-right: none;
    border-left: none;
  }

  a {
    color: #464457;
  }
  .rdw-editor-wrapper {
    width: 100%;
  }
  .rdw-dropdown-carettoclose,
  .rdw-dropdown-carettoopen {
    left: 10%;
    right: auto;
  }
`;

const Content = styled.div`
  padding: 30px;
`;

const Label = styled.div`
  color: #244159;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 15px;
`;

export function CommentModal() {
  handle();
  const { isVisible, title, description } = getCommentState.useState();
  const { onResult } = useActions(CommentActions);
  const { t } = useTranslation();
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );

  return (
    <Modal
      isOpen={isVisible}
      close={() => onResult({ type: 'close' })}
      title={t(title)}
      subTitle={t(description)}
      size="sm"
      buttons={
        <>
          <Button
            onClick={() => {
              const text = draftToHtml(
                convertToRaw(editorState.getCurrentContent())
              );
              onResult({
                type: 'comment',
                text,
              });
            }}
            disabled={!editorState.getCurrentContent().hasText()}
          >
            {t('Save')}
          </Button>
          <Button
            styling="secondary"
            onClick={() => onResult({ type: 'close' })}
          >
            {t('Cancel')}
          </Button>
        </>
      }
    >
      <Content>
        <Label>{t('Feedback / Notes')}:</Label>
        <EditorWrapper>
          <Editor
            placeholder={t('Write a comment')}
            textAlignment="right"
            editorStyle={{
              padding: '5px 20px',
              height: `70%`,
            }}
            wrapperStyle={{
              height: 200,
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
            onEditorStateChange={setEditorState}
          />
        </EditorWrapper>
      </Content>
    </Modal>
  );
}

export const [handle, CommentActions, getCommentState] = createModule(
  CommentModalSymbol
)
  .withActions({
    show: (title: string, description: string) => ({
      payload: {
        title,
        description,
      },
    }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    onResult: (
      result: { type: 'close' } | { type: 'comment'; text: string }
    ) => ({
      payload: { result },
    }),
  })
  .withState<CommentModalState>();

interface CommentModalState {
  isVisible: boolean;
  title: string;
  description: string;
}

const initialState: CommentModalState = {
  isVisible: false,
  title: '',
  description: '',
};

handle
  .reducer(initialState)
  .on(CommentActions.show, (state, { title, description }) => {
    Object.assign(state, initialState);
    state.isVisible = true;
    state.title = title;
    state.description = description;
    return state;
  })
  .on(CommentActions.onResult, state => {
    state.isVisible = false;
  });
