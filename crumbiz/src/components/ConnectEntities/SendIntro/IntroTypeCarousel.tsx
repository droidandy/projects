import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import Icons from '../../Shared/Icons';
import { Elevated } from '../../Shared';
import { calcWidth } from '../../../utils/dimensions';
import TemplateCard from './TemplateCard';
import { useTheme } from '../../../hooks';
import { ITemplate } from '../../../types/interfaces';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { SendIntroContext } from '../../../screens/ConnectEntities/sendntroContext';
import { SendIntroModalContentEnum } from '../../../screens/ConnectEntities/sendIntroEnum';

interface IProps {
	templates: Array<ITemplate>;
}

const IntroTypeCarousel: React.FC<IProps> = props => {
	const { templates } = props;
	const { t } = useTranslation();
	const theme = useTheme();

	const {
		setCurrentModalContent,
		setCurrentModalContentType,
		setModalOpen
	} = useContext(SendIntroContext);

	const createIntroOptions = useMemo(() => {
		return [
			{
				icon: Icons.PlusIcon,
				text: t('connectEntities.sendIntro.newIntro'),
				modalContent: SendIntroModalContentEnum.TEMPLATE
			},
			{
				icon: Icons.MicrophoneIcon,
				text: t('connectEntities.sendIntro.recordIntro'),
				modalContent: SendIntroModalContentEnum.RECORD_AUDIO
			}
		];
	}, []);

	return (
		<S.Container horizontal showsHorizontalScrollIndicator={false}>
			{templates.map((template: ITemplate, index: number) => (
				<TemplateCard
					key={index}
					isFavorite={Boolean(index % 2)}
					headerText={template.title}
					templateText={template.body}
					templateId={template.id!}
					numberTextLines={7}
					onPress={() => {
						setCurrentModalContentType &&
							setCurrentModalContentType(SendIntroModalContentEnum.TEMPLATE);
						setCurrentModalContent && setCurrentModalContent(template);
						setModalOpen && setModalOpen(true);
					}}
				/>
			))}
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.ScrollView``;

S.CreateIntroCardsContainer = styled.View`
	margin-left: ${({ theme }) => calcWidth(theme.viewPaddingHorizontal)};
`;

S.CreateIntroCard = styled(Elevated)`
	width: ${calcWidth(144)};
	height: ${heightPercentageToDP('24.6875%')};
	margin-bottom: ${heightPercentageToDP('3.59375%')};
	align-items: center;
	justify-content: center;
`;

export default IntroTypeCarousel;
