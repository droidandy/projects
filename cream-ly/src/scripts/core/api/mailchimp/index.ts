//@ts-nocheck

import $ from "jquery";

export const getURL = ({ signUpLocation, email }) => {
  const host = "https://cream.us16.list-manage.com";
  const path = "/subscribe/post-json";
  const url = new URL(host + path);

  url.searchParams.append("u", "9bd8387e41af50a27ad877924");
  url.searchParams.append("id", "4b8c1ecdec");

  //c=jQuery36003914043886518913_1614925186333
  url.searchParams.append("c", "?"); //add cross domain CORS support
  url.searchParams.append("_", 1614925186334);
  //merge tag

  url.searchParams.append("EMAIL", email);
  if (signUpLocation) url.searchParams.append("SIGNUP", signUpLocation);

  return url.href;
};

export default ({ email, signUpLocation = null }) => {
  const url = getURL({ signUpLocation, email });

  return fetch(url, {
    method: "GET",
  }).then((res) => {
    console.log("response from mailchimp", res);
    return res;
    //return res ? res.json() : null;
  });
};

export const ajaxRequest = ({
  email,
  signUpLocation = null,
  onSubmit = null,
}) => {
  const options = {
    type: "GET", // GET & url for json slightly different
    url: getURL({ signUpLocation, email }),
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    error: function(err) {
      console.error(err);
      //alert("Could not connect to the registration server.");
    },
    success: function(data) {
      //* if (data.result != "success") {
      // Something went wrong, parse data.msg string and display message
      //} else {
      // It worked, so hide form and display thank-you message.
      //}
      if (typeof onSubmit == "function") onSubmit();
    },
  };

  $.ajax(options);
};
