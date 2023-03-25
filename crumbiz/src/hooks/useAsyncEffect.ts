import { useEffect } from 'react';

const useAsyncEffect = (effect: () => any, inputs: Array<any>) => {
	useEffect(() => {
		effect();
	}, inputs);
};

export default useAsyncEffect;
