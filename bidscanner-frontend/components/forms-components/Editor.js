// @flow
import FroalaEditor from 'react-froala-wysiwyg';

type EditorProps = {
  placeholder: string,
  input: {
    // TODO: eslint doesn't provide support for nested values
    // value: {
    //   calendarOpen: boolean,
    //   day: Date
    // }
  }
};

export default ({ placeholder, input: { value, onChange } }: EditorProps) => (
  <div>
    <FroalaEditor
      config={{
        height: 300,
        placeholderText: placeholder,
      }}
      model={value}
      onModelChange={text => onChange(text)}
    />
  </div>
);
