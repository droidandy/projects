import React, { useMemo } from 'react';
import styled from 'styled-components/native';
import {
	IOppTargetDetails,
	PlainFunction
} from '../../../../../../types/interfaces';
import TargetProfile from './TargetProfile/TargetProfile';
import { deviceWidth } from '../../../../../../utils/dimensions';

interface IProps {
	targets: Array<IOppTargetDetails>;
	handleOppOverviewRefresh: PlainFunction;
}

const HorizontalProfilesList: React.FC<IProps> = props => {
	const { targets, handleOppOverviewRefresh } = props;
	const isSingleCard = targets.length <= 1;
	const _render = useMemo(() => {
		return targets.map((target, index) => (
			<TargetProfile
				targetData={target}
				key={index}
				singleCard={isSingleCard}
				handleOppOverviewRefresh={handleOppOverviewRefresh}
			/>
		));
	}, [targets]);

	return (
		<S.Container
			horizontal
			showsHorizontalScrollIndicator={false}
			scrollEnabled={!isSingleCard}
		>
			{_render}
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.ScrollView``;

export default HorizontalProfilesList;
