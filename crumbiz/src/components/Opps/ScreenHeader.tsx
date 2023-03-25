import React from 'react';
import styled from 'styled-components/native';
import { CustomText } from '../Shared';
import { verticalScale } from '../../utils/dimensions';

interface IProps {
	pre: string;
	header: string;
	alignment?: string;
	marginTop?: number;
	marginBottom?: number;
	headerMarginTop?: number;
}
const ScreenHeader: React.FC<IProps> = props => {
	const {
		pre,
		header,
		alignment,
		marginTop,
		marginBottom,
		headerMarginTop
	} = props;
	return (
		<S.TextContainer style={{ alignItems: alignment, marginTop, marginBottom }}>
			<CustomText text={pre} size='s16' lineHeight={23} />
			<CustomText
				text={header}
				style={{ marginTop: headerMarginTop }}
				size='s22'
				bold
				lineHeight={32}
			/>
		</S.TextContainer>
	);
};

ScreenHeader.defaultProps = {
	alignment: 'center',
	marginTop: verticalScale(80)
};

const S: any = {};
S.TextContainer = styled.View`
	width: 100%;
`;

export default ScreenHeader;
