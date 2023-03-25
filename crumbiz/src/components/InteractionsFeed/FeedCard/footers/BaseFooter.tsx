import React from 'react';
import { IVInteraction } from '../../../../types/interfaces';
import styled from 'styled-components/native';
import { CustomText } from '../../../Shared';
import { IColors, IFontSizes } from '../../../../types/styled';
import useRole from '../../../../hooks/useRole';

interface IFooterStyles {
	backgroundColor?: string;
	fontWeight?: string;
	fontSize?: keyof IFontSizes;
	color?: keyof IColors;
};

interface IProps {
	interaction: IVInteraction;
	styles?: IFooterStyles;
	showRole: boolean;
};

const BaseFooter: React.FC<IProps> = (props) => {
	const { interaction, styles = {}, showRole } = props;
	const role = useRole(interaction);

	const textStyles = {
		color: styles.color,
		size: styles.fontSize,
		bold: styles.fontWeight === 'bold'
	};

	return (
		<S.Container backgroundColor={styles.backgroundColor}>
			<CustomText
				text={interaction.title}
				{...textStyles}
			/>
			{showRole && (
				<CustomText
					text={`Your role: ${role}`}
					{...textStyles}
				/>
			)}
		</S.Container>
	)
}

BaseFooter.defaultProps = {
	showRole: true
};

const S: any = {};
S.Container = styled.View`
	width: 100%;
	flex: 1;
	align-items: flex-start;
	${({ backgroundColor }: { backgroundColor: string }) => `
		background-color: ${backgroundColor};
	`}
`;

export default BaseFooter;
