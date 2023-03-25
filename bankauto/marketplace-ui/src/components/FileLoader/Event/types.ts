export type EventTypeMap = {
  copy: 'ClipboardEvent';
  cut: 'ClipboardEvent';
  paste: 'ClipboardEvent';
  // Composition Events
  compositionEnd: 'CompositionEvent';
  compositionStart: 'CompositionEvent';
  compositionUpdate: 'CompositionEvent';
  // Keyboard Events
  keyDown: 'KeyboardEvent';
  keyPress: 'KeyboardEvent';
  keyUp: 'KeyboardEvent';
  // Focus Events
  focus: 'FocusEvent';
  blur: 'FocusEvent';
  focusIn: 'FocusEvent';
  focusOut: 'FocusEvent';
  // Form Events
  change: 'Event';
  input: 'InputEvent';
  invalid: 'Event';
  submit: 'Event';
  reset: 'Event';
  // Mouse Events
  click: 'MouseEvent';
  contextMenu: 'MouseEvent';
  dblClick: 'MouseEvent';
  drag: 'DragEvent';
  dragEnd: 'DragEvent';
  dragEnter: 'DragEvent';
  dragExit: 'DragEvent';
  dragLeave: 'DragEvent';
  dragOver: 'DragEvent';
  dragStart: 'DragEvent';
  drop: 'DragEvent';
  mouseDown: 'MouseEvent';
  mouseEnter: 'MouseEvent';
  mouseLeave: 'MouseEvent';
  mouseMove: 'MouseEvent';
  mouseOut: 'MouseEvent';
  mouseOver: 'MouseEvent';
  mouseUp: 'MouseEvent';
  // Selection Events
  select: 'Event';
  // Touch Events
  touchCancel: 'TouchEvent';
  touchEnd: 'TouchEvent';
  touchMove: 'TouchEvent';
  touchStart: 'TouchEvent';
  // UI Events
  resize: 'UIEvent';
  scroll: 'UIEvent';
  // Wheel Events
  wheel: 'WheelEvent';
  // Media Events
  abort: 'Event';
  canPlay: 'Event';
  canPlayThrough: 'Event';
  durationChange: 'Event';
  emptied: 'Event';
  encrypted: 'Event';
  ended: 'Event';
  loadedData: 'Event';
  loadedMetadata: 'Event';
  loadStart: 'ProgressEvent';
  pause: 'Event';
  play: 'Event';
  playing: 'Event';
  progress: 'ProgressEvent';
  rateChange: 'Event';
  seeked: 'Event';
  seeking: 'Event';
  stalled: 'Event';
  suspend: 'Event';
  timeUpdate: 'Event';
  volumeChange: 'Event';
  waiting: 'Event';
  // Image Events
  load: 'UIEvent';
  error: 'Event';
  // Animation Events
  animationStart: 'AnimationEvent';
  animationEnd: 'AnimationEvent';
  animationIteration: 'AnimationEvent';
  // Transition Events
  transitionCancel: 'TransitionEvent';
  transitionEnd: 'TransitionEvent';
  transitionRun: 'TransitionEvent';
  transitionStart: 'TransitionEvent';
  // pointer events
  pointerOver: 'PointerEvent';
  pointerEnter: 'PointerEvent';
  pointerDown: 'PointerEvent';
  pointerMove: 'PointerEvent';
  pointerUp: 'PointerEvent';
  pointerCancel: 'PointerEvent';
  pointerOut: 'PointerEvent';
  pointerLeave: 'PointerEvent';
  gotPointerCapture: 'PointerEvent';
  lostPointerCapture: 'PointerEvent';
  // history events
  popState: 'PopStateEvent';
  doubleClick: 'MouseEvent';
};

export type EventElement = Document | Element | Window | Node;
export interface EventInitWithProps extends EventInit {
  target: {
    value?: string;
    files?: FileList | null;
  };
}
export type EventInitType<T extends EventInit = EventInit & any> = T;
export type EventDescription<K extends keyof EventTypeMap, T extends {} = any> = {
  EventType: EventTypeMap[K];
  defaultInit: EventInitType<T>;
};
export type EventsDescriptionMap = {
  [K in keyof EventTypeMap]: EventDescription<K>;
};
