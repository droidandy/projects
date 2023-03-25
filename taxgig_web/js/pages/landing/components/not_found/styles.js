import styled from "styled-components";
import { Button } from "../../../../components/buttons/filled_button/styles";

import {
	color,
	device,
	f_sb
} from "../../../../components/styles";

export const NotFoundContainer = styled.div`
	    padding: 104px 0;
`;

export const NotFoundSubtitle = styled.div`
	color: ${color.darkGrey};
    text-align: center;
    font-size: 16px;
    line-height: 31px;
    letter-spacing: 0.3px;
`;

export const NotFoundImgContainer = styled.div`
	text-align: center;
    margin-bottom: 56px;
`;

export const BackToHomeButton = styled(Button)`
	width: auto;
	text-transform: none;
	margin: 0 auto;
	margin-top: 30px;
`;