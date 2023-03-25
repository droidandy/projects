import { IVInteraction } from '../types/interfaces';
import { getUserDataSelector } from '../store/selectors/authSelector';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export default (interaction: IVInteraction): string => {
	const user = useSelector(getUserDataSelector);

	const { t } = useTranslation();

	switch (user.id) {
		case interaction.ownerUserId: {
			return t('opps.selectRole.Initiator');
		}
		case interaction.targetUserId: {
			return t('global.target');
		}
		case interaction.connectorUserId: {
			return t('global.connector');
		}
		default: {
			return interaction.role?.toLocaleLowerCase() || '';
		}
	}
};
