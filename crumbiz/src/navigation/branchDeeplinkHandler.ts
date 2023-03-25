import { navigationService } from '../services';
import store from '../store';
import {
	resetOppOverviewState,
	setSelectedOppAndRole
} from '../store/actions/oppOverviewActions';
import { chooseOppId } from '../store/actions/sendIntroActions';
import { setDeepLink } from '../store/actions/deepLinksActions';
import { ScreensEnum } from './screens';
import { StackEnums } from './stacks';
import {
	getNewOppAndTargetProfile,
	resetTargetOverviewInteractions
} from '../store/actions/oppOverviewActions';

interface IBaseDeepLinkParams {
	$deeplink_path: string;
}

interface IOppOverviewParams extends IBaseDeepLinkParams {
	/**
	 * @description user role.
	 * */
	r: string;

	/**
	 * @description initial tab index.
	 * */
	t: string;

	/**
	 * @description opportunity id.
	 * */
	id: string;
}

interface ILoginParams extends IBaseDeepLinkParams {
	email: string;

	/**
	 * @description Token to validate
	 * */
	code: string;
}

interface ICreateNewPasswordParams extends IBaseDeepLinkParams {
	email: string;

	/**
	 * @description Token to validate
	 * */
	code: string;
}

interface ITargetProfileParams extends IBaseDeepLinkParams {
	/**
	 * @description opportunity id.
	 * */
	id: string;

	/**
	 * @description target profile user id.
	 * */
	targetId: string;

	/**
	 * @description viewer user role
	 * */
	r: string;
}

interface IConnectChooseOpportunityParams extends IBaseDeepLinkParams {
	/**
	 * @description opportunity id.
	 * */
	id: string;
}

type DeepLinkParams =
	| IOppOverviewParams
	| ILoginParams
	| ICreateNewPasswordParams
	| ITargetProfileParams
	| IConnectChooseOpportunityParams;

export const redirectHandler = (params: DeepLinkParams) => {
	const pathPrefix = params.$deeplink_path.toLowerCase();
	const paths: { [key: string]: string } = {
		login: ScreensEnum.LOGIN,
		createnewpassword: ScreensEnum.CREATE_NEW_PASSWORD,
		dashboard: ScreensEnum.NEW_DASHBOARD,
		oppoverview: ScreensEnum.OPP_OVERVIEW,
		targetProfile: ScreensEnum.TARGET_PROFILE,
		newopp: ScreensEnum.NEW_OPP,
		oppcrumb: ScreensEnum.OPP_CRUMB,
		connect_choose_entity: ScreensEnum.CONNECT_CHOOSE_ENTITY
	};

	/**
	 * When navigating to a screen that requires authentication,
	 * we need to check that the user is authenticated first.
	 * If the user is not authenticated, we add the params to redux.
	 * App.tsx will handle the redirect after authenticating.
	 * */
	if (
		!['login', 'createnewpassword'].includes(pathPrefix) &&
		//@ts-ignore
		!store.getState().auth.userAuthenticated
	) {
		store.dispatch(setDeepLink(params as any));
		return;
	}

	if (
		['oppoverview', 'newopp', 'oppcrumb', 'targetprofile'].includes(pathPrefix)
	) {
		const { r = 0, id } = params as IOppOverviewParams;
		const setOppAndRole = () => {
			store.dispatch(
				setSelectedOppAndRole({
					oppId: id,
					role: Number(r)
				})
			);
		};

		if (pathPrefix === 'oppcrumb') {
			setOppAndRole();
			store.dispatch(getNewOppAndTargetProfile());
			store.dispatch(resetTargetOverviewInteractions());
		} else {
			store.dispatch(resetOppOverviewState());
			setOppAndRole();
		}
	}

	if (pathPrefix === 'targetprofile') {
		const paramsToPass = {
			...params,
			shouldRedirectToTargetProfile: true
		};
		navigationService.navigate(ScreensEnum.OPP_OVERVIEW, paramsToPass);
		return;
	}

	if (pathPrefix === 'connect_choose_entity') {
		const { id } = params as IConnectChooseOpportunityParams;
		store.dispatch(chooseOppId(id));
	}

	paths[pathPrefix] && navigationService.navigate(paths[pathPrefix], params);
};
