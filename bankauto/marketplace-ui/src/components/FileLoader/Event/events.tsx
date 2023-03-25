import { eventMap } from './eventMap';
import { EventInitWithProps, EventElement, EventTypeMap, EventDescription } from './types';

function isEventInitWithPops(e: any): e is EventInitWithProps {
  return e.hasOwnProperty('target');
}

export interface CreateEventFunction {
  <K extends keyof EventTypeMap, I extends {} = {}>(
    eventName: K,
    node: EventElement,
    init?: I,
    description?: EventDescription<K, I>,
  ): Event;
}
export type CreateEventMethods = {
  [K in keyof EventTypeMap]: (element: EventTarget, options?: {}) => Event;
};
interface CreateEvent extends CreateEventFunction, CreateEventMethods {}

function createEventFunction<K extends keyof EventTypeMap, I extends {} = {}>(
  eventName: K,
  node: EventElement,
  init?: I,
  description?: EventDescription<K, I>,
): Event {
  const { EventType, defaultInit } = description || eventMap.error;
  if (!node) {
    throw new Error(`Unable to fire a "${eventName}" event - please provide a DOM element.`);
  }
  const eventInit = { ...defaultInit, ...init };

  if (isEventInitWithPops(eventInit)) {
    const { target: { value, files, ...targetProperties } = {} } = eventInit;
    if (value !== undefined) {
      setNativeValue(node, value);
    }
    if (files !== undefined) {
      // input.files is a read-only property so this is not allowed:
      // input.files = [file]
      // so we have to use this workaround to set the property
      Object.defineProperty(node, 'files', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: files,
      });
    }
    Object.assign(node, targetProperties);
  }
  const EventConstructor = window[EventType] || window.Event;
  if (typeof EventConstructor === 'function') {
    return new EventConstructor(eventName, eventInit) as InstanceType<typeof EventConstructor>;
  }
  // IE11 polyfill from https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
  const event = window.document.createEvent(EventType);
  const { bubbles, cancelable, detail, ...otherInit } = eventInit;
  event.initEvent(eventName, bubbles, cancelable);
  return Object.assign(event, otherInit);
}

const createEventMethods = (Object.keys(eventMap) as (keyof EventTypeMap)[]).reduce<CreateEventMethods>(
  (res, key) =>
    Object.assign(res, {
      [key]: (node: Element, init: any) => createEventFunction(key, node, init, eventMap[key]),
    }),
  {} as never,
);

export const createEvent: CreateEvent = Object.assign(createEventFunction, createEventMethods);

export type FireEventMethods = {
  [K in keyof EventTypeMap]: (element: EventTarget, options?: {}) => boolean;
};
interface FireEventFunction {
  (element: EventTarget, event: Event): boolean;
}
interface FireEvent extends FireEventFunction, FireEventMethods {}

function fireEventFunction(element: EventTarget, event: Event) {
  return element.dispatchEvent(event);
}
const fireEventMethods = (Object.keys(eventMap) as (keyof EventTypeMap)[]).reduce<FireEventMethods>(
  (res, key) =>
    Object.assign(res, {
      [key]: (node: EventTarget, init: any) => fireEventFunction(node, createEvent[key](node, init)),
    }),
  {} as never,
);

export const fireEvent: FireEvent = Object.assign(fireEventFunction, fireEventMethods);

// (Object.keys(eventMap) as (keyof EventTypeMap)[]).forEach((key) => {
//   const {EventType, defaultInit} = eventMap[key]
//   const eventName = key.toLowerCase()
//
//   createEvent[key] = (node, init) =>
//     createEvent(eventName, node, init, {EventType, defaultInit})
//   fireEvent[key] = (node, init) => fireEvent(node, createEvent[key](node, init))
// })

// function written after some investigation here:
// https://github.com/facebook/react/issues/10135#issuecomment-401496776
function setNativeValue(element: EventElement, value: any) {
  const { set: valueSetter } = Object.getOwnPropertyDescriptor(element, 'value') || {};
  const prototype = Object.getPrototypeOf(element);
  const { set: prototypeValueSetter } = Object.getOwnPropertyDescriptor(prototype, 'value') || {};
  if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value);
  } else {
    if (valueSetter) {
      valueSetter.call(element, value);
    } else {
      throw new Error('The given element does not have a value setter');
    }
  }
}

// (Object.keys(eventAliasMap) as (keyof typeof eventAliasMap)[]).forEach((aliasKey) => {
//   const key = eventAliasMap[aliasKey];
//   fireEvent[aliasKey] = (...args) => fireEvent[key](...args)
// })
