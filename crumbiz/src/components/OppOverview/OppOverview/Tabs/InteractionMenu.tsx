import React, { FC } from 'react';
import styled from 'styled-components/native';
import { deviceWidth } from '../../../../utils/dimensions';
import { createShadow } from '../../../../utils';
import Icons from '../../../Shared/Icons';
import { InteractionMenuOptionsEnum } from '../../../../types/enums';
import { useTheme } from '../../../../hooks';
import InteractionButton from '../../../Shared/AnimatedInteractionButton';
import { activeTabType } from './TargetProfileContents';
import { openCalendarAndFetchEventData } from '../../../Shared/NewsFeed/TargetProfileCalendar';

interface IProps {
	activeButton: activeTabType;
	setActiveButton: Function;
	entityUserName: string;
	targetId: string;
}

const InteractionMenu: FC<IProps> = props => {
	const { activeButton, setActiveButton, entityUserName, targetId } = props;

	const theme = useTheme();
	return (
		<S.Container>
			<InteractionButton
				isVisible={activeButton === InteractionMenuOptionsEnum.QUESTION}
				onPress={setActiveButton}
				icon={<Icons.QuestionIcon />}
				color={theme.colors.lightOrange}
				value={InteractionMenuOptionsEnum.QUESTION}
			/>

			<InteractionButton
				isVisible={activeButton === InteractionMenuOptionsEnum.MESSAGE}
				onPress={setActiveButton}
				icon={<Icons.MessageIcon />}
				color={theme.colors.opacityLightBlue}
				value={InteractionMenuOptionsEnum.MESSAGE}
			/>

			<InteractionButton
				isVisible={activeButton === InteractionMenuOptionsEnum.CALENDAR}
				onPress={() => {
					openCalendarAndFetchEventData(entityUserName, targetId);
				}}
				icon={<Icons.CalendarIcon />}
				color={theme.colors.lightPurple2}
				value={InteractionMenuOptionsEnum.CALENDAR}
			/>
		</S.Container>
	);
};

const S: any = {};

S.Container = styled.View`
	width: 58%;
	aspect-ratio: 3.466;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	background-color: white;
	border-radius: ${deviceWidth * 0.10277};
	padding-left: 3%;
	padding-right: 3%;
	${createShadow()};
`;

export default InteractionMenu;
