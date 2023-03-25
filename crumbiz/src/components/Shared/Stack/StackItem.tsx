import React, { useState } from 'react';
import styled from 'styled-components/native';
import Icons from '../Icons';
import {
	moderateScale,
	deviceHeight,
	deviceWidth
} from '../../../utils/dimensions';
import CustomText from '../CustomText';
import RoundedIcon from '../RoundedIcon';
import { useTheme } from '../../../hooks';
import { View, TouchableWithoutFeedback } from 'react-native';

interface IProps {
	title: string;
	onPress: () => any;
	showChildren: boolean;
	children?: React.ReactNode;
	showLine?: boolean;
}

const StackItem: React.FC<IProps> = props => {
	const theme = useTheme();
	const { title, onPress, showChildren, children, showLine } = props;
	const [iconRotationDegree, setIconRotationDegree] = useState([
		{ rotateY: '180deg' },
		{ rotateZ: '0deg' }
	]);

	return (
		<View>
			<TouchableWithoutFeedback
				onPress={() => {
					if (iconRotationDegree[1].rotateZ === '0deg') {
						setIconRotationDegree([
							{ rotateY: '180deg' },
							{ rotateZ: '-90deg' }
						]);
					} else {
						setIconRotationDegree([{ rotateY: '180deg' }, { rotateZ: '0deg' }]);
					}
					onPress();
				}}
			>
				<S.Item>
					<S.Header>
						<S.IconContainer
							style={{
								borderRadius: 100,
								backgroundColor: theme.colors.purple2,
								transform: iconRotationDegree
							}}
						>
							<RoundedIcon
								size={deviceWidth * 0.0722}
								iconSize={deviceWidth * 0.0226}
								fill='white'
								icon={Icons.ArrowBackScreen}
							/>
						</S.IconContainer>

						<CustomText text={title} />
					</S.Header>

					{showChildren && (
						<S.ChildrenContainer>{children}</S.ChildrenContainer>
					)}
				</S.Item>
			</TouchableWithoutFeedback>
			{showLine ? (
				<S.OrLineContainer>
					<S.OrLine />
				</S.OrLineContainer>
			) : null}
		</View>
	);
};

const S: any = {};

S.Item = styled.View`
	background-color: ${({ theme }) => theme.colors.white};
	padding-vertical: ${deviceHeight * 0.01875};
`;

S.Header = styled.View`
	flex-direction: row;
	align-items: center;
`;

S.IconContainer = styled.View`
	margin-right: ${deviceWidth * 0.036805};
	border-radius: 100px;
`;

S.ChildrenContainer = styled.View`
	margin-top: ${moderateScale(20)};
`;

S.OrLineContainer = styled.View`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	height: ${deviceHeight * 0.01875};
`;

S.OrLine = styled.View`
	width: 100%;
	height: ${deviceHeight * 0.003125};
	background-color: ${({ theme }) => theme.colors.gray16};
`;

export default StackItem;
