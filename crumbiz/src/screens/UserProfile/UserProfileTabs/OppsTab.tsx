import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../../hooks';
import styled from 'styled-components/native';
import FilterButton from '../../../screens/Relationships/FilterButton';
import {
	PaddingHorizontalContainer,
	CustomText,
	Icons,
	MagnetLoader
} from '../../../components/Shared';
import OppsItems from '../../../screens/MyOpps/OppsItems';
import { useSelector, useDispatch } from 'react-redux';
import { oppsSelector } from '../../../store/selectors/oppsSelector';
import { getMyOpps } from '../../../store/actions/myOppsActions';
import { getUserDataSelector } from '../../../store/selectors/authSelector';
import { calcWidth, calcHeight } from '../../../utils/dimensions';
import { useTranslation } from 'react-i18next';

const OppsTab: React.FC = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { opps, isLoading } = useSelector(oppsSelector);
	const userData = useSelector(getUserDataSelector);
	const [filterIndicator, setFilterIndicator] = useState<boolean>(false);

	useEffect(() => {
		dispatch(getMyOpps(userData.id));
	}, []);

	const _oppItems = () => (
		<>
			<S.Header>
				<CustomText
					size='s12'
					lineHeight={18}
					color='paleBlue1'
					text={`${opps.length} Opportunities found`}
				/>
				<FilterButton isActive={filterIndicator} onPress={() => {}} />
			</S.Header>
			<OppsItems data={opps} />
		</>
	);

	const _emptyContent = () => {
		return (
			<S.EmptyContentContainer>
				<Icons.noTargetIcon
					width={calcWidth(135)}
					style={{ aspectRatio: 1.28 }}
				/>
				<S.NoOppsHeader text={t('myOpps.noOpps.headerText')} />
				<S.NoOppsText text={t('myOpps.noOpps.text')} />
			</S.EmptyContentContainer>
		);
	};

	const _renderContent = useMemo(() => {
		return isLoading ? (
			<MagnetLoader />
		) : opps && opps.length ? (
			_oppItems()
		) : (
			_emptyContent()
		);
	}, [opps, isLoading]);

	return (
		<S.Container>
			<PaddingHorizontalContainer style={{ width: '100%' }}>
				{_renderContent}
			</PaddingHorizontalContainer>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	flex: 1;
	background-color: ${({ theme }) => theme.colors.white};
`;

S.Header = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;

S.EmptyContentContainer = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
	padding-left: ${calcWidth(29)};
	padding-right: ${calcWidth(29)};
`;

S.NoOppsHeader = styled(CustomText).attrs({
	size: 's16',
	lineHeight: 23
})`
	margin-top: ${calcHeight(30)};
`;
S.NoOppsText = styled(CustomText).attrs({
	color: 'gray15',
	size: 's13',
	lineHeight: 23
})`
	margin-top: ${calcHeight(10)};
	text-align: center;
`;

export default OppsTab;
