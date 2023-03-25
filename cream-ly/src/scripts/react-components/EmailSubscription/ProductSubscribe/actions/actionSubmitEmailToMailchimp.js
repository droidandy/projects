import $ from "jquery";
/*
import addEmailToMailchimp, { ajaxRequest } from "@Core/api/mailchimp";

export default (signUpLocation, email, onSubmit = null) => {
   addEmailToMailchimp({ signUpLocation, email }).then(() => {
    if (typeof onSubmit == "function") onSubmit();
  }); 

  ajaxRequest({ signUpLocation, email, onSubmit });

  return false;
};
*/
const getURL = function(signUpLocation) {
  const url =
    "https://cream.us16.list-manage.com/subscribe/post-json?c=?&u=9bd8387e41af50a27ad877924&id=4b8c1ecdec&SIGNUP=" +
    signUpLocation;

  return url;
};

export default (signUpLocation, email, onSubmit = null) => {
  const url = getURL(signUpLocation);

  const options = {
    type: "GET", // GET & url for json slightly different
    url,
    data: { EMAIL: email },
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    error: function(err) {
      console.error(err);
      //alert("Could not connect to the registration server.");
    },
    success: function(data) {
      /* if (data.result != "success") {
        // Something went wrong, parse data.msg string and display message
      } else {
        // It worked, so hide form and display thank-you message.
      } */
      if (typeof onSubmit == "function") onSubmit();
    },
  };
  $.ajax(options);

  return false;
};
