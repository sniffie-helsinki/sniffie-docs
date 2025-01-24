import { getSignedUrlAndPost } from "./getSignedUrlAndPost";

const data = {
  example: "json",
  and: "rest of the values",
};
const accountId = "replaceMeWithYourAccountId"; // you get these from Pricen
const token = "replaceMeWithYourToken"; // you get these from Pricen
getSignedUrlAndPost(accountId, token, data).then((response) => {
  console.log(response);
});
