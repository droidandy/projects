import React, { useState, useMemo } from 'react';
import styled, { css } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { IStackNavigation } from '../../types/interfaces';
import { OppsScreenHeader } from '../../components/Opps';
import i18n from '../../locale/i18n';
import { Card, Icons, HeaderMenu, Button } from '../../components/Shared';
import { useDispatch } from 'react-redux';
import { updateOpportunity } from '../../store/actions/createOpportunityActions';
import { EntityEnum } from '../../types/enums';
import {
	moderateScale,
	verticalScale,
	deviceWidth,
	deviceHeight
} from '../../utils/dimensions';
import { StatusBar } from 'react-native';
import { useTheme } from '../../hooks';
import { ScreensEnum } from '../../navigation/screens';

interface IProps extends IStackNavigation {}

const TEMP_ROLES = [
	{
		icon: Icons.InitiatorIcon,
		intro: i18n.t('opps.selectRole.intro'),
		title: i18n.t('opps.selectRole.Initiator'),
		roleKey: EntityEnum.OWNER
	},
	{
		icon: Icons.ConnectorIcon,
		intro: i18n.t('opps.selectRole.intro'),
		title: i18n.t('opps.selectRole.Connector'),
		roleKey: EntityEnum.CONNECTOR
	}
];

const SelectYourRole: React.FC<IProps> = ({ navigation }) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [selectedRole, setSelectedRole] = useState(EntityEnum.TARGET);
	const [hasRoleBeenSelected, setHasRoleBeenSelected] = useState(false);

	return (
		<S.Container>
			<StatusBar backgroundColor={theme.colors.white} barStyle='dark-content' />
			<HeaderMenu
				leftIcon={{ iconColor: 'black' }}
				rightIcon={{
					iconColor: 'black',
					onPress: () =>
						navigation.navigate(ScreensEnum.DELETE_CREATE_OPP_INFO_MODAL),
					icon: Icons.XIcon
				}}
			/>

			<S.Header>
				<OppsScreenHeader
					pre={t('opps.selectRole.selectYour')}
					header={t('opps.selectRole.role')}
					alignment='flex-start'
					marginTop={deviceHeight * 0.0156}
				/>
			</S.Header>

			<S.CardsContainer>
				{TEMP_ROLES.map((role, i) => (
					<Card
						key={i}
						icon={role.icon}
						text={role.title}
						intro={role.intro}
						selected={role.roleKey === selectedRole}
						onPress={() => {
							setSelectedRole(role.roleKey);
							setHasRoleBeenSelected(true);
						}}
					/>
				))}
			</S.CardsContainer>
			<Button
				disabled={!hasRoleBeenSelected}
				width={deviceWidth}
				gradientBackground={hasRoleBeenSelected ? 'orange' : 'gray2'}
				gradientProps={{ useAngle: true, angle: 261 }}
				text={t('opps.businessType.buttonActionText')}
				textColor={theme.colors.white}
				onPress={() => {
					dispatch(updateOpportunity('role', selectedRole));
					navigation.navigate(ScreensEnum.OPPS_CHOOSE_ENTITY);
				}}
			/>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	background: ${({ theme }) => theme.colors.white};
	flex: 1;
`;

S.CardsContainer = styled.View`
	margin-top: ${deviceHeight * 0.05937};
	padding-horizontal: ${deviceWidth * 0.0694};
`;

S.Header = styled.View`
	padding-left: ${deviceWidth * 0.0694};
`;

export default SelectYourRole;
