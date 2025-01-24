import { getSignedUrlAndPost } from "./getSignedUrlAndPost";

const data = {
  example: "json",
  and: "rest of the values",
};
const token = "replaceMeWithToken"; // you get this from Sniffie
getSignedUrlAndPost(token, data).then((response) => {
  console.log(response);
});
