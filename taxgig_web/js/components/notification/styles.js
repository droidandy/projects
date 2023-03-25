import styled from "styled-components";

import { color } from "../styles";

export const NotificationContainer = styled.div`
	background-color: ${props => (props.type == "default" ? color.green : color.red)};
	color: white;
	z-index: 101;
    border: none;
    border-radius: 4px;
    padding: 0 16px;
    height: 50px;
    width: 80%;
    max-width: 382px;
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    top: 5%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    animation: notification-animation 0.5s ease-in-out 1;
    transition: all 0.3s ease;
`;

export const NotificationText = styled.div`
	font-family: 'SF Pro Display';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 26px;
    color: #fff;
`;

export const NotificationIcon = styled.div`
	border: 0;
    background: transparent;
    padding: 0;
    width: 25px;
    height: 25px;
`;

