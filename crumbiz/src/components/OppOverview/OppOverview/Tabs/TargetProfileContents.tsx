import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Animated } from 'react-native';
import { deviceHeight } from '../../../../utils/dimensions';
import InteractionMenu from './InteractionMenu';

import { DynamicObject, PlainFunction } from '../../../../types/interfaces';

export type activeTabType = string | number | null;
interface IProps {
	sendInteractionHandler: PlainFunction;
	defaultTab?: React.ReactNode;
	activeTab: activeTabType;
	tabs: DynamicObject<any>;
	setActiveTab: Function;
	entityUserName: string;
	targetId: string;
}

const TargetProfileContents: FC<IProps> = props => {
	const {
		tabs,
		activeTab,
		defaultTab,
		setActiveTab,
		entityUserName,
		targetId
	} = props;

	const ActiveTypeElement = tabs[activeTab!] || defaultTab;
	return (
		<>
			<S.Interactions>
				<InteractionMenu
					activeButton={activeTab}
					setActiveButton={setActiveTab}
					entityUserName={entityUserName}
					targetId={targetId}
				/>
			</S.Interactions>
			<S.ContentContainer>{ActiveTypeElement}</S.ContentContainer>
		</>
	);
};

const S: any = {};

S.Interactions = styled.View`
	align-items: center;
	justify-content: center;
	top: ${(deviceHeight * 0.09375) / 2};
	z-index: 1;
`;

// overflow: hidden; // TODO All - border radius is of the content container is not seen without the overflow hidded, but with overflow hidden it cuts the newsfeed content
S.ContentContainer = styled(Animated.View)`
	border-top-right-radius: 18px;
	border-top-left-radius: 18px;
	min-height: ${deviceHeight * 0.5};
`;

export default TargetProfileContents;
