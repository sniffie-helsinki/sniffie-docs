import { getSignedUrlAndPost } from "./getSignedUrlAndPost";

const data = {
  example: "json",
  and: "rest of the values",
};
const environment = "production"; // or "staging"
const accountId = ""; // you get these from Pricen
const token = ""; // you get these from Pricen
getSignedUrlAndPost(accountId, token, data, environment).then((response) => {
  console.log(response);
});
