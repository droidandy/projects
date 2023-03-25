import React, { FC, useState, useCallback, useEffect } from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components/native';
import {
	CustomText,
	PaddingHorizontalContainer,
	CoveringLoadingModal
} from '../index';
import { useTranslation } from 'react-i18next';
import { useContentExpandContext } from '../../../hooks';
import { deviceHeight, calcWidth, calcHeight } from '../../../utils/dimensions';
import { predefinedMessagesSelector } from '../../../store/selectors/oppOverviewSelector';
import { useDispatch, useSelector } from 'react-redux';
import { getPredefinedQuestions } from '../../../store/actions/oppOverviewActions';
import { InteractionMenuOptionsEnum } from '../../../types/enums';
import {
	StateUpdaterFunction,
	IPredefinedQuestion,
	PlainFunction
} from '../../../types/interfaces';
import { CancelButton } from '../../OppOverview';
import { TargetProfileContext } from '../../../screens/OppOverview/targetProfileContext';

export type activeButtonType = InteractionMenuOptionsEnum | null;

interface IProps {
	activeButton: activeButtonType;
	setActiveButton: StateUpdaterFunction<activeButtonType>;
	sendInteractionHandler: PlainFunction;
	toggleExpandSubcontents: StateUpdaterFunction<boolean>;
}

const TargetProfileQuestions: FC<IProps> = props => {
	const {
		activeButton,
		setActiveButton,
		sendInteractionHandler,
		toggleExpandSubcontents
	} = props;
	const dispatch = useDispatch();
	const [sending, setSending] = useState(false);
	useEffect(() => {
		dispatch(getPredefinedQuestions());
	}, []);
	const predefinedMessages: Array<IPredefinedQuestion> = useSelector(
		predefinedMessagesSelector
	);

	const cancelCallback = useCallback(() => {
		setActiveButton(null);
		toggleExpandSubcontents(false);
	}, [setActiveButton, toggleExpandSubcontents]);

	return (
		<>
			<S.Container>
				{predefinedMessages.length ? (
					predefinedMessages.map(item => (
						<S.QuestionButton
							disabled={sending}
							key={`${item.id}_question`}
							onPress={() => {
								setSending(true);
								sendInteractionHandler({
									body: item.body,
									isPredefinedMessage: true,
									predefinedMessageTemplateId: item.id
								});
							}}
						>
							<S.QuestionButtonContent>
								<CustomText size='s15' color='black' text={item.body} />
							</S.QuestionButtonContent>
						</S.QuestionButton>
					))
				) : (
					<CoveringLoadingModal visible />
				)}
			</S.Container>

			<CancelButton onCancel={cancelCallback} />
		</>
	);
};

const S: any = {};

S.Container = styled.ScrollView.attrs({
	contentContainerStyle: {
		flexGrow: 1,
		paddingHorizontal: calcWidth(25),
		paddingVertical: calcHeight(30)
	}
})`
	flex: 1;
	height: ${deviceHeight * 0.85};
	flex-direction: column;
	background-color: white;
`;

S.QuestionButton = styled.TouchableOpacity`
	margin-top: ${calcHeight(20)};
	overflow: hidden;
`;

S.QuestionButtonContent = styled.View`
	background-color: ${({ theme }) => theme.colors.opacityPaleBlue1};
	border-radius: 30px;
	padding-horizontal: 7%;
	padding-vertical: ${calcHeight(13)};
	flex-direction: column;
	justify-content: center;
`;

export default TargetProfileQuestions;
