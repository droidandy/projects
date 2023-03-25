import { enqueue } from "../../utils/queue";
import { DocumentNode } from "graphql";
import getConfig from "./config";

export const grahqlFetch = function(
  query: string | DocumentNode,
  variables = null
) {
  const config = getConfig();
  const url = `https://${config.domain}/api/${config.apiVersion}/graphql`; //use latest

  const queryPrepare = (query: string | DocumentNode): string => {
    if (typeof query === "string") return query;
    if (
      typeof query === "object" &&
      query.loc &&
      query.loc.source &&
      query.loc.source.body
    )
      return query.loc.source.body; //gql AST object
    throw Error("unknown query type " + JSON.stringify(query));
  };

  const queryString = queryPrepare(query);

  //console.log("queryString", queryString);
  //console.log("variables", variables);

  return enqueue(
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-shopify-storefront-access-token": config.apiToken,
      },
      body: JSON.stringify({ query: queryString, variables }),
    })
      .then((response) => {
        //console.log("storefront response", response);

        if (response == null) return null;
        return typeof response == "object" ? response.json() : response;
      })
      .then((response) => {
        if (
          response &&
          Array.isArray(response.errors) &&
          response.errors.length
        ) {
          console.error("error in storefront response", response.errors);
          throw Error("error in storefront response");
        }

        // console.log("storefront response", response);

        return response;
      })
    /*
    response error
    {
    "errors": [
        {
            "message": "Nullability mismatch on variable $input and argument input (CustomerCreateInput / CustomerCreateInput!)",
            "locations": [
                {
                    "line": 2,
                    "column": 20
                }
            ],
            "path": [
                "mutation customerCreate",
                "customerCreate",
                "input"
            ],
            "extensions": {
                "code": "variableMismatch",
                "variableName": "input",
                "typeName": "CustomerCreateInput",
                "argumentName": "input",
                "errorMessage": "Nullability mismatch"
            }
        }
    ]
}
    */
  );
};

const catchGraphqlErrors = (error) => {
  class CheckoutIsAlreadyCompleteError extends Error {
    constructor(message) {
      super(message);
      this.name = "CheckoutIsAlreadyCompleteError";
    }
  }

  if (error.message.match("Checkout is already completed") !== null) {
    throw new CheckoutIsAlreadyCompleteError(`Checkout is already completed`);
  }

  throw error;
};

export function storefrontId2number(id, entityType) {
  return Buffer.from(id, "base64")
    .toString()
    .replace("gid://shopify/" + entityType + "/", "");
}

export function number2StorefrontId(id, entityType) {
  return Buffer.from("gid://shopify/" + entityType + "/" + id).toString(
    "base64"
  );
}
