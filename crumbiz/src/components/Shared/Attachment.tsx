import React from 'react';
import styled from 'styled-components/native';
import CustomText from './CustomText';
import Icons from './Icons';
import Typography from './Typography';
import { calcRatio } from '../../utils';
import { calcWidth } from '../../utils/dimensions';
import { IStyle } from '../../types/interfaces';
import { AttachmentTypesEnum } from '../../types/enums';

const iconsMap = {
	[AttachmentTypesEnum.FILE]: Icons.NoteIcon,
	[AttachmentTypesEnum.PHONE_NUMBER]: Icons.ContactIcon,
	[AttachmentTypesEnum.LINK]: Icons.LinkIcon,
	[AttachmentTypesEnum.LOCATION]: Icons.LocationIcon
};

interface IProps extends IStyle {
	type: AttachmentTypesEnum;
	text: string;
	onRemoveButtonPress?(key: AttachmentTypesEnum): any;
	showRemoveButton?: boolean;
}

const Attachment: React.FC<IProps> = props => {
	const { type, text, style, showRemoveButton, onRemoveButtonPress } = props;
	// @ts-ignore
	const Icon = iconsMap[type];
	return (
		<S.Container style={style}>
			<Icon height={23} width={20} />
			<CustomText text={text} size='s15' withLeftGap />

			{showRemoveButton && (
				<S.RemoveButton
					onPress={() =>
						typeof onRemoveButtonPress === 'function' &&
						onRemoveButtonPress(type)
					}
				>
					<Icons.XIcon />
				</S.RemoveButton>
			)}
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	width: 100%;
	aspect-ratio: ${calcRatio({ width: 311, height: 54 })};
	background: ${({ theme }) => theme.colors.gray12};
	flex-direction: row;
	align-items: center;
	border-radius: 13px;
	padding-horizontal: ${calcWidth(12)};
	margin-bottom: 10;
`;

S.Text = styled(Typography.Text)``;

S.RemoveButton = styled.TouchableOpacity`
	position: absolute;
	padding-vertical: 20;
	padding-horizontal: 20;
	right: 0;
`;

export default Attachment;
