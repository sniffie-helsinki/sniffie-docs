import { getSignedUrlAndPost } from "./getSignedUrlAndPost";

const token = "pierce-test&&byo4%hY6c3Tbox0^#L#to$IiuB"; // you get this from Pricen
const env = "prod"; // or "staging"
getSignedUrlAndPost(
  token,
  undefined,
  "./data/competitorData.jsonl",
  "competitor-data/get-upload-link",
  env,
  'bulk-downloads'
).then((response) => {
  console.log(response);
});
