import React, { Fragment, useEffect, useState } from "react";

import { Button, Input, ImageContainer, SpinningImageContainer } from "./styles";

import Actions from "../../actions";
import GeneralActions from "../../../../application/actions";

import WhiteArrowRight from "../../../../components/images/white_arrow_right";
import SubmitSpinner from "../../../../components/images/submit_spinner";

import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

function SubscribeButton(props) {
	const [value, updateValue] = useState("");

	const { landing, dispatch, general } = props;
	const { isInputVisible } = landing;

	function handleButtonClick(e) {
		updateShowInput(showInput ? false : true);
	}

	function validateEmail(emial) {
	  const emailRegexp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	  if (emailRegexp.test(emial)) {
	    return true;
	  } else {
	    return false;
	  }
	}

	const CREATE_SUBSCRIBER = gql`
		mutation createSubscriber($email: String!, $proRole: Boolean!) {
			createSubscriber(email: $email, proRole: $proRole) {
				email,
				id,
				proRole
			}
		}
	`;

	const [createSubscriber, { loading, error, data }] = useMutation(CREATE_SUBSCRIBER, {
		onCompleted({ createSubscriber }) {
			dispatch(GeneralActions.showNotification("Email submitted successfully", "default"));
			dispatch(Actions.submitEmailSuccess());
			updateValue('');
		},
		onError(error ) {
			if (error.graphQLErrors.length && error.graphQLErrors[0].message == "subscriber_exists") {
				dispatch(GeneralActions.showNotification("Subscriber already exists", "error"));
			} else {
				console.log("error", error);
				dispatch(GeneralActions.showNotification("Email submission error", "error"));
			}
		}
	});

	function handleClick() {
		if (!isInputVisible) {
			dispatch(Actions.showInput());
		} else {
			if (!validateEmail(value)) {
				dispatch(GeneralActions.showNotification("Please enter a valid email", "error"));
				console.log('enter valid email')
			} else {
				console.log('email ok')
				console.log('general', general);
				createSubscriber({ variables: { email: value, proRole: general.isPro } });
			}
		}
	}

	function handleInputChange(e) {
		let new_value = e.target.value;
		updateValue(new_value);
	}

	function renderButtonContent() {
		if (isInputVisible && !loading) {
			return (
				<ImageContainer>
					<WhiteArrowRight />
				</ImageContainer>
			);
		} else if (loading) {
			return (
				<SpinningImageContainer>
					<SubmitSpinner />
				</SpinningImageContainer>
			);
		} else {
			return "Join this Tax Season";
		}
	}

	return (
		<Fragment>
			<Button showInput={isInputVisible} onClick={handleClick}>
				{renderButtonContent()}
			</Button>
			{isInputVisible ? (
				<Input
					type="text"
					placeholder="Enter your email"
					onChange={handleInputChange}
					value={value}
				/>
			) : null}
			{
				//<SubmitButton>
				//<GreenArrowRight />
				//</SubmitButton>
			}
		</Fragment>
	);
}

export default SubscribeButton;
