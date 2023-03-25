// @flow
// flow-typed signature: 351f0f910bac620d009e6a24ff5e9a59
// flow-typed version: <<STUB>>/redux-form_v^6.7.0/flow_v0.47.0

/* see declarations for previous redux-form here:
  https://github.com/flowtype/flow-typed/blob/master/definitions/npm/redux-form_v5.x.x/flow_v0.22.1-/redux-form_v5.x.x.js
*/
import React from 'react';

declare module 'redux-form' {
  declare type FormConfig = {
    form: string,
    validate?: Function
  };

  declare export type MetaProps = {
    active: boolean,
    autofilled: boolean,
    asyncValidating: boolean,
    dirty: boolean,
    dispatch: Function,
    error?: string,
    initial: any,
    invalid: boolean,
    pristine: boolean,
    submitting: boolean,
    submitFailed: boolean,
    touched: boolean,
    valid: boolean,
    visited: boolean,
    warning?: string
  };

  declare export type InputProps = {
    onChange: (eventOrValue: SyntheticEvent | string | boolean) => void,
    onUpdate: (eventOrValue: SyntheticEvent | string | boolean) => void,
    onBlur: (eventOrValue: SyntheticEvent | string | boolean) => void,
    onDragStart: Function,
    onDrop: Function,
    onFocus: Function,
    name: string,
    value: string | boolean
  };

  declare export type FormProps = {
    handleSubmit: Function,
    submitting: boolean,
  }
  
  declare export var Field: Class<React.Component<void, *, *>>;

  declare export function reducer(state: any, action: Object): any;

  declare export function reduxForm(
    config: FormConfig,
  ): (component: React.Component<*, *, *>) => React.Component<*, *, *>;
}
