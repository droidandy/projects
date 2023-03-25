import React, { useMemo } from 'react';
import styled from 'styled-components/native';
import { IOppTargetDetails } from '../../../../../../types/interfaces';
import TargetProfileRow from './TargetProfileRow';

interface IProps {
	targets: Array<IOppTargetDetails>;
}
const VerticalProfilesList: React.FC<IProps> = props => {
	const { targets } = props;

	const _render = useMemo(() => {
		return targets.map((target, index) => (
			<TargetProfileRow targetData={target} key={index} />
		));
	}, [targets]);

	return <S.Container>{_render}</S.Container>;
};

const S: any = {};
S.Container = styled.View``;

export default VerticalProfilesList;
