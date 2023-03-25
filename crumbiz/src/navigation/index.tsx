import React from 'react';
import OldDashboard from '../screens/Dashboard';
import Login from '../screens/Authentication/Login';
import Register from '../screens/Authentication/Register';
import RestorePassword from '../screens/Authentication/RestorePassword';
import CreateNewPassword from '../screens/Authentication/CreateNewPassword';
import Onboarding from '../screens/Onboarding';
import Modal from '../screens/Modal';
import ChooseOpportunity from '../screens/Opps/ChooseOpportunity';
import OldChooseOpportunity from '../screens/Opps/__oldChooseOpportunity';
import SetOpportunityTitle from '../screens/Opps/SetOpportunityTitle';
import BusinessType from '../screens/Opps/BusinessType';
import ChooseVertical from '../screens/Opps/ChooseVertical';
import ServiceProvider from '../screens/Opps/ServiceProvider';
import SelectBudget from '../screens/Opps/SelectBudget';
import SelectYourRole from '../screens/Opps/SelectYourRole';
import OppsChooseEntity from '../screens/Opps/ChooseEntity';
import SendMessageToEntity from '../screens/Opps/SendMessageToEntity';
import OpportunityDetails from '../screens/Opps/OpportunityDetails';
import ConnectChooseEntity from '../screens/ConnectEntities/ChooseEntity';
import { fadeIn, fromTop } from 'react-navigation-transitions';
import { createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import SendIntro from '../screens/ConnectEntities/SendIntro';
import AllSet from '../screens/ConnectEntities/AllSet';
import OppOverview from '../screens/OppOverview/OppOverview';
import TargetProfile from '../screens/OppOverview/TargetProfile';
import NewOpp from '../screens/OppOverview/NewOpp';
import OppCrumb from '../screens/OppOverview/OppCrumb';
import OhYes from '../screens/OppOverview/OhYes';
import DeleteCreateOppInfoModal from '../screens/Modals/DeleteCreateOppInfo';
import TryAgainOrSignUpModal from '../screens/Modals/TryAgainOrSignUp';
import NewPasswordAllSet from '../screens/Authentication/NewPasswordAllSet';
import MyProfile from '../screens/MyProfile/MyProfile';
import ProfileSideMenu from '../screens/MyProfile/ProfileSideMenu';
import PersonalInfo from '../screens/MyProfile/ProfileData/PersonalInfo';
import SocialNetworks from '../screens/MyProfile/ProfileData/SocialNetworks';
import WorkExperience from '../screens/MyProfile/ProfileData/WorkExperiencePage';
import AboutMe from '../screens/MyProfile/ProfileData/AboutMe';
import UserProfile from '../screens/UserProfile/UserProfile';
import BottomTabNavigator from '../components/BottomTabBar';
import { ScreensEnum } from './screens';

const AuthenticationStack = createStackNavigator(
	{
		Login: {
			screen: Login
		},

		Register: {
			screen: Register
		},
		RestorePassword: {
			screen: RestorePassword
		},
		Onboarding: {
			screen: Onboarding
		},
		CreateNewPassword: {
			screen: CreateNewPassword
		},
		TryAgainOrSignUpModal: {
			screen: TryAgainOrSignUpModal
		},
		Modal: {
			screen: Modal
		},
		NewPasswordAllSet: {
			screen: NewPasswordAllSet
		}
	},
	{
		navigationOptions: {
			gesturesEnabled: false
		},
		initialRouteName: ScreensEnum.LOGIN,

		defaultNavigationOptions: {
			header: null
		}
	}
);

const CreateOpportunityStack = createStackNavigator(
	{
		ChooseOpportunity: {
			screen: ChooseOpportunity
		},
		OldChooseOpportunity: {
			screen: OldChooseOpportunity
		},
		SetOpportunityTitle: {
			screen: SetOpportunityTitle
		},
		BusinessType: {
			screen: BusinessType
		},
		ChooseVertical: {
			screen: ChooseVertical
		},
		ServiceProvider: {
			screen: ServiceProvider
		},
		SelectBudget: {
			screen: SelectBudget
		},
		SelectYourRole: {
			screen: SelectYourRole
		},
		OppsChooseEntity: {
			screen: OppsChooseEntity
		},
		SendMessageToEntity: {
			screen: SendMessageToEntity
		},
		OpportunityDetails: {
			screen: OpportunityDetails
		},
		DeleteCreateOppInfoModal: {
			screen: DeleteCreateOppInfoModal
		}
	},
	{
		initialRouteName: 'ChooseOpportunity',
		defaultNavigationOptions: {
			header: null
		},
		navigationOptions: {
			gesturesEnabled: false
		},
		headerMode: 'none'
	}
);

const ConnectEntitiesStack = createStackNavigator(
	{
		ConnectChooseEntity: {
			screen: ConnectChooseEntity
		},
		SendIntro: {
			screen: SendIntro
		},
		AllSet: {
			screen: AllSet
		}
	},
	{
		initialRouteName: 'ConnectChooseEntity',
		defaultNavigationOptions: {
			header: null
		},
		headerMode: 'none',
		navigationOptions: {
			gesturesEnabled: false
		}
	}
);

const AddNewConnectorStack = createStackNavigator(
	{
		/* This 3 screens belong to new opp stack, but it is possible to navigate to them throught oppoverview*/
		OppsChooseEntity: {
			screen: OppsChooseEntity
		},
		SendMessageToEntity: {
			screen: SendMessageToEntity
		},
		OpportunityDetails: {
			screen: OpportunityDetails
		},
		DeleteCreateOppInfoModal: {
			screen: DeleteCreateOppInfoModal
		}
	},
	{
		navigationOptions: {
			gesturesEnabled: false
		},
		initialRouteName: 'OppsChooseEntity',
		defaultNavigationOptions: {
			header: null
		},
		headerMode: 'screen',
		headerLayoutPreset: 'left'
	}
);

const OppOverviewStack = createStackNavigator(
	{
		OppOverview: {
			screen: OppOverview
		},
		TargetProfile: {
			screen: TargetProfile
		},
		OhYes: {
			screen: OhYes
		}
	},
	{
		initialRouteName: 'OppOverview',
		defaultNavigationOptions: {
			header: null
		},
		headerMode: 'screen',
		headerLayoutPreset: 'left',
		navigationOptions: {
			gesturesEnabled: false
		}
	}
);
const NewOppStack = createStackNavigator(
	{
		NewOpp: {
			screen: NewOpp
		}
	},
	{
		navigationOptions: {
			gesturesEnabled: false
		},
		initialRouteName: 'NewOpp',
		defaultNavigationOptions: {
			header: null
		},
		headerMode: 'screen',
		headerLayoutPreset: 'left'
	}
);

const OppCrumbStack = createStackNavigator(
	{
		OppCrumb: {
			screen: OppCrumb
		}
	},

	{
		navigationOptions: {
			gesturesEnabled: false
		},
		initialRouteName: 'OppCrumb',
		defaultNavigationOptions: {
			header: null
		},
		headerMode: 'screen',
		headerLayoutPreset: 'left'
	}
);

const DashboardStack = BottomTabNavigator;
const MyProfileStack = createStackNavigator(
	{
		/* This 3 screens belong to new opp stack, but it is possible to navigate to them throught oppoverview*/
		MyProfile: {
			screen: MyProfile
		},
		ProfileSideMenu: {
			screen: ProfileSideMenu
		},
		PersonalInfo: {
			screen: PersonalInfo
		},
		SocialNetworks: {
			screen: SocialNetworks
		},
		WorkExperience: {
			screen: WorkExperience
		},
		AboutMe: {
			screen: AboutMe
		}
	},
	{
		navigationOptions: {
			gesturesEnabled: false
		},
		initialRouteName: 'MyProfile',
		defaultNavigationOptions: {
			header: null
		},
		headerMode: 'screen',
		headerLayoutPreset: 'left'
	}
);

const UserProfileStack = createStackNavigator(
	{
		UserProfile: {
			screen: UserProfile
		}
	},
	{
		navigationOptions: {
			gesturesEnabled: false
		},
		initialRouteName: 'UserProfile',
		defaultNavigationOptions: {
			header: null
		},
		headerMode: 'screen',
		headerLayoutPreset: 'left'
	}
);
const AppStack = createStackNavigator(
	{
		Opps: {
			screen: CreateOpportunityStack
		},
		ConnectEntities: {
			screen: ConnectEntitiesStack
		},
		OppOverviewStack: {
			screen: OppOverviewStack
		},
		AddNewConnector: {
			screen: AddNewConnectorStack
		},
		Modal: {
			screen: Modal
		},
		NewDashboard: {
			screen: DashboardStack
		},
		MyProfile: {
			screen: MyProfileStack
		},
		UserProfile: {
			screen: UserProfileStack
		},
		NewOppStack: {
			screen: NewOppStack
		},
		OppCrumbStack: {
			screen: OppCrumbStack
		},
		//Old Dashboard is here because the app is crashing when we remove it from our stack.
		oldDashboard: {
			screen: OldDashboard
		}
	},
	{
		navigationOptions: {
			gesturesEnabled: false
		},
		mode: 'modal',
		initialRouteName: 'NewDashboard',
		defaultNavigationOptions: {
			header: null
		},
		headerMode: 'none',
		cardStyle: {
			backgroundColor: 'rgba(0, 0, 0, .6)'
		},
		transitionConfig: () => fadeIn()
	}
);

export const createRootNavigator = (signedIn: boolean) => {
	return createSwitchNavigator(
		{
			AppStack: {
				screen: AppStack
			},
			AuthenticationStack: {
				screen: AuthenticationStack
			}
		},
		{
			navigationOptions: {
				gesturesEnabled: false
			},
			initialRouteName: signedIn ? 'AppStack' : 'AuthenticationStack'
		}
	);
};
