import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import {
  Icons,
  CustomText,
  PaddingHorizontalContainer
} from '../../../components/Shared';
import UserProfileNoDataProvided from './UserProfileNoDataProvided';
import { useTheme } from '../../../hooks';
import { View } from 'react-native';
import { deviceWidth, deviceHeight } from '../../../utils/dimensions';
import UserProfileSocialNetworks from './UserProfileSocialNetworks';

const BioTab: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const linkedIn = 'linkedIn';
  const twitter = 'twitter';
  const faceBook = 'faceBook';

  //TODO YARON - Integration of Temp_Bio_Info and linkedIn, Twitter, and faceBook with Redux
  
  const TEMP_BIO_INFO = useMemo(() => {
		const _dynamicInfo = {
      workExperience: [
        {
          companyName: 'Microsoft',
          position: 'Full Stack Developer'
        },
        {
          companyName: 'Google',
          position: 'Senior Developer'
        }
      ],
      aboutMe: 'Experienced fullstack developer, proficient in JS-frameworks as React and Angular (4-6), backend solutions as Mode.JS, Python, php5, and many relative technologies and tools. High level of self-learning, problem-solving skills and clear communication abilities.'
    }

    return _dynamicInfo;
  
  }, []);

  const didUserAddSocialNetworks = linkedIn !== '' && twitter !== '' && faceBook !== '';

  const shouldDisplayNoDataView = 
    didUserAddSocialNetworks && TEMP_BIO_INFO.workExperience.length === 0 && TEMP_BIO_INFO.aboutMe === '';

	const _render = useMemo(() => {
    return (
      <>
        {didUserAddSocialNetworks ? <UserProfileSocialNetworks /> : null }
        <S.ExperienceHeader bold text={t(`userProfile.tabs.bioTab.workExperience`)} />
        {TEMP_BIO_INFO.workExperience.map((singleExperience, index: number) => (
          <S.ExperienceContainer key={index}>
            <S.ExperienceIcon>
              <Icons.BriefcaseIcon
                fill={theme.colors.paleBlue1}
                width={deviceWidth * 0.05}
                height={deviceHeight * 0.025}
              />
            </S.ExperienceIcon>
            <View>
              <CustomText
                bold
                size='s14'
                text={t(singleExperience.companyName)}
              />
              <CustomText
                size='s14'
                text={t(singleExperience.position)}
              />
            </View>
          </S.ExperienceContainer>
        ))}

        <S.LineContainer>
          <S.Line />
        </S.LineContainer>

        <S.AboutMeHeader text={t('userProfile.tabs.bioTab.aboutMe')} />
        <CustomText size='s14' text={t(TEMP_BIO_INFO.aboutMe)} />
      </>
  )}, [TEMP_BIO_INFO]);

	return (
		<S.Container>
			<PaddingHorizontalContainer>
				{shouldDisplayNoDataView ? 	<UserProfileNoDataProvided /> :	_render}
			</PaddingHorizontalContainer>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	flex: 1;
`;

S.ExperienceHeader = styled(CustomText)`
  margin-bottom: ${deviceHeight * 0.0172};
`;

S.ExperienceContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: stretch;
  margin-bottom: ${deviceHeight * 0.017};
  background-color: ${({ theme }) => theme.colors.white};
`;

S.ExperienceIcon = styled.View`
  margin-top: ${deviceHeight * 0.003};
  margin-right: ${deviceWidth * 0.0277};
`;

S.AboutMeHeader = styled(CustomText)`
  margin-bottom: ${deviceHeight * 0.0172};
`;

S.LineContainer = styled.View`
  flex-direction: row;
  align-items: flex-end;
  height: ${deviceHeight * 0.01875};
  margin-top: ${deviceHeight * 0.03};
  margin-bottom: ${deviceHeight * 0.025};
`;

S.Line = styled.View`
  width: 100%;
  height: ${deviceHeight * 0.0015625};
  background-color: ${({ theme }) => theme.colors.gray16};
`;

export default BioTab;