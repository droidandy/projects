import * as React from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import { useActions } from 'typeless';
import { DropdownOption } from 'src/components/DropdownOption';
import { MenuAddonButton } from 'src/components/MenuAddonButton';
import { CommentType } from 'src/types';
import { WriteCommentEditor } from './WriteCommentEditor';
import { WriteEditorAttachment } from './WriteEditorAttachment';
import { CommentsActions } from '../interface';

interface WriteCommentProps {
  onExpanded: (isExpanded: boolean) => void;
}

const Input = styled.input`
  border: none;
  outline: none;
  font-size: 14px;
  min-width: 0;
  margin-top: 15px;
  margin-right: 10px;
  &::placeholder {
    font-size: 14px;
    color: #a7abc3;
  }
`;

const Wrapper = styled.div<{ isExpanded: boolean }>`
  display: block;
  background: #ffffff;
  border: 1px solid #e8eaf0;
  border-radius: 3px;
  position: absolute;
  bottom: 30px;
  left: 30px;
  right: 30px;
  height: 60px;
  transition: height 0.15s ease-in-out;
  overflow: hidden;

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

  ${props =>
    props.isExpanded &&
    css`
      ${MenuAddonButton} {
        margin-right: 20px;
      }
    `}

  ${props =>
    !props.isExpanded &&
    css`
      ${MenuAddonButton} {
        position: absolute;
        left: 10px;
        top: 10px;
      }
    `}
`;

export function WriteComment(props: WriteCommentProps) {
  const { onExpanded } = props;
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );
  const editorRef = React.useRef(null as Editor | null);
  const initialFocusRef = React.useRef(false);
  const { createComment } = useActions(CommentsActions);
  const [file, setFile] = React.useState(null as File | null);

  React.useEffect(() => {
    if (!isExpanded) {
      return () => {
        //
      };
    }
    const onClick = (ev: MouseEvent) => {
      if (
        editorRef.current &&
        editorRef.current.props.editorState!.getCurrentContent().hasText()
      ) {
        return;
      }
      let target = ev.target as HTMLDivElement;
      while (target) {
        if (
          target.hasAttribute &&
          target.hasAttribute('data-write-comment-wrapper')
        ) {
          return;
        }
        target = target.parentNode as HTMLDivElement;
      }
      setIsExpanded(false);
    };
    const handlerTimeout = setTimeout(() => {
      window.addEventListener('click', onClick);
    }, 0);
    return () => {
      clearTimeout(handlerTimeout);
      window.removeEventListener('click', onClick);
    };
  }, [isExpanded]);

  React.useEffect(() => {
    onExpanded(isExpanded);
  }, [isExpanded]);

  const create = (type: CommentType) => {
    if (!isExpanded) {
      setIsExpanded(true);
      return;
    }
    if (!editorState.getCurrentContent().hasText()) {
      return;
    }
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setIsLoading(true);
    createComment(html, type, file, result => {
      setIsLoading(false);
      if (result === 'clear') {
        setEditorState(EditorState.createEmpty());
        setIsExpanded(false);
        setFile(null);
      }
    });
  };

  return (
    <Wrapper
      data-write-comment-wrapper
      style={{
        height: isExpanded ? 230 : 60,
      }}
      isExpanded={isExpanded}
    >
      {isExpanded && <WriteEditorAttachment file={file} onSelected={setFile} />}
      {isExpanded ? (
        <WriteCommentEditor
          editorState={editorState}
          onEditorStateChange={newState => {
            setEditorState(newState);
          }}
          editorRef={editor => {
            editorRef.current = editor;
            if (editor && !initialFocusRef.current) {
              editor.focusEditor();
              initialFocusRef.current = true;
            }
          }}
        />
      ) : (
        <Input
          placeholder={t('Write a comment')}
          onFocus={() => {
            setIsExpanded(true);
          }}
        />
      )}
      <MenuAddonButton
        loading={isLoading}
        onClick={() => {
          create('Comment');
        }}
        dropdown={
          <>
            <DropdownOption
              onClick={() => {
                create('ToDo');
              }}
            >
              {t('Create TODO')}
            </DropdownOption>
          </>
        }
      >
        {t('Comment')}
      </MenuAddonButton>
    </Wrapper>
  );
}
