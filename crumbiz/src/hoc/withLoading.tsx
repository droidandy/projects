import React from 'react';
import { useSelector } from 'react-redux';
import { CoveringLoadingModal } from '../components/Shared';
import { ISwitcherProps } from '../types/interfaces';

interface IProps {}
interface LoadingParams {
	selector: (state: any) => boolean;
	Loader?: React.FC<any>;
	Switcher?: React.FC<any>;
}

const DefaultLoader = () => <CoveringLoadingModal visible />;

export const DefaultSwitcher: React.FC<ISwitcherProps> = props => {
	const { loading, LoadingComponent, WrappedComponent } = props;

	if (loading) {
		return <LoadingComponent />;
	}

	return <WrappedComponent {...props} />;
};
// Decides forwarding the loading state to the wrapped component instead of using the covering loader
export const PropagatingSwitcher: React.FC<ISwitcherProps> = props => {
	const { loading, WrappedComponent } = props;

	return <WrappedComponent loading={loading} {...props} />;
};

const withLoading = ({ selector, Loader, Switcher }: LoadingParams) => {
	const LoadingComponent = Loader || DefaultLoader;
	const SwitcherComponent = Switcher || DefaultSwitcher;

	return WrappedComponent => (props: IProps) => {
		const loading = useSelector(selector);

		return (
			<SwitcherComponent
				loading={loading}
				LoadingComponent={LoadingComponent}
				WrappedComponent={WrappedComponent}
				{...props}
			/>
		);
	};
};

export default withLoading;
