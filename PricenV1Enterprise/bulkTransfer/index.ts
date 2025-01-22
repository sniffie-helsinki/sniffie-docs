import { getSignedUrlAndPost } from "./getSignedUrlAndPost";

const data = {
  example: "json",
  and: "rest of the values",
};
const accountId = "replaceMeWithYourAccountId"; // you get these from Sniffie
const token = "replaceMeWithYourToken"; // you get these from Sniffie
getSignedUrlAndPost(accountId, token, data).then((response) => {
  console.log(response);
});
