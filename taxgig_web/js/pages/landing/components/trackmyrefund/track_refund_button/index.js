import React from "react";

import { Button, ButtonText } from "./styles";

const TrackRefundButton = ({ innerText, onClick, disabled, to }) => {
    return (
        <Button onClick={onClick} disabled={disabled} target="blank" href={to}>
            <ButtonText>{innerText}</ButtonText>
        </Button>
    );
};

export default TrackRefundButton;
