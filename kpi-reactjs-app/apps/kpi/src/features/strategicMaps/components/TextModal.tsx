import { TextFormSymbol, TextSymbol } from '../symbol';
import { createForm } from 'typeless-form';
import { createModule, useActions } from 'typeless';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import React from 'react';
import { Modal } from 'src/components/Modal';
import { useTranslation } from 'react-i18next';
import { SaveButtons } from 'src/components/SaveButtons';
import { validateString } from 'src/common/helper';
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from 'draft-js';
import { StrategicMapsActions } from '../interface';
import { AppStrategicMapText } from 'src/types-next';
import draftToHtml from 'draftjs-to-html';
import { FormEditor } from 'src/components/FormEditor';

export function TextModal() {
  useTextForm();
  handle();
  const { isVisible, item } = getTextState.useState();
  const { t } = useTranslation();
  const { close } = useActions(TextActions);
  const { submit } = useActions(TextFormActions);

  return (
    <Modal
      size="md"
      isOpen={isVisible}
      title={item ? t('Add Text') : t('Edit Text')}
      close={close}
    >
      <TextFormProvider>
        <FormEditor name="text" />
        <SaveButtons onCancel={close} onSave={submit} />
      </TextFormProvider>
    </Modal>
  );
}

interface TextState {
  isVisible: boolean;
  item: AppStrategicMapText | null;
}

export const [handle, TextActions, getTextState] = createModule(TextSymbol)
  .withActions({
    show: (item: AppStrategicMapText | null) => ({ payload: { item } }),
    close: null,
    update: (html: string) => ({
      payload: { html },
    }),
  })
  .withState<TextState>();

const initialState: TextState = {
  isVisible: false,
  item: null,
};

handle
  .reducer(initialState)
  .on(TextActions.show, (state, { item }) => {
    state.isVisible = true;
    state.item = item;
  })
  .on(TextActions.close, state => {
    state.isVisible = false;
  });

export interface TextFormValues {
  text: EditorState;
}

export const [
  useTextForm,
  TextFormActions,
  getTextFormState,
  TextFormProvider,
] = createForm<TextFormValues>({
  symbol: TextFormSymbol,
  validator: (errors, values) => {
    validateString(errors, values, 'text');
  },
});

function htmlToEditor(html: string) {
  if (!html) {
    return EditorState.createEmpty();
  }
  const blocksFromHTML = convertFromHTML(html);
  const state = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap
  );

  return EditorState.createWithContent(state);
}

function getHtml(editorState: EditorState) {
  if (!editorState) {
    return '';
  }
  return draftToHtml(convertToRaw(editorState.getCurrentContent()));
}

handle
  .epic()
  .on(TextActions.show, ({ item }) => {
    if (!item) {
      return [TextFormActions.reset()];
    } else {
      return [
        TextFormActions.reset(),
        TextFormActions.changeMany({
          text: htmlToEditor(item.text),
        }),
      ];
    }
  })
  .on(TextFormActions.setSubmitSucceeded, () => {
    const { item } = getTextState();
    const { values: formValues } = getTextFormState();
    const text = getHtml(formValues.text);
    if (!item) {
      const values: AppStrategicMapText = {
        text,
        id: -Date.now(),
        left: 50,
        top: 30,
        width: 250,
        height: 100,
        angle: 1,
        scaleX: 1,
        scaleY: 1,
      };

      return [
        StrategicMapsActions.textItemCreated(values),
        TextActions.close(),
      ];
    } else {
      const values: AppStrategicMapText = {
        ...item,
        text,
      };

      return [
        StrategicMapsActions.textItemUpdated(values),
        TextActions.close(),
      ];
    }
  });
