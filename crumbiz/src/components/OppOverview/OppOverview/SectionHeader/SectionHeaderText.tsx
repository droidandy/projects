import React from 'react';
import styled from 'styled-components/native';
import { CustomText } from '../../../Shared';
import { deviceHeight, deviceWidth } from '../../../../utils/dimensions';
import { IColors, IFontSizes } from '../../../../types/styled';

interface IProps {
	text: string;
	amount?: number;
	color?: keyof IColors;
	size?: keyof IFontSizes;
}

const SectionHeaderText: React.FC<IProps> = props => {
	const { text, amount, color, size } = props;
	return (
		<S.Container>
			<CustomText size={size} text={text} color={color || 'darkerBlue1'} bold />

			{!amount && amount !== 0 ? null : (
				<S.Amount text={`(${amount})`} color={color || 'darkerBlue1'} size='s12' />
			)}
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	flex-direction: row;
	align-items: center;
`;

S.Amount = styled(CustomText)`
	margin-horizontal: ${deviceWidth * 0.018};
	opacity: 0.4;
`;

export default SectionHeaderText;
