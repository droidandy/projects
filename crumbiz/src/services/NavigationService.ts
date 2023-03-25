import { NavigationActions, StackActions } from 'react-navigation';
import { StackEnums } from '../navigation/stacks';

class NavigationService {
	private _navigator: any = null;

	navigate(routeName: string, params?: { [key: string]: any }) {
		this._navigator.dispatch(
			NavigationActions.navigate({
				routeName,
				params
			})
		);
	}

	goBack() {
		this._navigator.dispatch(NavigationActions.back());
	}

	setNavigator(value: any) {
		this._navigator = value;
	}

	resetStack(indexToReset: number, route: StackEnums) {
		const resetAction = StackActions.reset({
			index: indexToReset,
			actions: [
				NavigationActions.navigate({
					routeName: route
				})
			]
		});
		this._navigator.dispatch(resetAction);
	}
}

const navigationService = new NavigationService();
export default navigationService;
