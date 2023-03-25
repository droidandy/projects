import React from "react";

import { Button, ButtonText } from "./styles";

const FilledButtonGreen = ({ innerText, onClick, disabled, to }) => {
    return (
        <Button onClick={onClick} disabled={disabled} to={to}>
            <ButtonText>{innerText}</ButtonText>
        </Button>
    );
};

export default FilledButtonGreen;
