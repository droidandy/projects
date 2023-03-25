import { bindState } from 'react-form-base';

export default function bindModalState(component, key = 'form') {
  return {
    ...bindState(component, key),
    visible: Boolean(component.state && component.state[`${key}Visible`])
  };
}
