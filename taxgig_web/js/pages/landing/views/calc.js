import React, { Fragment } from "react";

// Wrapper component
import Body from "../components/body";

// Page sections
import CalculatorSection from "../components/calc"


function CalcView(props) {
	function renderCalc() {
		return (
			<Fragment>
				<CalculatorSection />
			</Fragment>
		);
	}

	return <Body children={renderCalc()} />;
}

export default CalcView;
