import React from 'react';
import { CustomText } from '../index';

interface IProps {
	text: string;
}

const ModalHeaderText: React.FC<IProps> = props => {
	const { text } = props;
	return <CustomText center text={text} bold />;
};

export default ModalHeaderText;
