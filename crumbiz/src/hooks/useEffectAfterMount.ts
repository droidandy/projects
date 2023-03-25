import { useRef, useEffect } from 'react';

const useEffectAfterMount = (cb: () => any, deps: Array<any>) => {
	const isMounted = useRef(false);
	useEffect(() => {
		if (isMounted.current) {
			cb();
		}
		isMounted.current = true;
	}, deps);
};

export default useEffectAfterMount;
