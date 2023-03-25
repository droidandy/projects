import React from "react";

import { Button, ButtonText } from "./styles";
import WhiteArrowRight from "../../images/white_arrow_right";

const FilledButtonArrowRight = ({ innerText, onClick, disabled }) => {
    return (
        <Button href="mailto:support@taxgig.com" disabled={disabled}>
            <ButtonText>{innerText}</ButtonText>
            <WhiteArrowRight />
        </Button>
    );
};

export default FilledButtonArrowRight;
