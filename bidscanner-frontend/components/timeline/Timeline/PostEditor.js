// @flow
import React from 'react';
import 'utils/froala/svgTextIconTemplate';

import StyledFroala from 'components/forms-components/new/Editor/StyledFroala';

type EditorProps = {
  placeholder: string,
  input: {},
};

if (process.browser) {
  // eslint-disable-next-line new-cap
  window.$.FroalaEditor.DefineIcon('insertImage', {
    file: 'photo_bcbec0',
    text: 'add photo',
    template: 'svg-text',
  });
}

export default ({ placeholder, input }: EditorProps) =>
  <StyledFroala
    config={{
      placeholderText: placeholder,
      toolbarBottom: true,
      charCounterCount: false,
      toolbarButtons: ['bold', 'italic', 'underline', '|', 'insertImage'],
      toolbarButtonsMD: null,
      toolbarButtonsSM: null,
      toolbarButtonsXS: null,
      imageInsertButtons: ['imageBack', '|', 'imageUpload'],
    }}
    model={input.value}
    onModelChange={input.onChange}
  />;
