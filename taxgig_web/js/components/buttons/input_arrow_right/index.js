import React, { Fragment, useEffect, useState } from "react";

import { InputContainer, Input, InputLink } from "./styles";
import GreenArrowRight from "../../images/green_arrow_right";

import LandingActions from "../../../pages/landing/actions";
import GeneralActions from "../../../application/actions";

import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

function InputArrowRight(props) {
		const { general, dispatch } = props;
		const [ value, updateValue ] = useState('');

		const CREATE_SUBSCRIBER = gql`
		mutation createSubscriber($email: String!, $proRole: Boolean!) {
			createSubscriber(email: $email, proRole: $proRole) {
				id
			}
		}`;

	function validateEmail(emial) {
	  const emailRegexp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	  if (emailRegexp.test(emial)) {
	    return true;
	  } else {
	    return false;
	  }
	}


	const [createSubscriber, { loading, error, data }] = useMutation(CREATE_SUBSCRIBER, {
		onCompleted({ createSubscriber }) {
			dispatch(GeneralActions.showNotification("Email submitted successfully", "default"));
			dispatch(LandingActions.submitEmailSuccess());
			updateValue('');
		},
		onError(error) {
			if ( error.graphQLErrors.length && error.graphQLErrors[0].message == "subscriber_exists") {
				dispatch(GeneralActions.showNotification("Subscriber already exists", "error"));
			} else {
				console.log("error", error);
				dispatch(GeneralActions.showNotification("Email submission error", "error"));
			}
		}
	});

		function handleOnChange(e) {
			updateValue(e.target.value);
		}

		function handleOnSubmit() {
			if (!validateEmail(value)) {
				dispatch(GeneralActions.showNotification("Please enter a valid email", "error"));
			} else {
				console.log('email ok')
				createSubscriber({ variables: { email: value, proRole: general.isPro } });
			}
		}

    return (
        <InputContainer>
            <Input value={value} onChange={handleOnChange} placeholder="Enter your email" />
            <InputLink onClick={handleOnSubmit} >
            	<GreenArrowRight />
            </InputLink>
        </InputContainer>
    );
};

export default InputArrowRight;
