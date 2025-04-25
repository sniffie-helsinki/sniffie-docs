import { getSignedUrlAndPost } from "./getSignedUrlAndPost";


const token = "<accountId>&&<token>"; // you get this from Pricen
getSignedUrlAndPost(token, undefined, './data/latest-competitorProducts.jsonl.gz', 'competitor-upload-link').then((response) => {
  console.log(response);
});
