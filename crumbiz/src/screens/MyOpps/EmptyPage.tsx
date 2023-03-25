import React, { FC } from 'react';
import styled from 'styled-components/native';
import { calcWidth, calcHeight } from '../../utils/dimensions';
import { Icons, CustomText } from '../../components/Shared';

interface IProps {
	title: string;
	text: string;
}
const EmptyPage: FC<IProps> = props => {
	const { title, text } = props;
	return (
		<S.Container>
			<S.NoContentImage />
			<S.Title text={title} />
			<S.Text text={text} />
		</S.Container>
	);
};

const S: any = {};

S.Container = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
	margin-top: ${calcHeight(90)}
	padding-left: ${calcWidth(29)};
	padding-right: ${calcWidth(29)};
`;

S.NoContentImage = styled(Icons.EmptyOppsIcon).attrs({
	width: calcWidth(135)
})`
	aspect-ratio: 1.28;
`;
S.Title = styled(CustomText).attrs({
	size: 's16',
	lineHeight: 23
})`
	margin-top: ${calcHeight(30)};
`;
S.Text = styled(CustomText).attrs({
	color: 'gray15',
	size: 's13',
	lineHeight: 23
})`
	margin-top: ${calcHeight(10)};
	text-align: center;
`;
export default EmptyPage;
