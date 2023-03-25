function locationPropertesRefine(props) {
  if (props.countryCode === "NL") props.zip = "1011AA"; // Shopify doesn't accept ip-api zip without letters

  if (props.countryCode === "IE") props.region = "Dublin"; // Shopify doesn't accept ip-api regions for IE

  if (props.countryCode === "RU")
    if (props.zip == null || props.zip == "") props.zip = 101000; // use Moscow zip if zip is empty

  if (props.countryCode === "UA")
    if (props.zip == null || props.zip == "") props.zip = "03134"; // use Kiev zip if zip is empty

  if (props.countryCode === "CY")
    if (props.zip == null || props.zip == "")
      // Cyprus
      props.zip = 1000; // use Cyprus zip if zip is empty

  if (props.countryCode === "KZ")
    if (props.zip == null || props.zip === "")
      // Kazahstan
      props.zip = "010000"; // use Astana zip if zip is empty

  if (props.countryCode == "UZ")
    if (props.zip == null || props.zip === "")
      // Usbekistan
      props.zip = 100012; // use Tashkent zip if zip is empty

  if (props.countryCode == "MA")
    if (props.zip == null || props.zip === "")
      // Morocco
      props.zip = 100012; // use Rabat zip if zip is empty

  if (props.countryCode === "IL")
    if (props.zip == null || props.zip === "")
      // Israel
      props.zip = 6100000; // use Tel Aviv zip if zip is empty

  if (props.countryCode === "ES")
    if (props.zip == null || props.zip === "")
      // Spain
      props.zip = 28001; // use Madrid zip if zip is empty

  // Georgia
  if (props.countryCode === "GE")
    if (props.zip == null || props.zip === "")
      // use Tbilisi zip if zip is empty
      props.zip = "0108";

  if (props.countryCode === "BY") {
    // Shopify doesn't accept ip-api BYR
    props.currency = "BYN";
    if (props.zip == null || props.zip === "") props.zip = 220103; // use Tashkent zip if zip is empty
  }

  return props;
}
