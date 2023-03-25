import React, { useCallback } from 'react';
import styled from 'styled-components/native';
import { ITouchableProps } from '../../../types/interfaces';
import Typography from '../Typography';
import { TouchableWithoutFeedback, View } from 'react-native';
import { deviceHeight, deviceWidth } from '../../../utils/dimensions';
import { OpportunityCategoriesEnum } from '../../../types/enums';
import { CustomText } from '../index';

export interface ISummaryItem extends ITouchableProps {
	header: string;
	text: string;
	trimmed: boolean;
	type: OpportunityCategoriesEnum;
	index: number;
	showLine: boolean;
}

const OpSummaryIntroItem: React.FC<ISummaryItem> = props => {
	const { header, text, touchable, trimmed, onPress, index, showLine } = props;

	return (
		<TouchableWithoutFeedback disabled={!touchable} onPress={onPress}>
			<S.Container>

				<S.TextContainer trimmed={trimmed}>
					<View style={{ flex: 1 }}>
						<CustomText bold text={header} size='s13' />
						<CustomText text={text} size='s13' color='gray9' />
					</View>
				</S.TextContainer>

				{showLine ? (
					<S.OrLineContainer>
						<S.OrLine />
					</S.OrLineContainer>
					) : null }

			</S.Container>
		</TouchableWithoutFeedback>
	);
};

const S: any = {};
S.Container = styled(View)`
	margin-left:	${deviceWidth * 0.1111};
	margin-right:	${deviceWidth * 0.0694};
`;

S.TextContainer = styled.View`
	background: transparent;
	width: 100%;
	align-items: flex-start;
  flex-direction: row;
	align-items: center;
	margin-vertical: ${deviceHeight * 0.009875};
`;

S.HeaderText = styled(Typography.H7)`
	text-align: left;
`;
S.Text = styled(Typography.Text)`
	text-align: left;
	flex-wrap: wrap;
	flex: 1;
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
	height: ${deviceHeight * 0.0015625};
	background-color: ${({ theme }) => theme.colors.gray14};
`;

export default OpSummaryIntroItem;
