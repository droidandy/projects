import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '../../../hooks';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { TextInput } from '../../../components/Shared/Form@2.0';
import { deviceWidth, deviceHeight } from '../../../utils/dimensions';
import { CustomText, Button, Icons } from '../../../components/Shared';

interface IWorkExperience {
	companyName: string;
	position: string;
}

interface IProps {
  firstExperience: IWorkExperience
}

const WorkExperience: React.FC<IProps> = props => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { firstExperience } = props;
  const [ position, setPosition ] = useState('');
  const [companyName, setCompanyName ] = useState('');
  const [showNewExperienceForm, setShowNewExperienceForm ] = useState(false);
  const [ 
    allExperience, 
    setAllExperience 
  ] = useState<Array<IWorkExperience>>([firstExperience]);

  return (
    <>
      {allExperience.map(e => (
        <>
          <S.ExperienceContainer>
            <S.ExperienceIcon>
              <Icons.BriefcaseIcon
                fill={theme.colors.paleBlue1}
                width={deviceWidth * 0.05}
                height={deviceHeight * 0.025}
              />
            </S.ExperienceIcon>
            <View>
              <CustomText bold text={e.companyName} />
              <CustomText text={e.position} />
            </View>
          </S.ExperienceContainer>
          <S.LineContainer>
            <S.Line />
          </S.LineContainer>
        </>
      ))}
      <S.AddMoreButton
        textSize={14}
        textAlign='left'
        alignSelf='baseline'
        width={deviceWidth * 0.3}
        height={deviceHeight * 0.04}
        textColor={theme.colors.darkerBlue1}
        backgroundColor={theme.colors.white}
        text={t('myProfile.workExperience.addMoreButton')}
        onPress={() => setShowNewExperienceForm(oldState => !oldState)}
      />
    {showNewExperienceForm ? (
      <>
        <S.Input
          textSize={15}
          maxLength={40}
          value={companyName}
          textColor={theme.colors.black}
          marginBottom={deviceHeight * 0.06}
          onChange={(text: string) => setCompanyName(text)}
          placeholder={t('myProfile.workExperience.companyName')}
        />
        <S.Input
          value={position}
          textSize={15}
          maxLength={40}
          textColor={theme.colors.black}
          marginBottom={deviceHeight * 0.03125}
          onChange={(text: string) => setPosition(text)}
          placeholder={t('myProfile.workExperience.position')}
        />
        <Button
          textSize={14}
          borderRadius='25px'
          alignSelf='flex-end'
          width={deviceWidth * 0.18}
          height={deviceHeight * 0.04}
          textColor={theme.colors.black}
          backgroundColor={theme.colors.gray12}
          text={t('myProfile.workExperience.addButton')}
          onPress={() => {
            setShowNewExperienceForm(oldState => !oldState);
            setAllExperience([...allExperience, {
              companyName: companyName,
              position: position
            }]);
            setPosition('');
            setCompanyName('');
          }}
        />
      </> 
    ) : null}
    </>
  )
};

const S: any = {};
S.ExperienceContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: stretch;
  background-color: ${({ theme }) => theme.colors.white};
`;

S.ExperienceIcon = styled.View`
  margin-top: ${deviceHeight * 0.003};
  margin-right: ${deviceWidth * 0.0277};
`;

S.LineContainer = styled.View`
  flex-direction: row;
  align-items: flex-end;
  height: ${deviceHeight * 0.01875};
  margin-bottom: ${deviceHeight * 0.025};
`;

S.Line = styled.View`
  width: 100%;
  height: ${deviceHeight * 0.0015625};
  background-color: ${({ theme }) => theme.colors.gray12};
`;

S.AddMoreButton = styled(Button)`
  margin-bottom: ${deviceHeight * 0.026875};
`;

S.Input = styled(TextInput)`
  border-top-width: 0;
  border-left-width: 0;
  border-right-width: 0;
  font-size: ${({ theme }) => theme.fontSizes.s15};
  border-bottom-color: ${({ theme }) => theme.colors.gray16};
`;

export default WorkExperience;
    