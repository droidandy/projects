export const validationShowErrorsOnBlur = <V = any, IN = V, E = string>(event: any) => {
  const { eventType } = event;
  if (eventType === 'blur') event.field.showErrors();
};
