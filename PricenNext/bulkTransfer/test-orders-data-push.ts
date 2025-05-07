import { getSignedUrlAndPost } from "./getSignedUrlAndPost";

const token = ""; // you get this from Pricen
const env = "prod"; // or "staging"
getSignedUrlAndPost(
  token,
  undefined,
  "./data/sniffie-demo-orders-2024-02-01T00_00_00Z-2024-03-01T00_00_00Z.jsonl.gz",
  "orders-upload-link",
  env
).then((response) => {
  console.log(response);
});
