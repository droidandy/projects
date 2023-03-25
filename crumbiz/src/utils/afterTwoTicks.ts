const afterTwoTicks = (cb: () => any) => {
	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			typeof cb == 'function' && cb();
		});
	});
};

export default afterTwoTicks;
