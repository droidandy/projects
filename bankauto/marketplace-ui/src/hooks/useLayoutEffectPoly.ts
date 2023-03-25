import { useEffect, useLayoutEffect as useLayoutEffectReact } from 'react';
import { isSsr } from 'helpers/isSsr';

export const useLayoutEffect = isSsr ? useEffect : useLayoutEffectReact;
