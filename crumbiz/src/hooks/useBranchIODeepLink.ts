import branch from 'react-native-branch';
import { redirectHandler } from '../navigation/branchDeeplinkHandler';
import { useEffect, useState } from 'react';
import { setRedirectedFromExternal } from '../store/actions/externalLinksActions';
import { useDispatch } from 'react-redux';
import { navigationService } from '../services';
import { ScreensEnum } from '../navigation/screens';

const useBranchIODeepLink = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		branch.subscribe(({ error, params }: { error: any; params: any }) => {
			if (error) {
				navigationService.navigate(ScreensEnum.MODAL, {
					headerText: 'We couldnt redirect you',
					message: 'Please try again in few minutes'
				});
				return;
			}

			if (params.$deeplink_path) {
				dispatch(setRedirectedFromExternal());
				params.$deeplink_path && redirectHandler(params);
			}
		});
	}, []);
};

export default useBranchIODeepLink;
