import { getSignedUrlAndPost } from "./getSignedUrlAndPost";




const token = ""; // you get this from Pricen
const env = "prod"; // or "staging"
getSignedUrlAndPost(token, undefined, './data/latest-competitorProducts.jsonl.gz', 'competitor-upload-link', env).then((response) => {
  console.log(response);
});
