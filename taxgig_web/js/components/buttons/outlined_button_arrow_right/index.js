import React from "react";

import { Button, ButtonText } from "./styles";
import GreenArrowRight from "../../images/green_arrow_right";

const OutlinedButtonArrowRight = ({ innerText, onClick, disabled, to }) => {
    return (
        <Button onClick={onClick} disabled={disabled} to={to}>
            <ButtonText>{innerText}</ButtonText>
            <GreenArrowRight />
        </Button>
    );
};

export default OutlinedButtonArrowRight;
