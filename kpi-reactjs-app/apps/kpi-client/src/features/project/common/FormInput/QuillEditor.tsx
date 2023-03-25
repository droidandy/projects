import React from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface QuilEditorProps {
  placeholder?: string;
  value?: string;
  onChange?: (text: any) => any;
  onBlur: (text: any) => any;
}

export default function QuillEditor(props: QuilEditorProps) {
  const { placeholder, value, onChange, onBlur } = props;

  return (
    <ReactQuill
      placeholder={placeholder}
      defaultValue={value ? value : ''}
      onChange={ text => { if (onChange) onChange(text); }}
      onBlur={ (previousRange, source, editor) => onBlur(editor.getHTML()) }
    />
  );
}