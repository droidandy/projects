import React from 'react';
import styled from 'styled-components/native';
import OpSummaryItem from './OpSummaryItem';
import OpSummaryIntroItem from './OpSummaryIntroItem';

import { OpportunityCategoriesEnum } from '../../../types/enums';
import { DynamicObject, IOpportunitySummary } from '../../../types/interfaces';

interface IProps {
	data: IOpportunitySummary;
	touchable?: boolean;
	onPress?(text: string): void;
	trimmed?: boolean;
	fromIntroSummary?: boolean;
}

const OpSummary: React.FC<IProps> = props => {
	const { touchable, onPress, data, trimmed, fromIntroSummary } = props;
	const dataLength = Object.entries(data).length;

	return (
		<>
			{fromIntroSummary ? (
				<S.Container>
					{Object.entries(data).map(([key, text], index) => (
						<OpSummaryIntroItem
							touchable={Boolean(touchable)}
							onPress={() => {
								typeof onPress === 'function' && onPress(text as string);
							}}
							key={key}
							header={key}
							type={key as OpportunityCategoriesEnum}
							showLine={!(dataLength - index === 1)}
							index={index}
							text={
								/*
								 * We need to convert verticals object to comma-separated values.
								 * */
								key === OpportunityCategoriesEnum.VERTICAL
									? Object.keys(
											(text as unknown) as DynamicObject<string>
									  ).join(', ')
									: (text as string)
							}
							trimmed={Boolean(trimmed)}
						/>
					))}
				</S.Container>
			) : (
				<S.Container>
					{Object.entries(data).map(([key, text], index) => (
						<OpSummaryItem
							touchable={Boolean(touchable)}
							onPress={() => {
								typeof onPress === 'function' && onPress(text as string);
							}}
							key={key}
							header={key}
							type={key as OpportunityCategoriesEnum}
							index={index}
							text={
								/*
								 * We need to convert verticals object to comma-separated values.
								 * */
								key === OpportunityCategoriesEnum.VERTICAL
									? Object.keys(
											(text as unknown) as DynamicObject<string>
									  ).join(', ')
									: (text as string)
							}
							trimmed={Boolean(trimmed)}
						/>
					))}
				</S.Container>
			)}
		</>
	);
};

const S: any = {};
S.Container = styled.ScrollView`
	width: 100%;
`;

export default OpSummary;
