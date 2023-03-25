import { useMemo } from 'react';
import { interpolateGroup } from '../utils';
import { IInterpolateGroupParams } from '../utils/styles/interpolateGroup';

const useInterpolationGroup = (
	params: IInterpolateGroupParams,
	deps: Array<any> = []
) => {
	return useMemo(() => interpolateGroup(params), deps);
};

export default useInterpolationGroup;
