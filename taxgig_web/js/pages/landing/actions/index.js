import Constants from "../constants";

import GeneralActions from "../../../application/actions";

// const FAQ_CATEGORIES = gql`
//   {
//     allFaqCategories {
//       id
//       title
//     }
//   }
// `;

// function validateEmail(emial) {
//   const emailRegexp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
//   if (emailRegexp.test(emial)) {
//     return true;
//   } else {
//     return false;
//   }
// }

const Actions = {
	showInput: () => {
		return dispatch => {
			dispatch({
				type: Constants.SHOW_EMAIL_INPUT
			});
		};
	},

	setLoading: () => {
		return dispatch => {
			dispatch({
				type: Constants.TOGGLE_LOADING
			});
		};
	},

	// Trigger sucess
	submitEmailSuccess: () => {
		return dispatch => {
			dispatch({
					type: Constants.SUBMIT_EMAIL_SUCCESSFUL
				});
		};
	}

	// fetchFaqCategories: () => {
	// 	const { loading, error, data } = useQuery(FAQ_CATEGORIES);
	// 	return dispatch => {

	// 		if (loading) {
	// 			dispatch({
	// 				type: Constants.FETCH_FAQ_CATEGORIES
	// 			});
	// 		}
	// 		if (data) {
	// 			dispatch({
	// 				type: Constants.FETCH_FAQ_CATEGORIES_SUCCESS,
	// 				faq_categories: data.faq_categories
	// 			});
	// 		}

	// 		if (error) {
	// 			dispatch({
	// 				type: Constants.FETCH_FAQ_CATEGORIES_ERROR
	// 			});
	// 		}
	// 	}

	// 	console.log("fetching");
	// }
};

export default Actions;
