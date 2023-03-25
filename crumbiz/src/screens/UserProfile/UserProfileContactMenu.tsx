import React, { useMemo } from 'react';
import { deviceWidth } from '../../utils/dimensions';
import { Icons, RoundedIcon } from '../../components/Shared';
import { IUserExpandedWithRelationships } from '../../types/interfaces';
import Communications from 'react-native-communications';

interface IProps {
  user: IUserExpandedWithRelationships
}

const UserProfileContactMenu: React.FC<IProps> = ({ user }) => {
  const destructUserPhoneNumber = (userPhones: [{ phone: string }]) => {
		if(userPhones[0]){
			const {	phone } = userPhones[0];
			return { phone: phone || '' };
		}
		return { phone: '' };
	};

	const userPhoneNumber = destructUserPhoneNumber(user.userPhones).phone;

	const contactButtonInfo = useMemo(() => {
		return [
			{
				icon: Icons.TelephoneIcon,
				action: () => Communications.phonecall(userPhoneNumber, true)
			},
			{
				icon: Icons.ChatIcon,
				action: () => Communications.text(userPhoneNumber, null)
			},
			{
				icon: Icons.MailIcon,
				action: () => Communications.email([user.email], null, null, null, null)
			}
		];
  }, [userPhoneNumber, user.email]);
  
  return (
    <>
      {userPhoneNumber ? (
				contactButtonInfo.map((button, index) => (
					<RoundedIcon
						key={index}
						size={deviceWidth * 0.1}
						icon={button.icon}
						iconSize={20}
						fill='darkerBlue1'
						backgroundColor='transparent'
						touchable={true}
						onPress={button.action}
					/>
      ))) : (
					<RoundedIcon
						size={deviceWidth * 0.1}
						icon={Icons.MailIcon}
						iconSize={20}
						fill='darkerBlue1'
						backgroundColor='transparent'
						touchable={true}
						onPress={() => {
							Communications.email(
								[user.email], null, null, null, null
							)}
						}
					/>
			)}
    </>
  )
};

export default UserProfileContactMenu;