import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import { deviceHeight, deviceWidth } from '../../utils/dimensions';
import { CustomText, Icons } from '../../components/Shared';
import { useTheme } from '../../hooks';
import { StateUpdaterFunction } from '../../types/interfaces';
// @ts-ignore
import ToggleSwitch from 'toggle-switch-react-native';
import { createShadow } from '../../utils';

interface IProps {
	visible: boolean;
	setVisible: StateUpdaterFunction<boolean>;
}

const UserProfileThreeDotsMenu: React.FC<IProps> = props => {
	const { t } = useTranslation();
	const theme = useTheme();
	const [ shouldGetNotifications, setGetNotifications ] = useState(false);
	const { visible } = props;

	return (
		<S.Container>
      {visible && (
        <S.ThreeDotsMenu>
          <S.MenuItem>
            <CustomText size='s14' text={t('userProfile.dropMenu.askBeforeIntro')} />
            <ToggleSwitch
              size='small'
              isOn={shouldGetNotifications}
              offColor={theme.colors.gray16}
              onColor={theme.colors.darkerBlue1}
              onToggle={() => setGetNotifications(oldState => !oldState)}
            />
          </S.MenuItem>
              <S.MenuItem>
                <CustomText size='s14' text={t('userProfile.dropMenu.createOpp')} />
                <Icons.PlusCircleIcon
                  fill={theme.colors.black}
                  width={deviceWidth * 0.0555}
                  height={deviceHeight * 0.03125}
                />
              </S.MenuItem>
        </S.ThreeDotsMenu>
      )}
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
  position: absolute;
  right: 10;
  top: 10;
`;

S.ThreeDotsMenu = styled.View`
	background: white;
	border-radius: 7px;
  ${createShadow({ elevation: 8 })};
	width: ${deviceWidth * 0.58888888888};
  padding-top: ${deviceHeight * 0.03125};
	padding-horizontal: ${deviceWidth * 0.04444444444};
`;

S.MenuItem = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin-bottom: ${deviceHeight * 0.03125};
`;

export default UserProfileThreeDotsMenu;