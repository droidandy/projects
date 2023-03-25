import React from 'react';

import { NotificationContainer, NotificationText, NotificationIcon } from './styles';

import WhiteCross from "../images/white_cross";

function Notification(props) {
	const { text, type, hide } = props;

	return(
		<NotificationContainer type={type}>
			<NotificationText>{text}</NotificationText>
			<NotificationIcon onClick={hide}><WhiteCross /></NotificationIcon>
		</NotificationContainer>
	);	

}

export default Notification;