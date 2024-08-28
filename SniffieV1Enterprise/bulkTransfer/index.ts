import { getSignedUrlAndPost } from "./getSignedUrlAndPost";

const data = {
  example: "json",
  and: "rest of the values",
};
const token = "replaceMeWithYourToken";
getSignedUrlAndPost(token, data).then((response) => {
  console.log(response);
});
