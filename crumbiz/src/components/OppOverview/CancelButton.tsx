import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import CustomText from '../Shared/CustomText';
import { IStyle, PlainFunction } from '../../types/interfaces';
import { calcHeight } from '../../utils/dimensions';

interface IProps extends IStyle {
	onCancel: PlainFunction;
}

const CancelButton: React.FC<IProps> = props => {
	const { t } = useTranslation();
	const { onCancel, style } = props;

	return (
		<S.Container onPress={onCancel} style={style}>
			<S.CancelButtonContent>
				<CustomText size='s12' color='white' text={t('global.cancel')} />
			</S.CancelButtonContent>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.TouchableOpacity`
	width: 27.22%;
	bottom: ${calcHeight(20)};
	overflow: hidden;
	position: absolute;
	border-radius: 22px;
	align-self: center;
`;

S.CancelButtonContent = styled.View`
	width: 100%;
	background-color: ${({ theme }) => theme.colors.opacityDarkerBlue1};
	aspect-ratio: 2.88;
	align-items: center;
	justify-content: center;
`;

export default CancelButton;
