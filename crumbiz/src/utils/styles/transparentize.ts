import hexToRgb from './hexToRgb';

export default (color: string | Array<number>, alpha: number) => {
	let r, g, b;
	if (typeof color === 'string') {
		const rgbColor = hexToRgb(color);
		r = rgbColor.r;
		g = rgbColor.g;
		b = rgbColor.b;
	} else {
		[r, g, b] = color;
	}

	const a = (1 - alpha) * 255;
	const calc = (x: number) => Math.round((x - a)/alpha);
	return `rgba(${calc(r)}, ${calc(g)}, ${calc(b)}, ${alpha})`;
}