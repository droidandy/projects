import React, { FunctionComponent } from 'react';
import styled from 'styled-components/native';
import { CustomText } from '../../../Shared';
import { deviceHeight } from '../../../../utils/dimensions';

interface IProps {
	icon: FunctionComponent;
	title: string;
	description: string;
}

const NoDataView: React.FC<IProps> = props => {
	const { icon: Icon, title, description } = props;
	return (
		<S.Container>
			<S.ImageContainer>
				<Icon />
			</S.ImageContainer>
			<S.TitleContainer text={title} bold size='s16' />
			<S.DescriptionContainer>
				<CustomText text={description} size='s13' color='gray13' light center />
			</S.DescriptionContainer>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	width: 100%;
	background-color: ${({ theme }) => theme.colors.white};
	border-radius: 18px;
	flex-direction: column;
	align-items: center;
`;

S.ImageContainer = styled.View`
	aspect-ratio: 1;
	align-items: center;
	justify-content: center;
	margin-top: ${deviceHeight * 0.0976};
`;

S.TitleContainer = styled(CustomText)`
	margin-top: ${deviceHeight * 0.0453};
`;

S.DescriptionContainer = styled.View`
	width: 45%;
	margin-top: ${deviceHeight * 0.01};
`;

export default NoDataView;
