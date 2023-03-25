import React from 'react';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { deviceHeight } from '../../../utils/dimensions';
import { Icons, CustomText } from '../../../components/Shared';

const UserProfileNoDataProvided: React.FC = () => {
  const { t } = useTranslation();

	return (
		<S.Container>
      <Icons.noTargetIcon />
      <CustomText
        size='s16'
        withTopGap
        text={t('userProfile.noDataProvided.header')}
      />
    </S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	flex: 1;
  align-items: center;
  padding-vertical: ${deviceHeight * 0.06};
`;

export default UserProfileNoDataProvided;
