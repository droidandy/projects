import React, { useMemo } from 'react';
import { IVInteraction } from '../../../types/interfaces';
import styled from 'styled-components/native';
import { deviceHeight, deviceWidth } from '../../../utils/dimensions';
import { StructureBuilder } from './builder';
import { createShadow } from '../../../utils';
import { useTheme } from '../../../hooks';
import LinearGradient from 'react-native-linear-gradient';

interface IProps {
	interaction: IVInteraction;
	structureBuilder: StructureBuilder;
}

const FeedCard: React.FC<IProps> = ({ structureBuilder, interaction }) => {
	const theme = useTheme();

	const cardStructure = useMemo(() => {
		return structureBuilder.build(interaction);
	}, [structureBuilder, interaction]);

	const cardStyles = useMemo(() => {
		return structureBuilder.getStyles(theme);
	}, [structureBuilder, theme]);

	const { header: Header, body: Body, footer: Footer } = cardStructure;
	const {
		container: containerStyles,
		header: headerStyles,
		body: bodyStyles,
		footer: footerStyles
	} = cardStyles;

	return (
		<S.ShadowContainer>
			<S.Container {...containerStyles}>
				{containerStyles.backgroundImage && (
					<containerStyles.backgroundImage
						width='100%'
						height='100%'
						style={{ position: 'absolute' }}
					/>
				)}
				<S.Content>
					{Header && <Header styles={headerStyles} />}
					{Body && <Body styles={bodyStyles} />}
					{Footer && <Footer styles={footerStyles} />}
				</S.Content>
			</S.Container>
		</S.ShadowContainer>
	);
};

const S: any = {};

S.ShadowContainer = styled.View`
	/* Shadow must apply to the outer container in order to fix both IOS and Android */
	margin-bottom: ${deviceHeight * 0.03125};
	border-radius: 10px;
	background-color: white;
	${createShadow({
		color: 'black',
		elevation: 8,
		opacity: 0.25,
		radius: 5
	})}
`;
S.Container = styled(LinearGradient)`
	position: relative;
	border-radius: 10px;
	background-color: ${({ backgroundColor }: { backgroundColor: string }) =>
		backgroundColor};
`;

S.Content = styled.View`
	padding-vertical: ${deviceHeight * 0.031};
	padding-horizontal: ${deviceWidth * 0.055};
`;

export default FeedCard;
