import React from 'react';
import styled from 'styled-components/native';
import {
	calcHeight,
	calcWidth,
	moderateScale,
	verticalScale
} from '../../../utils/dimensions';
import { useTranslation } from 'react-i18next';

interface IProps {
	visible: boolean;
}

const EntityConfirmationTooltip: React.FC<IProps> = props => {
	const { t } = useTranslation();
	const translationPrefix = 'connectEntities.sendIntro.confirmationTooltip';
	const { visible } = props;
	return visible ? (
		<S.Container>
			<S.Text>
				{t(`${translationPrefix}.sendTo`, {
					entity: t(`${translationPrefix}.owner`)
				})}
			</S.Text>
			<S.Text>
				{t(`${translationPrefix}.sendTo`, {
					entity: t(`${translationPrefix}.target`)
				})}
			</S.Text>
		</S.Container>
	) : null;
};

const S: any = {};
S.Container = styled.View`
	flex: 1;
	background-color: ${({ theme }) => theme.colors.darkGray};
	width: ${moderateScale(227)};
	height: ${verticalScale(85)};
	position: absolute;
	top: 10px;
	right: 10px;
	z-index: 1;
	border-radius: 13px;
	justify-content: space-around;
	padding-horizontal: 20px;
	z-index: 2;
`;

S.Text = styled.Text`
	color: white;
`;

export default EntityConfirmationTooltip;
