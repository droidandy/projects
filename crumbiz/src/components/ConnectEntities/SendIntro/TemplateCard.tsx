import React from 'react';
import styled from 'styled-components/native';
import { calcHeight, calcWidth, deviceHeight } from '../../../utils/dimensions';
import { Elevated, Icons, CustomText } from '../../Shared';
import { useDispatch } from 'react-redux';
import { useTheme } from '../../../hooks';
import { ITouchableProps } from '../../../types/interfaces';
import { createShadow, removeHTMLTags } from '../../../utils';

interface IProps extends ITouchableProps {
	isFavorite: boolean;
	headerText: string;
	templateText: string;
	templateId: string;
	numberTextLines?: number;
}

const TemplateCard: React.FC<IProps> = props => {
	const {
		isFavorite,
		headerText,
		templateText,
		onPress,
		numberTextLines
	} = props;
	const theme = useTheme();
	return (
		<S.Container
			touchable
			onPress={() => {
				typeof onPress === 'function' && onPress();
			}}
		>
			<S.Content>
				<S.Header>
					<S.HeaderTextContainer type={isFavorite}>
						<S.HeaderText bold text={headerText} color='white' size='s16' />
					</S.HeaderTextContainer>

					<S.FavoriteButton
						onPress={() => {
							/** todo- yaron put integration */
						}}
					>
						<S.FavoriteIcon
							fill={isFavorite ? theme.colors.paleBlue1 : theme.colors.gray8}
						/>
					</S.FavoriteButton>
				</S.Header>

				{/* TODO: INJECT INPUT COMPONENT	*/}
				<S.ContentContainer>
					<CustomText
						light
						ellipsizeMode='tail'
						numberOfLines={numberTextLines || 9}
						color='gray15'
						size='s13'
						text={removeHTMLTags(templateText)}
						lineHeight={23}
						// fix line-height to be responsivness
					/>
				</S.ContentContainer>
			</S.Content>
		</S.Container>
	);
};

const S: any = {};

S.Container = styled(Elevated)`
	width: ${calcWidth(268)};
	height: ${calcHeight(253)};

	margin-left: ${calcWidth(25)};
	margin-bottom: ${calcHeight(30)};
	border-radius: 14px;
	${createShadow()};
	background: white;
	padding-right: ${calcWidth(30)};
	padding-left: ${calcWidth(28)};
	padding-top: ${calcHeight(25)};
	padding-bottom: ${calcHeight(25)};
`;

S.Header = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;

S.HeaderTextContainer = styled.View<{ type: number }>`
	background-color: ${({ type, theme }) =>
		type % 2 === 0 ? theme.colors.orange : theme.colors.purple2};
	padding-horizontal: ${calcWidth(15)};
	padding-vertical: ${calcHeight(4)};
	border-radius: 5px;
`;

S.HeaderText = styled(CustomText)`
	text-align: left;
`;
S.FavoriteIcon = styled(Icons.ActiveStarIcon)`
	width: 100%;
	height: 100%;
`;
S.FavoriteButton = styled.TouchableOpacity`
	width: ${calcWidth(16)};
	aspect-ratio: 1;
`;
S.Content = styled.View`
	flex: 1;
`;

S.ContentContainer = styled.View`
	margin-top: ${deviceHeight * 0.03};
	padding-horizontal: ${calcWidth(3)};
`;

export default TemplateCard;
