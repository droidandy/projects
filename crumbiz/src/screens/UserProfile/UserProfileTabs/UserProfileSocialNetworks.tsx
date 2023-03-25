import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import { Icons, CustomText, RoundedIcon } from '../../../components/Shared';
import { useTheme } from '../../../hooks';
import { deviceWidth, deviceHeight, calcFontSize } from '../../../utils/dimensions';
import { createShadow } from '../../../utils';

//TODO YARON - Integration of linkedIn, Twitter, and faceBook with Redux

const UserProfileSocialNetworks: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const linkedIn = 'linkedIn';
  const twitter = 'twitter';
  const faceBook = 'faceBook';

  const dynamicSocialnetworks = useMemo(() => {
		const _dynamicSocialnetworks = [{
        size: 0,
        iconSize: 0,
        fill: '',
        icon: Icons.LinkedIcon,
        backgroundColor: ''
    }]

    if (linkedIn) {
      _dynamicSocialnetworks.push({
        size: 40,
        iconSize: 16,
        fill: 'white',
        icon: Icons.LinkedIcon,
        backgroundColor: theme.colors.linkedInButtonColor
      });
    }
    if (twitter) {
      _dynamicSocialnetworks.push({
        fill: 'white',
        size: 40,
        icon: Icons.TwitterIcon,
        iconSize: 20,
        backgroundColor: theme.colors.babyBlue1
      });
    }
    if (faceBook) {
      _dynamicSocialnetworks.push({
        fill: 'white',
        size: 40,
        icon: Icons.FaceBookLetterFIcon,
        iconSize: 19,
        backgroundColor: theme.colors.facebookButtonColor
      });
    }

    return _dynamicSocialnetworks;
  
  }, []);

  return (
    <>
      <CustomText bold text={t(`userProfile.tabs.bioTab.socialNetworks`)} />
      <S.SocialNetworksIconContainer>
        {dynamicSocialnetworks.map((network, index) =>
          <S.Icon
            key={index}
            fill={network.fill}
            size={calcFontSize(network.size)}
            icon={network.icon}
            iconSize={calcFontSize(network.iconSize)}
            backgroundColor={network.backgroundColor}
          />
        )}
      </S.SocialNetworksIconContainer>
      <S.LineContainer>
        <S.Line />
      </S.LineContainer>
    </>
  )
};

const S: any = {};
S.Container = styled.View`
	flex: 1;
`;

S.SocialNetworksIconContainer = styled.View`
  flex-direction: row;
  margin-top: ${deviceHeight * 0.0171875};
`;

S.Icon = styled(RoundedIcon)`
  margin-right: ${deviceWidth * 0.0333};
  ${createShadow({ elevation: 8 })};
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

export default UserProfileSocialNetworks;