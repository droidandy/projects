const DEVICE_WIDTH_FROM_DESIGN = 360;

interface IParams {
	width: number;
	height: number;
}

const calcRatio = ({ width = DEVICE_WIDTH_FROM_DESIGN, height }: IParams) => {
	return width / height;
};

export default calcRatio;
