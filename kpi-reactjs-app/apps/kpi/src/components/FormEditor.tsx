import React, { useContext } from 'react';
import { EditorState } from 'draft-js';
import { FormContext } from 'typeless-form';
import { useLanguage } from 'src/hooks/useLanguage';
import styled from 'styled-components';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { ErrorMessage } from './ErrorMessage';

export interface FormEditorProps {
  name: string;
  langSuffix?: boolean;
}

const EditorWrapper = styled.div`
  a {
    color: #464457;
  }
`;

export function FormEditor(props: FormEditorProps) {
  const { langSuffix } = props;

  const lang = useLanguage();
  const data = useContext(FormContext);
  const name = langSuffix ? `${props.name}_${lang}` : props.name;
  if (!data) {
    throw new Error(`${name} cannot be used without FormContext`);
  }
  const hasError = data.touched[name] && !!data.errors[name];

  return (
    <EditorWrapper
      style={{
        height: 250,
      }}
    >
      <Editor
        editorStyle={{
          padding: 5,
          height: 190,
          border: '1px solid #F1F1F1',
        }}
        editorState={data.values[name] || EditorState.createEmpty()}
        onEditorStateChange={newState => {
          data.actions.change(name, newState);
        }}
      />
      {hasError && <ErrorMessage>{data.errors[name]}</ErrorMessage>}
    </EditorWrapper>
  );
}
