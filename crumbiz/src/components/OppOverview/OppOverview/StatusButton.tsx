import React, { useCallback, useState } from 'react';
import styled from 'styled-components/native';
import CustomText from '../../Shared/CustomText';
import Icons from '../../Shared/Icons';
import { ITouchableProps, IStyle } from '../../../types/interfaces';
import { deviceHeight, deviceWidth } from '../../../utils/dimensions';
import { OpportunityStatusesEnum, EntityEnum } from '../../../types/enums';
import {
	oppStatusesColorMapper,
	availableStatusMapper,
	oppStatusTitleMapper
} from '../../../mappers';
import { changeOppStatus } from '../../../store/actions/oppOverviewActions';
import { useDispatch, useSelector } from 'react-redux';
import { oppOverviewSelector } from '../../../store/selectors/oppOverviewSelector';
import { createCircle } from '../../../utils';
import { useTheme } from '../../../hooks';

interface IProps extends ITouchableProps {
	oppStatus: OpportunityStatusesEnum;
	style?: IStyle;
}

const StatusButton: React.FC<IProps> = props => {
	const theme = useTheme();
	const { oppStatus, style } = props;
	const [shouldShowStatusChange, setShowStatusChange] = useState(false);
	const dispatch = useDispatch();
	const { role } = useSelector(oppOverviewSelector);
	const isOwner = role === EntityEnum.OWNER;
	const handlePress = useCallback(() => {
		typeof props.onPress === 'function' && props.onPress();
		setShowStatusChange(oldState => !oldState);
	}, []);

	const handleStatusBallPress = useCallback(
		(newStatus: OpportunityStatusesEnum) => {
			setShowStatusChange(false);
			dispatch(changeOppStatus(newStatus));
		},
		[]
	);

	return (
		<S.Container style={style}>
			<S.Button
				disabled={!isOwner}
				onPress={handlePress}
				oppStatusColor={oppStatusesColorMapper[oppStatus]}
			>
				<S.TextContainer marginRight={isOwner}>
					<CustomText
						text={oppStatusTitleMapper[oppStatus]}
						variant='light'
						size='s13'
					/>
				</S.TextContainer>
				{isOwner && (
					<S.ArrowIcon width={deviceWidth * 0.013} fill={theme.colors.white} />
				)}
			</S.Button>

			{shouldShowStatusChange && (
				<S.StatusBallsContainer>
					<S.Divider>
						<S.VerticalLine />
					</S.Divider>
					{availableStatusMapper[oppStatus].map(status => (
						<S.StatusBall
							onPress={() => handleStatusBallPress(status)}
							key={status}
							style={{ backgroundColor: oppStatusesColorMapper[status] }}
						/>
					))}
				</S.StatusBallsContainer>
			)}
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	flex-direction: row;
`;

S.Button = styled.TouchableOpacity`
	height: ${deviceHeight * 0.0546875};
	background: ${({ oppStatusColor }: { oppStatusColor: string }) =>
		oppStatusColor};
	align-items: center;
	justify-content: space-between;
	border-radius: 18;
	flex-direction: row;
	padding-horizontal: ${deviceWidth * 0.027};
`;

S.ArrowIcon = styled(Icons.ArrowBackWithoutLineIcon)`
	transform: rotate(180deg);
	top: ${-deviceHeight * 0.0015625};
`;

S.TextContainer = styled.View`
	margin-right: ${({ marginRight }: { marginRight: boolean }) =>
		marginRight ? deviceWidth * 0.027 : 0};
`;

S.StatusBallsContainer = styled.View`
	flex-direction: row;
	align-items: center;
`;

S.Divider = styled.View`
	margin-horizontal: ${deviceWidth * 0.0638};
	opacity: 0.3;
`;

S.VerticalLine = styled.View`
	height: ${deviceHeight * 0.0546875};
	width: ${deviceWidth * 0.005};
	background: ${({ theme }) => theme.colors.halfWhite};
`;

S.StatusBall = styled.TouchableOpacity`
	${createCircle(deviceWidth * 0.08333333333)};
	margin-right: ${deviceWidth * 0.0638};
`;

export default StatusButton;
