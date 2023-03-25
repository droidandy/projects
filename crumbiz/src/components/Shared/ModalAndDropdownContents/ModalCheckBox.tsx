import React from 'react';
import { CustomText } from '../';
import CheckBox from '../CheckBox';
import styled from 'styled-components/native';
import { CheckBoxProps } from '../CheckBox';
import { deviceHeight } from '../../../utils/dimensions';

interface IProps extends CheckBoxProps {
	text: string;
}

const ModalCheckBox: React.FC<IProps> = props => {
	const { text, ...rest } = props;
	return (
		<S.Container onPress={rest.onChange}>
			<CheckBox {...rest} />
			<CustomText text={text} withLeftGap size='s15' color='black' />
		</S.Container>
	);
};

export default ModalCheckBox;

const S: any = {};

S.Container = styled.TouchableOpacity`
	flex-direction: row;
	align-items: center;
	margin-bottom: ${deviceHeight * 0.0328};
`;
