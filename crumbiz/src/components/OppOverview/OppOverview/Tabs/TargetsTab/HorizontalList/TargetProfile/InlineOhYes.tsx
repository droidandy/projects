import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import { Text } from 'react-native';
import { CustomText } from '../../../../../../Shared';
import { CancelButton } from '../../../../../index';
import { deviceHeight } from '../../../../../../../utils/dimensions';
import { PlainFunction } from '../../../../../../../types/interfaces';

interface IProps {
	onCancel: PlainFunction;
}
const InlineOhYes: React.FC<IProps> = props => {
	const { t } = useTranslation();

	return (
		<S.Container>
			<CustomText text={t('oppOverview.targetProfile.ohYes')} size='s24' bold />
			<CustomText text={t('oppOverview.targetProfile.newStage')} size='s14' />
			<S.CancelButton onCancel={props.onCancel} />
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
`;

S.CancelButton = styled(CancelButton)`
	width: ${deviceHeight * 0.1671875};
	aspect-ratio: 3.05714285714;
`;

export default InlineOhYes;
