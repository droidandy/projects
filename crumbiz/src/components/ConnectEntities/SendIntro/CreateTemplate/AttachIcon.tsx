import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import { calcWidth, deviceWidth } from '../../../../utils/dimensions';
import { Icons, RoundedIcon } from '../../../Shared';
import {
	useCaptureBackButton,
	useEffectAfterMount,
	useInterpolationGroup,
	useTheme
} from '../../../../hooks';
import { Animated } from 'react-native';
import { AttachmentTypesEnum } from '../../../../types/enums';
import { createShadow } from '../../../../utils';

interface IProps {
	onAttachOptionPress?(key: AttachmentTypesEnum): any;
}
const AttachIcon: React.FC<IProps> = props => {
	const theme = useTheme();
	const attachOptions = useMemo(
		() => [
			{ key: AttachmentTypesEnum.PHONE_NUMBER, icon: Icons.ContactIcon },
			{ key: AttachmentTypesEnum.FILE, icon: Icons.DocIcon },
			{ key: AttachmentTypesEnum.LINK, icon: Icons.LinkIcon }
		],
		[]
	);
	const [isExpanded, setExpanded] = useState(false);
	const animated = useRef(new Animated.Value(0)).current;
	const interpolationGroup = useInterpolationGroup({
		animatedValue: animated,
		inputRange: [0, 1],
		groups: {
			translateX: [-deviceWidth / 5.4, 0],
			opacity: [0, 1]
		}
	});
	const { onAttachOptionPress } = props;

	useEffectAfterMount(() => {
		Animated.spring(animated, {
			toValue: isExpanded ? 1 : 0,
			bounciness: 5,
			useNativeDriver: true
		}).start();
	}, [isExpanded]);

	return (
		<S.Container>
			<S.AttachIcon
				touchable
				size={calcWidth(60)}
				icon={Icons.AttachIcon}
				gradientColor='darkGray'
				onPress={() => setExpanded(oldIsExpanded => !oldIsExpanded)}
			/>

			<S.AttachOptionsContainer>
				{attachOptions.map(({ icon, key }, i) => (
					<Animated.View
						key={i}
						style={{
							opacity: interpolationGroup.opacity,
							transform: [
								{
									translateX: Animated.multiply(
										interpolationGroup.translateX,
										i + 1
									)
								}
							]
						}}
					>
						<S.AdditionalIcon
							touchable
							iconSize={deviceWidth * 0.0657}
							size={calcWidth(60)}
							icon={icon}
							backgroundColor={theme.colors.white}
							onPress={() =>
								typeof onAttachOptionPress === 'function' &&
								onAttachOptionPress(key)
							}
						/>
					</Animated.View>
				))}
			</S.AttachOptionsContainer>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.TouchableOpacity`
	flex-direction: row;
	margin-bottom: 20;
	margin-left: 23;
`;

S.AttachIcon = styled(RoundedIcon)`
	z-index: 1;
`;

S.AdditionalIcon = styled(RoundedIcon)`
	${createShadow()};
`;

S.AttachOptionsContainer = styled.View`
	flex-direction: row;
	flex: 1;
	justify-content: space-around;
	padding-right: 20;
	padding-left: 10;
`;

export default AttachIcon;
