import React, { useCallback } from 'react';
import styled, { css } from 'styled-components/native';
import { ITheme, ITouchableProps } from '../../../types/interfaces';
import Typography from '../Typography';
import { TouchableWithoutFeedback, View } from 'react-native';
import { deviceHeight, deviceWidth } from '../../../utils/dimensions';
import { OpportunityCategoriesEnum } from '../../../types/enums';
import { CustomText, Icons } from '../index';
import { useTheme } from '../../../hooks';

export interface ISummaryItem extends ITouchableProps {
	header: string;
	text: string;
	trimmed: boolean;
	type: OpportunityCategoriesEnum;
	index: number;
}

const iconDimension = deviceWidth * 0.06;

const iconsMapper = {
	[OpportunityCategoriesEnum.OPP_TYPE]: {
		Icon: Icons.RoundedStarIcon
	},
	[OpportunityCategoriesEnum.LOCATION]: {
		Icon: Icons.LocationIcon
	},
	[OpportunityCategoriesEnum.BUDGET]: {
		Icon: Icons.BudgetIcon
	},
	[OpportunityCategoriesEnum.TEAM_SIZE]: {
		Icon: Icons.GroupIcon
	},
	[OpportunityCategoriesEnum.SERVICE_PROVIDER]: {
		Icon: Icons.ServiceIcon
	},
	[OpportunityCategoriesEnum.TYPE_OF_BUSINESS]: {
		Icon: Icons.BriefcaseIcon
	},
	[OpportunityCategoriesEnum.TITLE]: {
		Icon: Icons.GroupIcon
	},
	[OpportunityCategoriesEnum.VERTICAL]: {
		Icon: Icons.VerticalIcon
	}
};

const OpSummaryItem: React.FC<ISummaryItem> = props => {
	const { header, text, type, touchable, trimmed, onPress, index } = props;
	const theme = useTheme();

	// @ts-ignore
	const { Icon } = iconsMapper[type];

	const getBackgroundColor = useCallback(index => {
		const _index = index + 1;
		if (_index % 3 === 0) {
			return theme.colors.lightBlue1;
		} else if (_index % 2 === 0) {
			return theme.colors.orange;
		} else {
			return theme.colors.purple2;
		}
	}, []);

	return (
		<TouchableWithoutFeedback disabled={!touchable} onPress={onPress}>
			<S.Container trimmed={trimmed}>
				<S.ItemTypeSquare
					style={{ backgroundColor: getBackgroundColor(index) }}
				>
					<Icon fill='#fff' height={iconDimension} width={iconDimension} />
				</S.ItemTypeSquare>

				<View style={{ flex: 1 }}>
					<CustomText bold text={header} />
					<CustomText text={text} size='s14' />
				</View>
			</S.Container>
		</TouchableWithoutFeedback>
	);
};

const S: any = {};
S.Container = styled.View(
	({ theme, trimmed }: Partial<ISummaryItem> & ITheme) => `
	background: transparent;
	width: 100%;
  align-items: flex-start;
  min-height: ${deviceHeight * 0.08395802098};
  flex-direction: row;
  align-items: flex-start;

  ${!trimmed &&
		css`
			padding: 25px;
		`};
		
		
	${trimmed &&
		css`
			margin-top: 10;
		`}	
`
);

S.ItemTypeSquare = styled.View`
	width: ${deviceWidth * 0.113};
	aspect-ratio: 1;
	border-radius: 10;
	background: red;
	margin-right: ${deviceWidth * 0.04};
	align-items: center;
	justify-content: center;
`;

S.HeaderText = styled(Typography.H7)`
	text-align: left;
`;
S.Text = styled(Typography.Text)`
	text-align: left;
	flex-wrap: wrap;
	flex: 1;
`;

export default OpSummaryItem;
