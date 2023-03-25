import React, { useEffect, Fragment } from 'react';
import Body from "../components/body";
import CalendlySection from '../components/consultation/consultation';

function ConsultationView(props) {
	function renderConsultationView() {
		return (
            <Fragment>
                <CalendlySection/>
            </Fragment>
		);
	}
	return <Body children={renderConsultationView()} />;
}

export default ConsultationView;
