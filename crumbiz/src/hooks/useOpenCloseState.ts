import { useState } from 'react';

const useOpenCloseState = () => {
	const [isOpen, setIsOpen] = useState(false);

	const close = () => setIsOpen(false);
	const open = () => setIsOpen(true);

	return {
		isOpen,
		close,
		open
	};
};

export default useOpenCloseState;
